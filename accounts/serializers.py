from rest_framework import serializers
from rest_framework.authtoken.models import Token

from accounts.models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    # invite_code = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "token",
        ]

    def get_token(self, instance):
        token, created = Token.objects.get_or_create(user=instance)
        return token.key

    # def create(self, validated_data):
    #     validated_data.pop("invite_code")
    #     return super().create(validated_data)


class UserSerializer(serializers.ModelSerializer):
    password_set = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = [
            "groups",
            "user_permissions",
            "is_superuser",
            "password",
        ]
        read_only_fields = ["last_login", "date_joined", "is_staff", "is_superuser"]

    def get_password_set(self, instance: User):
        return bool(instance.has_usable_password() and instance.password)


class UserShortSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "name")

    def get_name(self, obj: User):
        return obj.get_full_name()


class UserSelfEditSerializer(UserSerializer):
    auth_token = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        read_only_fields = UserSerializer.Meta.read_only_fields + [
            "username",
            "email",
            "role",
        ]

    def get_auth_token(self, instance):
        if not instance.is_authenticated:
            return ""
        token, created = Token.objects.get_or_create(user=instance)
        return token.key


class ShortUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        exclude = None
        fields = ["username", "id", "first_name", "last_name"]


class StatusOkSerializer(serializers.Serializer):
    ok = serializers.BooleanField(default=True)
