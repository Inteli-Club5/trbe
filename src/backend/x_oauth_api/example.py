from src.xapi.xapi import X
from src.logger import logger

if __name__ == "__main__":
    x = X()

    profile = x.get_user_profile()
    if not profile:
        logger.error("Não foi possível obter o perfil do usuário.")
        exit(1)

    user_id = profile["data"]["id"]
    username = profile["data"]["username"]
    logger.info(f"Usuário autenticado: {username} (ID: {user_id})")

    # Pega tweets do usuário com métricas
    tweets_metrics = x.get_user_tweet_metrics(user_id, max_results=5)
    if tweets_metrics and "data" in tweets_metrics:
        print(f"\nÚltimos tweets de @{username} com métricas:")
        for tweet in tweets_metrics["data"]:
            metrics = tweet.get("public_metrics", {})
            print(f"- Tweet ID: {tweet['id']}")
            print(f"  Likes: {metrics.get('like_count', 0)} | Retweets: {metrics.get('retweet_count', 0)} | Comentários: {metrics.get('reply_count', 0)}")
            print(f"  Texto: {tweet.get('text', '')}\n")
    else:
        logger.info("Nenhum tweet encontrado para o usuário.")

    # Busca tweets com uma hashtag
    hashtag = "tribehackathon"
    hashtag_tweets = x.search_tweets_by_hashtag(hashtag, max_results=5)
    if hashtag_tweets and "data" in hashtag_tweets:
        print(f"\nTweets recentes com a hashtag #{hashtag}:")
        for tweet in hashtag_tweets["data"]:
            print(f"- {tweet['text']}\n")
    else:
        logger.info(f"Nenhum tweet encontrado com a hashtag #{hashtag}.")
