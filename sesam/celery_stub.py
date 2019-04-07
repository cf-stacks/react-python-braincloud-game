import logging
import threading

logger = logging.getLogger(__name__)


class DummyThread(threading.Thread):
    def __init__(self, request):
        super(DummyThread, self).__init__()
        self.timeout = request.data['timeout']
        self.event_key = request.data['event_key']
        self.data = request.data['data']
        self.user = request.user

    def run(self):
        import time
        time.sleep(self.timeout)
        from gamesparks.client import client
        response = client.login_user(self.user)
        logger.debug(response)
        if 'userId' not in response:
            raise Exception('Invalid sync')
        response = client.log_event_request(self.event_key, self.data, response['userId'])
        logger.debug(response)
