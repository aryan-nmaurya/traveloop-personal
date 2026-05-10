from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, SignupRequest
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
