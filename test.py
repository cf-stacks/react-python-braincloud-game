import requests

gs_api_key = 'N375562tzFEg'
gs_credential = 'server'
gs_secret_key = 'Rvw7rPncPwPt433XNoMliWVxd4AVLE7a'

response = requests.post(
    url=f'https://{gs_api_key}.preview.gamesparks.net/rs/{gs_credential}/{gs_secret_key}/RegistrationRequest/',
    json={
        '@class': '.RegistrationRequest',
        'displayName': 'TestUserDisplayName',
        'password': 'password',
        'userName': 'test_user',
    },
)
print(response)
print(response.content)

# response = requests.get(
#     url='https://auth.gamesparks.net/restv2/auth/user',
#     auth=requests.auth.HTTPBasicAuth('sshishov.sshishov@gmail.com', 'gamesparksP@ssw0rd!'),
# )
# print(response)
# print(response.content)
