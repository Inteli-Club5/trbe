import requests
from src.xauth.xauth import XAuth
from src.logger import logger

class X:
    def __init__(self):
        self.xauth = XAuth()

    def get_user_profile(self):
        access_token = self.xauth.get_access_token()

        response = requests.get(
            "https://api.x.com/2/users/me",
            headers={
                "Authorization": f"Bearer {access_token}",
            },
        )

        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Erro ao obter perfil do usuário: {response.status_code} - {response.text}")
            return None


    def get_user_tweet_metrics(self, user_id, max_results=10):
        access_token = self.xauth.get_access_token()
        url = f"https://api.x.com/2/users/{user_id}/tweets"
        params = {
            "max_results": max_results,
            "tweet.fields": "public_metrics"
        }
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(url, params=params, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Erro ao obter tweets do usuário: {response.status_code} - {response.text}")
            return None

    def search_tweets_by_hashtag(self, hashtag, max_results=10):
        access_token = self.xauth.get_access_token()
        url = "https://api.x.com/2/tweets/search/recent"
        params = {
            "query": f"#{hashtag}",
            "max_results": max_results,
            "tweet.fields": "public_metrics,author_id,created_at"
        }
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(url, params=params, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Erro ao buscar tweets com hashtag: {response.status_code} - {response.text}")
            return None
