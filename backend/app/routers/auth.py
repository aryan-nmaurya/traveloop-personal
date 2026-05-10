from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, decode_token, hash_password
from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RefreshRequest,
    ResetPasswordRequest,
    SignupRequest,
)
from app.schemas.user import SignupResponse, UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=SignupResponse, status_code=201)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user, access_token, refresh_token = auth_service.register_user(db, data)
    return SignupResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=SignupResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user, access_token, refresh_token = auth_service.login_user(db, data)
    return SignupResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh")
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    new_access_token = auth_service.refresh_access_token(db, data.refresh_token)
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_service.logout_user(db, current_user.id)
    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        token = create_access_token(
            {"sub": str(user.id), "type": "password_reset"},
            expires_delta=timedelta(hours=1),
        )
        # In production, send token via email. For now it is self-contained.
        # The token would be delivered as: /reset-password?token=<token>
        _ = token  # noqa: F841 — suppress "unused" warning until email service added
    # Always return the same message to avoid leaking whether email exists.
    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.token)
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link is invalid or expired.",
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link is invalid or expired.",
        )

    user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated."}
