from typing import TypeAlias

from rest_framework import permissions

from accounts.utils import user_has_role

RolesList: TypeAlias = list | set


class BaseRolePermission(permissions.BasePermission):
    roles_list: RolesList
    allow_safe: bool = False
    allow_methods = None

    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False

        return bool(
            (self.allow_safe and request.method in permissions.SAFE_METHODS)
            or user_has_role(user, self.roles_list, include_admin=True)
            and (self.allow_methods is None or request.method in self.allow_methods)
        )


class RolePermission(BaseRolePermission, permissions.OperationHolderMixin):
    def __init__(
        self, roles_list: RolesList, allow_safe: bool | None = None, allow_methods: list[str] | None = None
    ) -> None:
        self.roles_list = roles_list
        if allow_safe is not None:
            self.allow_safe = allow_safe
        if allow_methods is not None:
            self.allow_methods = allow_methods
        super().__init__()

    def __call__(self):
        return self


class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
