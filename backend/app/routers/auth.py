from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

import logging

from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import create_access_token, decode_token, hash_password
from app.dependencies.auth import get_current_user, security

logger = logging.getLogger(__name__)
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
@limiter.limit("10/minute")
def signup(request: Request, data: SignupRequest, db: Session = Depends(get_db)):
    user, access_token, refresh_token = auth_service.register_user(db, data)
    return SignupResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=SignupResponse)
@limiter.limit("15/minute")
def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    user, access_token, refresh_token = auth_service.login_user(db, data)
    return SignupResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh")
@limiter.limit("30/minute")
def refresh(request: Request, data: RefreshRequest, db: Session = Depends(get_db)):
    new_access_token, new_refresh_token = auth_service.refresh_access_token(db, data.refresh_token)
    return {"access_token": new_access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payload = decode_token(credentials.credentials)
    jti = payload.get("jti") if payload else None
    exp = payload.get("exp") if payload else None
    expires_at = datetime.fromtimestamp(exp, tz=timezone.utc) if exp else None
    auth_service.logout_user(db, current_user.id, jti, expires_at)
    return {"message": "Logged out successfully"}


@router.post("/forgot-password")
@limiter.limit("5/minute")
def forgot_password(request: Request, data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if user:
        token = create_access_token(
            {"sub": str(user.id), "type": "password_reset"},
            expires_delta=timedelta(hours=1),
        )
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        # TODO: replace with real email delivery (SMTP / SendGrid / SES) in production.
        # The reset link is logged to stdout so developers can test the flow locally.
        logger.warning("PASSWORD RESET — %s — %s", user.email, reset_url)
    # Always return the same generic message to avoid leaking whether an email exists.
    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password")
@limiter.limit("10/minute")
def reset_password(request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):
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
