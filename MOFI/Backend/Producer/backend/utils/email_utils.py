# utils/email_utils.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5174")

def send_email(to_email: str, subject: str, html_content: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print("Email send error:", e)
        return False


def send_verification_email(name: str, to_email: str, token: str):
    verify_link = f"http://localhost:8001/auth/verify-email/{token}"

    html = f"""
    <html>
      <body>
        <p>Hello {name},</p>
        <p>Please verify your email using the button below:</p>
        <a href="{verify_link}"
           style="display:inline-block;
                  padding:12px 18px;
                  background:#0d6efd;
                  color:#fff;
                  border-radius:6px;
                  text-decoration:none;">
           Verify Email
        </a>
        <p>This link will expire in 15 minutes.</p>
      </body>
    </html>
    """

    return send_email(to_email, "Verify your email", html)
