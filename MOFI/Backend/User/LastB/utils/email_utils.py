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

def send_email(to_email: str, subject: str, html_content: str):
    
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = SENDER_EMAIL
        message["To"] = to_email

        message.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_verification_email(username: str, receiver_email: str, token: str):
    
    verify_link = f"http://127.0.0.1:8000/auth/verify/{token}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#000000; font-family: Arial, sans-serif;">

      <div style="max-width:600px; margin:30px auto; background:#111111; padding:35px; border-radius:10px; border:1px solid #333;">
        
        <h1 style="text-align:center; color:#F5C518; font-size:32px; letter-spacing:3px; margin-bottom:10px;">
            MOFI
        </h1>

        <p style="font-size:16px; color:#DDDDDD; text-align:center;">
            Your trusted movie identity platform 🎬
        </p>

        <hr style="border:0; border-top:1px solid #444; margin:25px 0;" />

        <h2 style="color:#FFFFFF; text-align:center;">
            Verify Your Email Address
        </h2>

        <p style="font-size:15px; color:#CCCCCC; line-height:1.6;">
            Hello, {username}
            <br><br>
            Thank you for registering with <strong style="color:#F5C518;">MOFI</strong>.
            To activate your account, please verify your email address by clicking the button below.
        </p>

        <!-- Button -->
        <div style="text-align:center; margin:35px 0;">
            <a href="{verify_link}"
               style="
                 background:#F5C518;
                 color:#000;
                 padding:14px 28px;
                 font-size:17px;
                 font-weight:bold;
                 text-decoration:none;
                 border-radius:6px;
                 display:inline-block;
                 letter-spacing:1px;
                 box-shadow:0 2px 8px rgba(245, 197, 24, 0.5);
               ">
               VERIFY EMAIL
            </a>
        </div>
       <hr style="border:0; border-top:1px solid #444; margin:25px 0;" />

        <p style="font-size:13px; color:#777777; text-align:center;">
            This link expires in 15 minutes for your security.
        </p>

        <p style="font-size:12px; color:#555555; text-align:center;">
            © 2025 MOFI — All Rights Reserved.
        </p>

    </div>

    </body>
    </html>
    """

    return send_email(receiver_email, "Verify your email", html_content)

def reset_password_email(fullname: str, requestemail: str, token: str):

    FRONTEND_URL = "http://localhost:5173" 

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    html = f"""
    <div style="font-family: Arial, sans-serif; background-color:#121212; padding:30px; color:white;">
        <h2 style="color:#F5C518;">MOFI Password Reset</h2>

        <p style="font-size:16px;">Hello, <b>{fullname}</b></p>
        
        <p>You requested to reset your password. Click the button below:</p>

        <a href="{reset_link}" 
           style="display:inline-block; padding:12px 22px;
                  background-color:#F5C518; color:black;
                  font-weight:bold; text-decoration:none;
                  border-radius:6px; margin-top:20px;">
            Reset Password
        </a>

        <p style="margin-top:30px; font-size:14px; color:#bbbbbb;">
            If you did not request this, you can ignore this email.
        </p>
    </div>
    """
    
    return send_email(requestemail, "MOFI Password Reset", html)
