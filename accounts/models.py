from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserRole(models.TextChoices):
    ADMIN = "admin", _("Админ")
    BUH_INN = "buh_inn", _("Бухгалтер свой")
    BUH_EXT = "buh_ext", _("Бухгалтер заказчика")
    OUTLET = "outlen", _("Отходообразователь")
    DISPATCHER = "disp", _("Диспетчер")
    OTV = "otv", _("Отвальщик")
    MANAGER = "man", _("Мастер участка")


ROLES_INN = {
    UserRole.BUH_INN,
    UserRole.DISPATCHER,
    UserRole.OUTLET,
    UserRole.OTV,
    UserRole.MANAGER,
}
ROLES_EXT = {UserRole.BUH_EXT, UserRole.OUTLET, UserRole.DISPATCHER}
ROLES_BUH = {UserRole.BUH_EXT, UserRole.BUH_INN}
ROLES_BUH_EXT = {UserRole.BUH_EXT}
ROLES_BUH_INN = {UserRole.BUH_INN, UserRole.DISPATCHER}
ROLES_ADMIN_INN = {UserRole.BUH_INN, UserRole.DISPATCHER}
ROLES_ADMIN = {UserRole.ADMIN}


class User(AbstractUser):
    role = models.CharField(
        _("Роль"),
        choices=UserRole.choices,
        max_length=10,
        null=True,
        blank=True,
    )
    company = models.ForeignKey(
        "recycler.Company",
        models.CASCADE,
        verbose_name=_("Компания"),
        related_name="users",
        null=True,
        blank=True,
    )

    def get_role(self) -> UserRole | None:
        if self.is_superuser:
            return UserRole.ADMIN
        return self.role  # type: ignore

    def get_full_name(self) -> str:
        if self.first_name or self.last_name:
            return " ".join([self.first_name, self.last_name]).strip()
        return self.username
