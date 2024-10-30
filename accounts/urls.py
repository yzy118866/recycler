from rest_framework import routers

from accounts.views import (
    GlobalPreferencesOverrideViewSet,
    UserRegisterViewset,
    UserViewset,
)

router = routers.DefaultRouter()

router.register("auth/register", UserRegisterViewset, basename="register")
router.register("users", UserViewset, basename="users")
router.register("global", GlobalPreferencesOverrideViewSet, "global")
