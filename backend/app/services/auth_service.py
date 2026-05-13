from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.core.config import settings
from app.models.refresh_token import RefreshToken
from app.models.revoked_token import RevokedToken
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest


def register_user(db: Session, data: SignupRequest) -> tuple[User, str, str]:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.firstName,
        last_name=data.lastName,
        phone=data.phone,
        city=data.city,
        country=data.country,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = _store_refresh_token(db, user.id)
    return user, access_token, refresh_token


def login_user(db: Session, data: LoginRequest) -> tuple[User, str, str]:
    user = db.query(User).filter(User.email == data.email, User.is_active == True).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = _store_refresh_token(db, user.id)
    return user, access_token, refresh_token


def refresh_access_token(db: Session, token: str) -> tuple[str, str]:
    """Validate the refresh token, rotate it, and return new (access_token, refresh_token)."""
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    db_token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == token,
            RefreshToken.revoked == False,
            RefreshToken.expires_at > datetime.now(timezone.utc),
        )
        .first()
    )
    if not db_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired or revoked")

    user_id = payload.get("sub")

    # Revoke the used refresh token (rotation — each token can only be used once).
    db_token.revoked = True
    db.commit()

    new_access_token = create_access_token({"sub": user_id})
    new_refresh_token = _store_refresh_token(db, int(user_id))
    return new_access_token, new_refresh_token


def logout_user(db: Session, user_id: int, jti: str | None = None, token_expires_at: datetime | None = None) -> None:
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id, RefreshToken.revoked == False
    ).update({"revoked": True})

    if jti and token_expires_at:
        db.merge(RevokedToken(jti=jti, expires_at=token_expires_at))

    # Prune stale blocklist entries to keep the table lean.
    db.query(RevokedToken).filter(RevokedToken.expires_at < datetime.now(timezone.utc)).delete()
    db.commit()


def _store_refresh_token(db: Session, user_id: int) -> str:
    token = create_refresh_token({"sub": str(user_id)})
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db_token = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
    db.add(db_token)
    db.commit()
    return token
