from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


def logout(user):
    for token in OutstandingToken.objects.filter(user=user).exclude(
            id__in=BlacklistedToken.objects.filter(token__user=user).values_list('token_id', flat=True),
    ):
        BlacklistedToken.objects.create(token=token)
