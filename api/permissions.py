from rest_framework.permissions import IsAuthenticated


class IsUserPermission(IsAuthenticated):
    """
    Allows access only to users.
    """
    def has_permission(self, request, view):
        return super(IsUserPermission, self).has_permission(request, view) and request.user.email


class IsAnonymousPermission(IsAuthenticated):
    """
    Allows access only to anonymous.
    """
    def has_permission(self, request, view):
        return super(IsAnonymousPermission, self).has_permission(request, view) and request.user.device_id
