import json
import logging

from django.core.serializers.json import DjangoJSONEncoder

logger = logging.getLogger(__name__)


class LoggingMixin(object):

    def initialize_request(self, request, *args, **kwargs):
        data = {}
        data.update(**request.GET)
        data.update(**request.POST)
        logger.info(
            'Start processing request %s to %s with data %s for view %s',
            request.method.upper(), request.get_full_path(), data, self.__class__.__name__,
        )
        return super(LoggingMixin, self).initialize_request(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        logger.info('Returning response %s', json.dumps(response.data, cls=DjangoJSONEncoder))
        logger.info('Finish processing request %s', request.method.upper())
        return super(LoggingMixin, self).finalize_response(request, response, *args, **kwargs)
