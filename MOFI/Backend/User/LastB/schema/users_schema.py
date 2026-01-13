from datetime import datetime 

def create_user_model(full_name, email):
    return {
        "full_name": full_name,
        "email": email,
        "role": "user",
        "auth_type": "google",
        "email_verified": True,
        "created_at": datetime.utcnow(),
    }
