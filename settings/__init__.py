from urllib.parse import urlencode

import dj_database_url


def get_database_dict(db_url):
    return dj_database_url.parse(
        '{url}?{options}'.format(
            url=db_url,
            options=urlencode(
                {
                    'init_command': 'SET sql_mode=\'STRICT_TRANS_TABLES\', innodb_strict_mode=1',
                    'charset': 'utf8mb4',
                },
            ),
        ),
    )
