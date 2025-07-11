import sqlite3
import json

DB_PATH = "oauth.db"

def print_token_scopes():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("SELECT token FROM oauth_tokens ORDER BY expires_at DESC LIMIT 1")
        row = c.fetchone()
        if not row:
            print("Nenhum token armazenado.")
            return
        token = json.loads(row[0])
        scopes = token.get("scope", None)
        print(f"Escopos no token atual: {scopes}")

def clear_tokens():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM oauth_tokens")
        conn.commit()
        print("Tokens apagados do banco.")

if __name__ == "__main__":
    print("Token scopes atuais:")
    print_token_scopes()

    answer = input("Deseja apagar os tokens para forçar nova autenticação? (s/n) ")
    if answer.lower() == "s":
        clear_tokens()
