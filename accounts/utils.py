from typing import Iterable

from django.contrib.auth.models import AbstractBaseUser, AnonymousUser

from accounts.models import User, UserRole


def get_user_role(user: User | AnonymousUser | AbstractBaseUser) -> UserRole | None:
    if isinstance(user, User):
        return user.get_role()

    return None


def user_has_role(
    user: User | AnonymousUser | AbstractBaseUser, role: UserRole | Iterable[UserRole], include_admin: bool = False
) -> bool:
    if isinstance(role, (UserRole, str)):
        role = [role]

    user_role = get_user_role(user)
    if not user_role:
        return False
    elif user_role == UserRole.ADMIN and include_admin:
        return True

    return user_role in role


def roles_join(*args: set[UserRole]):
    res = set()
    for subset in args:
        res.update(subset)
    return res
