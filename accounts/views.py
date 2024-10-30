import json

from django.db import transaction
from drf_spectacular.utils import (
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
    inline_serializer,
)
from dynamic_preferences.api.viewsets import GlobalPreferencesViewSet
from rest_framework import (
    decorators,
    exceptions,
    fields,
    permissions,
    response,
    viewsets,
)

from accounts.models import ROLES_ADMIN, User, UserRole
from accounts.permissions import RolePermission
from accounts.serializers import (
    StatusOkSerializer,
    UserRegisterSerializer,
    UserSelfEditSerializer,
    UserSerializer,
)
from accounts.utils import user_has_role


class UserRegisterViewset(viewsets.ModelViewSet):
    serializer_class = UserRegisterSerializer
    permission_classes = []
    http_method_names = ["post"]

    def perform_create(self, serializer: UserRegisterSerializer):
        assert isinstance(serializer.validated_data, dict)
        exists = User.objects.filter(email=serializer.validated_data["email"]).exists()
        if exists:
            raise exceptions.APIException(detail="User with this email already exists", code="user_exists")

        with transaction.atomic():
            # -- Pre registration
            user: User = serializer.save(
                email=serializer.validated_data["email"].lower(),
            )
            user.set_password(serializer.validated_data.get("password"))
            if not user.username:
                user.username = user.email
            user.save(update_fields=["password", "username"])

        # -- Post registration


class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    search_fields = ["username", "email", "first_name", "last_name"]
    filterset_fields = ["is_active", "role"]

    def get_queryset(self):
        if user_has_role(self.request.user, [UserRole.ADMIN]):
            return self.queryset
        return self.queryset.filter(id=self.request.user.pk)

    def get_object(self):
        pk = self.kwargs.get("pk")

        if pk in ["current", "me"] and self.request.user.is_authenticated:
            return self.request.user

        return super().get_object()

    @extend_schema(
        request=None,
        responses={200: UserSerializer},
    )
    @decorators.action(["GET"], detail=False, permission_classes=[permissions.IsAuthenticated])
    def current(self, request):
        user = request.user

        return response.Response(UserSelfEditSerializer(user).data)

    @extend_schema(
        request=inline_serializer("UserSetPassword", fields={"password": fields.CharField()}),
        responses={200: StatusOkSerializer},
    )
    @decorators.action(["POST"], detail=True, permission_classes=[permissions.IsAuthenticated])
    def set_password(self, request, pk=None):
        try:
            body = json.loads(request.body)
        except ValueError:
            raise exceptions.APIException("Invalid body", "invalid_body")
        try:
            if user_has_role(request.user, UserRole.ADMIN, include_admin=True) and pk not in [
                "current",
                "me",
            ]:
                user = User.objects.get(pk=pk)
            else:
                user = request.user
        except User.DoesNotExist:
            raise exceptions.APIException("User not found", 404)

        password = body.get("password", "")
        if not password:
            raise exceptions.APIException("Empty password", "empty_password")
        user.set_password(password)
        user.save(update_fields=["password"])

        return response.Response({"ok": True})


@extend_schema_view(
    retrieve=extend_schema(parameters=[OpenApiParameter("id", str, OpenApiParameter.PATH)]),
    update=extend_schema(parameters=[OpenApiParameter("id", str, OpenApiParameter.PATH)]),
    partial_update=extend_schema(parameters=[OpenApiParameter("id", str, OpenApiParameter.PATH)]),
)
class GlobalPreferencesOverrideViewSet(GlobalPreferencesViewSet):
    permission_classes = [RolePermission(ROLES_ADMIN)]
