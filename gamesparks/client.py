import logging

import requests

from django.conf import settings

logger = logging.getLogger(__name__)


class GameSparksClient(object):

    def __init__(self, api_key, credential, secret, stage):
        self.api_key = api_key
        self.credential = credential
        self.secret = secret
        self.stage = stage

    def _send(self, endpoint, data):
        response = requests.post(
            url=f'https://{self.api_key}.{self.stage}.gamesparks.net/rs/{self.credential}/{self.secret}/{endpoint}/',
            json={
                '@class': f'.{endpoint}',
                **data
            },
        )
        return response.json()

    def register_user(self, user):
        data = {
            'userName': str(user.id),
            'password': user.password,
            'displayName': user.name,
        }
        return self._send(endpoint='RegistrationRequest', data=data)

    def login_user(self, user):
        data = {
            'userName': str(user.id),
            'password': user.password,
        }
        response = self._send(endpoint='AuthenticationRequest', data=data)
        return response

    def log_event_request(self, event_key, data, user_id):
        data = {
            'playerId': user_id,
            'eventKey': event_key,
            'scriptData': data,
        }
        response = self._send(endpoint='LogEventRequest', data=data)
        return response


client = GameSparksClient(
    api_key=settings.GAMESPARKS_CONFIG['api_key'],
    credential=settings.GAMESPARKS_CONFIG['credential'],
    secret=settings.GAMESPARKS_CONFIG['secret'],
    stage='preview',
)
