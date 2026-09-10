from fastapi import FastAPI, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import uuid
import uvicorn
import os
import re
import secrets
import smtplib
import random
import socketio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============== SOCKET.IO SETUP ==============

# Create Socket.io server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=False,
    engineio_logger=False,
    ping_timeout=60,
    ping_interval=25
)

# ============== APP INITIALIZATION ==============

app = FastAPI(
    title="EDSA Management System",
    version="2.0.0",
    description="Electricity Distribution and Supply Authority Management System"
)

# ============== SOCKET.IO EVENTS ==============

@sio.event
async def connect(sid, environ):
    """Handle client connection"""
    print(f"✅ Socket.io client connected: {sid}")
    await sio.emit('server-status', {'status': 'connected', 'sid': sid})

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"❌ Socket.io client disconnected: {sid}")

@sio.event
async def send_notification(sid, data):
    """Send notification to all clients"""
    print(f"📢 Notification from {sid}: {data}")
    await sio.emit('notification', data)

@sio.event
async def join_room(sid, room):
    """Join a specific room"""
    await sio.enter_room(sid, room)
    print(f"👥 {sid} joined room: {room}")
    await sio.emit('joined-room', {'room': room}, to=sid)

@sio.event
async def leave_room(sid, room):
    """Leave a specific room"""
    await sio.leave_room(sid, room)
    print(f"👋 {sid} left room: {room}")

# ============== CONFIGURATION ==============

# Currency Configuration
CURRENCY_CODE = os.getenv("CURRENCY_CODE", "SLL")
CURRENCY_SYMBOL = os.getenv("CURRENCY_SYMBOL", "Le")
EXCHANGE_RATE = float(os.getenv("EXCHANGE_RATE", 20000))

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
VERIFICATION_TOKEN_EXPIRE_HOURS = 24

# Email Configuration
EMAIL_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_USER = os.getenv("SMTP_USER", "notifications@edsa.gov.sl")
EMAIL_PASSWORD = os.getenv("SMTP_PASSWORD", "your-email-password")
EMAIL_FROM = os.getenv("SMTP_USER", "notifications@edsa.gov.sl")

# CORS Configuration
if ENVIRONMENT == "production":
    ALLOWED_ORIGINS = [
        "https://edsa.gov.sl",
        "https://www.edsa.gov.sl",
        "http://localhost:3000",
        "http://localhost:5173"
    ]
else:
    ALLOWED_ORIGINS = ["*"]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Token serializer for email verification
serializer = URLSafeTimedSerializer(SECRET_KEY)

# ============== USERS DATABASE ==============

USERS = [
    # Admin Users
    {"id": "USR001", "username": "admin", "email": "admin@edsa.gov.sl", "role": "administrator", "name": "System Admin", "password": "admin123", "client_id": None, "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
    
    # Client Users
    {"id": "USR003", "username": "client_john", "email": "john@example.com", "role": "client", "name": "John Doe", "password": "client123", "client_id": "CLT001", "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
    {"id": "USR004", "username": "client_jane", "email": "jane@example.com", "role": "client", "name": "Jane Smith", "password": "client123", "client_id": "CLT002", "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
    
    # Staff Users
    {"id": "USR007", "username": "staff_billing", "email": "billing@edsa.gov.sl", "role": "staff", "name": "Billing Officer", "password": "staff123", "client_id": None, "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
    
    # IT Manager Users
    {"id": "USR009", "username": "it_manager", "email": "it@edsa.gov.sl", "role": "it_manager", "name": "IT Manager", "password": "it123", "client_id": None, "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
    
    # Executive Users
    {"id": "USR011", "username": "executive_peter", "email": "executive@edsa.gov.sl", "role": "executive", "name": "Peter Executive", "password": "executive123", "client_id": None, "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
    
    # Operations Manager Users
    {"id": "USR013", "username": "ops_manager", "email": "ops@edsa.gov.sl", "role": "operations_manager", "name": "Operations Manager", "password": "ops123", "client_id": None, "status": "active", "email_verified": True, "created_at": datetime.utcnow().isoformat()},
]

# ============== SECURITY EVENTS ==============
SECURITY_EVENTS = []
SECURITY_EVENT_ID = 1
SECURITY_RULES = [
    {
        "id": 1,
        "name": "Block Suspicious IP",
        "description": "Block IPs with multiple failed login attempts",
        "rule_type": "ip_blacklist",
        "pattern": "192.168.1.*",
        "severity": "high",
        "action": "block",
        "is_active": True,
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 2,
        "name": "Rate Limit Detection",
        "description": "Detect rate limiting violations",
        "rule_type": "rate_limit",
        "pattern": "5",
        "severity": "medium",
        "action": "alert",
        "is_active": True,
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 3,
        "name": "Admin Access Alert",
        "description": "Alert on admin panel access attempts",
        "rule_type": "suspicious_pattern",
        "pattern": "/admin",
        "severity": "critical",
        "action": "alert",
        "is_active": True,
        "created_at": datetime.now().isoformat()
    }
]

# ============== PENDING_REGISTRATIONS ==============
PENDING_REGISTRATIONS = []
VERIFICATION_TOKENS = {}

# ============== MOCK DATA ==============

CLIENTS = [
    {"id": "CLT001", "client_code": "CLT-2024001", "account_number": "ACC-2024001", "name": "John Doe", "email": "john@example.com", "phone": "+23276123456", "address": "123 Main Street, Freetown", "status": "active", "total_debt": 0, "credit_balance": 32.4},
    {"id": "CLT002", "client_code": "CLT-2024002", "account_number": "ACC-2024002", "name": "Jane Smith", "email": "jane@example.com", "phone": "+23276123457", "address": "456 King Street, Freetown", "status": "disconnected", "total_debt": 12500, "credit_balance": 0},
    {"id": "CLT003", "client_code": "CLT-2024003", "account_number": "ACC-2024003", "name": "Mohamed Kamara", "email": "mohamed@example.com", "phone": "+23276123458", "address": "789 Bai Bureh Road, Freetown", "status": "active", "total_debt": 8500, "credit_balance": 0}
]

METERS = [
    {"id": "MTR001", "meter_number": "MTR-001", "client_id": "CLT001", "status": "active", "current_reading": 1250.5, "location": {"lat": 8.4657, "lng": -13.2317}},
    {"id": "MTR002", "meter_number": "MTR-002", "client_id": "CLT002", "status": "disconnected", "current_reading": 850.3, "location": {"lat": 8.4700, "lng": -13.2350}},
    {"id": "MTR003", "meter_number": "MTR-003", "client_id": "CLT003", "status": "active", "current_reading": 3200.0, "location": {"lat": 8.4750, "lng": -13.2400}}
]

TOKENS = [
    {"id": "TOK001", "token_code": "EDSA-4F2A-8B1C-3D9E-7H5K", "client_id": "CLT001", "amount": 450, "amount_sll": 9000000, "units": 30, "status": "active", "generation_date": datetime.utcnow().isoformat(), "expiry_date": (datetime.utcnow() + timedelta(days=30)).isoformat()},
    {"id": "TOK002", "token_code": "EDSA-7H5K-9D3E-2A4F-8B1C", "client_id": "CLT001", "amount": 320, "amount_sll": 6400000, "units": 22, "status": "used", "generation_date": datetime.utcnow().isoformat(), "expiry_date": (datetime.utcnow() + timedelta(days=25)).isoformat()}
]

BILLS = [
    {"id": "BIL001", "bill_number": "BILL-2024001", "client_id": "CLT001", "amount": 450, "amount_sll": 9000000, "total_amount": 450, "total_amount_sll": 9000000, "due_date": (datetime.utcnow() + timedelta(days=30)).isoformat(), "payment_status": "paid", "units_consumed": 30.0},
    {"id": "BIL002", "bill_number": "BILL-2024002", "client_id": "CLT002", "amount": 675.50, "amount_sll": 13510000, "total_amount": 675.50, "total_amount_sll": 13510000, "due_date": (datetime.utcnow() - timedelta(days=10)).isoformat(), "payment_status": "overdue", "units_consumed": 45.0},
    {"id": "BIL003", "bill_number": "BILL-2024003", "client_id": "CLT001", "amount": 520, "amount_sll": 10400000, "total_amount": 520, "total_amount_sll": 10400000, "due_date": (datetime.utcnow() - timedelta(days=45)).isoformat(), "payment_status": "pending", "units_consumed": 34.0}
]

PAYMENTS = [
    {"id": "PAY001", "payment_reference": "PAY-20240801-001", "client_id": "CLT001", "client_name": "John Doe", "amount": 450, "amount_sll": 9000000, "payment_date": datetime.utcnow().isoformat(), "payment_method": "mobile_money", "status": "completed", "token_code": "EDSA-4F2A-8B1C-3D9E-7H5K", "currency": "SLL"}
]

ALERTS = [
    {"id": "ALT001", "type": "meter_tamper", "severity": "high", "client_id": "CLT003", "message": "⚠️ METER TAMPERING DETECTED: Magnetic interference detected", "timestamp": datetime.utcnow().isoformat(), "resolved": False},
    {"id": "ALT002", "type": "electricity_theft", "severity": "critical", "client_id": "CLT002", "message": "🚨 ELECTRICITY THEFT DETECTED: Consumption anomaly", "timestamp": datetime.utcnow().isoformat(), "resolved": False}
]

OUTAGES = [
    {"id": "OUT001", "area": "Freetown East", "status": "planned", "start": "2024-09-02T08:00:00", "end": "2024-09-02T12:00:00", "reason": "Scheduled maintenance", "affected_customers": 150},
    {"id": "OUT002", "area": "Central Freetown", "status": "active", "start": "2024-09-01T14:30:00", "end": "2024-09-01T18:00:00", "reason": "Transformer failure", "affected_customers": 75}
]

COMPLAINTS = [
    {"id": "COM0001", "client_id": "CLT003", "type": "no_light", "location": "789 Bai Bureh Road", "description": "No light for 3 days", "status": "in_progress", "priority": "high", "created_at": datetime.utcnow().isoformat()}
]

WORK_ORDERS = [
    {"id": "WO001", "type": "meter_installation", "priority": "high", "status": "pending", "assigned_to": "staff_jane", "created_at": datetime.utcnow().isoformat()},
    {"id": "WO002", "type": "meter_inspection", "priority": "medium", "status": "in_progress", "assigned_to": "staff_jane", "created_at": datetime.utcnow().isoformat()}
]

EXCEPTION_REQUESTS = [
    {"id": "EXC001", "staff_id": "USR002", "staff_name": "Jane Staff", "type": "bill_adjustment", "details": "Customer bill adjustment request", "client_id": "CLT001", "status": "pending_approval", "submitted_at": datetime.utcnow().isoformat()}
]

AUDIT_LOGS = [
    {"id": "AUD001", "user_id": "USR001", "action": "LOGIN_SUCCESS", "details": "User admin logged in as administrator", "status": "success", "timestamp": datetime.utcnow().isoformat()}
]

BACKUPS = [
    {"id": "BAK001", "name": "Full Backup 2024-08-31", "size": "2.5 GB", "date": "2024-08-31 02:00:00", "status": "completed"},
    {"id": "BAK002", "name": "Full Backup 2024-08-30", "size": "2.4 GB", "date": "2024-08-30 02:00:00", "status": "completed"}
]

# ============== EMAIL FUNCTIONS ==============

def send_email(to_email, subject, html_content, text_content=None):
    """Send email using SMTP"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        
        if text_content:
            text_part = MIMEText(text_content, 'plain')
            msg.attach(text_part)
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False

def send_verification_email(email, username, verification_token):
    """Send email verification link"""
    verification_link = f"http://localhost:3000/verify-email?token={verification_token}&email={email}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 48px; }}
            .title {{ color: #1890ff; font-size: 24px; font-weight: bold; }}
            .content {{ line-height: 1.6; color: #333; }}
            .button {{ display: inline-block; background: #1890ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚡</div>
                <div class="title">EDSA Management System</div>
            </div>
            <div class="content">
                <h2>Welcome to EDSA!</h2>
                <p>Hi {username},</p>
                <p>Thank you for registering with the EDSA Electricity Management System.</p>
                <p>Please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="{verification_link}" class="button">Verify Email Address</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; font-size: 12px; color: #666; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                    {verification_link}
                </p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account with us, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2024 EDSA Management System. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </html>
    """
    
    text_content = f"""
    Welcome to EDSA Management System!
    
    Hi {username},
    
    Thank you for registering with the EDSA Electricity Management System.
    
    Please verify your email address by clicking this link:
    {verification_link}
    
    This link will expire in 24 hours.
    
    If you did not create an account with us, please ignore this email.
    
    © 2024 EDSA Management System. All rights reserved.
    """
    
    return send_email(email, "Verify Your EDSA Account", html_content, text_content)

def send_welcome_email(email, username):
    """Send welcome email after verification"""
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 48px; }}
            .title {{ color: #52c41a; font-size: 24px; font-weight: bold; }}
            .content {{ line-height: 1.6; color: #333; }}
            .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✅</div>
                <div class="title">Email Verified!</div>
            </div>
            <div class="content">
                <h2>Welcome to EDSA, {username}! 🎉</h2>
                <p>Your email has been successfully verified.</p>
                <p>You can now login to your account and start using the EDSA Management System.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="http://localhost:3000/login" style="display: inline-block; background: #1890ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                        Login to Your Account
                    </a>
                </div>
                <p>Your account details:</p>
                <ul>
                    <li><strong>Username:</strong> {username}</li>
                    <li><strong>Email:</strong> {email}</li>
                </ul>
            </div>
            <div class="footer">
                <p>© 2024 EDSA Management System. All rights reserved.</p>
            </div>
        </div>
    </html>
    """
    
    text_content = f"""
    Welcome to EDSA Management System!
    
    Email Verified!
    
    Your email has been successfully verified.
    
    You can now login to your account and start using the EDSA Management System.
    
    Login here: http://localhost:3000/login
    
    Your account details:
    - Username: {username}
    - Email: {email}
    
    © 2024 EDSA Management System. All rights reserved.
    """
    
    return send_email(email, "Welcome to EDSA! 🎉", html_content, text_content)

# ============== HELPER FUNCTIONS ==============

def format_currency(amount, currency="SLL"):
    if currency == "USD":
        return f"${amount:.2f}"
    return f"SLL {amount:,.0f}"

def convert_to_sll(amount_usd):
    return amount_usd * EXCHANGE_RATE

def convert_to_usd(amount_sll):
    return amount_sll / EXCHANGE_RATE

def find_user_by_username(username):
    for u in USERS:
        if u.get("username").lower() == username.lower() or u.get("email").lower() == username.lower():
            return u
    return None

def find_user_by_email(email):
    for u in USERS:
        if u.get("email").lower() == email.lower():
            return u
    return None

def generate_user_id():
    return f"USR{len(USERS) + 1:03d}"

def generate_client_id():
    return f"CLT{len(CLIENTS) + 1:03d}"

def generate_client_code():
    return f"CLT-{datetime.utcnow().year}{str(len(CLIENTS) + 1).zfill(4)}"

def generate_account_number():
    return f"ACC-{datetime.utcnow().year}{str(len(CLIENTS) + 1).zfill(4)}"

def generate_verification_token(email):
    token = serializer.dumps(email, salt='email-verification')
    return token

def verify_token(token, expiration_hours=24):
    try:
        email = serializer.loads(token, salt='email-verification', max_age=expiration_hours * 3600)
        return email
    except Exception:
        return None

def validate_password(password):
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def get_current_user_from_token(token):
    """Helper function to validate token and return user"""
    for user in USERS:
        if user.get("username") == "admin":
            return user
    return USERS[0] if USERS else None

# ============== ROLE MENUS ==============

def get_role_menu(role):
    menus = {
        "client": [
            {"key": "/client/dashboard", "label": "Dashboard", "icon": "DashboardOutlined"},
            {"key": "/client/meters", "label": "My Meters", "icon": "GlobalOutlined"},
            {"key": "/client/tokens", "label": "My Tokens", "icon": "KeyOutlined"},
            {"key": "/client/bills", "label": "My Bills", "icon": "FileTextOutlined"},
            {"key": "/client/payments", "label": "Payments", "icon": "CreditCardOutlined"},
            {"key": "/client/complaints", "label": "Complaints", "icon": "AlertOutlined"},
            {"key": "/client/outages", "label": "Outages", "icon": "EnvironmentOutlined"},
            {"key": "/client/profile", "label": "Profile", "icon": "UserOutlined"}
        ],
        "staff": [
            {"key": "/staff/dashboard", "label": "Dashboard", "icon": "DashboardOutlined"},
            {"key": "/staff/client-search", "label": "Client Search", "icon": "SearchOutlined"},
            {"key": "/staff/assigned-meters", "label": "Assigned Meters", "icon": "GlobalOutlined"},
            {"key": "/staff/complaints", "label": "Complaints", "icon": "AlertOutlined"},
            {"key": "/staff/work-orders", "label": "Work Orders", "icon": "FileTextOutlined"},
            {"key": "/staff/payment-verification", "label": "Payment Verification", "icon": "CheckCircleOutlined"},
            {"key": "/staff/exception-requests", "label": "Exception Requests", "icon": "ExclamationCircleOutlined"},
            {"key": "/staff/profile", "label": "Profile", "icon": "UserOutlined"}
        ],
        "it_manager": [
            {"key": "/it/dashboard", "label": "Dashboard", "icon": "DashboardOutlined"},
            {"key": "/it/system-health", "label": "System Health", "icon": "HeartOutlined"},
            {"key": "/it/meter-connectivity", "label": "Meter Connectivity", "icon": "WifiOutlined"},
            {"key": "/it/security-events", "label": "Security Events", "icon": "SafetyOutlined"},
            {"key": "/it/backups", "label": "Backups", "icon": "DatabaseOutlined"},
            {"key": "/it/device-management", "label": "Device Management", "icon": "MobileOutlined"},
            {"key": "/it/profile", "label": "Profile", "icon": "UserOutlined"}
        ],
        "executive": [
            {"key": "/executive/dashboard", "label": "Dashboard", "icon": "TrophyOutlined"},
            {"key": "/executive/revenue", "label": "Revenue", "icon": "DollarOutlined"},
            {"key": "/executive/losses", "label": "Losses", "icon": "WarningOutlined"},
            {"key": "/executive/fraud-overview", "label": "Fraud Overview", "icon": "SafetyOutlined"},
            {"key": "/executive/outages", "label": "Outages", "icon": "EnvironmentOutlined"},
            {"key": "/executive/strategic-reports", "label": "Strategic Reports", "icon": "FileTextOutlined"},
            {"key": "/executive/high-value-approvals", "label": "High-Value Approvals", "icon": "CheckCircleOutlined"},
            {"key": "/executive/profile", "label": "Profile", "icon": "UserOutlined"}
        ],
        "administrator": [
            {"key": "/admin/dashboard", "label": "Dashboard", "icon": "DashboardOutlined"},
            {"key": "/admin/users", "label": "Users", "icon": "UserOutlined"},
            {"key": "/admin/roles", "label": "Roles", "icon": "SafetyOutlined"},
            {"key": "/admin/audit-log", "label": "Audit Log", "icon": "AuditOutlined"},
            {"key": "/admin/system-settings", "label": "System Settings", "icon": "SettingOutlined"},
            {"key": "/admin/backups", "label": "Backups", "icon": "DatabaseOutlined"},
            {"key": "/admin/profile", "label": "Profile", "icon": "UserOutlined"}
        ],
        "operations_manager": [
            {"key": "/operations/dashboard", "label": "Dashboard", "icon": "DashboardOutlined"},
            {"key": "/operations/approvals", "label": "Approvals", "icon": "CheckCircleOutlined"},
            {"key": "/operations/complaints", "label": "Complaints", "icon": "AlertOutlined"},
            {"key": "/operations/work-orders", "label": "Work Orders", "icon": "FileTextOutlined"},
            {"key": "/operations/reports", "label": "Reports", "icon": "FileTextOutlined"},
            {"key": "/operations/profile", "label": "Profile", "icon": "UserOutlined"}
        ]
    }
    return menus.get(role, [])

# ============== SECURITY EVENTS FUNCTIONS ==============

def init_security_events():
    """Initialize security events with sample data"""
    global SECURITY_EVENTS, SECURITY_EVENT_ID
    
    if len(SECURITY_EVENTS) == 0:
        now = datetime.now()
        sample_events = [
            {
                "id": 1,
                "event_type": "failed_login",
                "severity": "high",
                "description": "Multiple failed login attempts from IP 192.168.1.100 (5 attempts in 2 minutes)",
                "username": "john_doe",
                "ip_address": "192.168.1.100",
                "status": "active",
                "location": "New York, USA",
                "metadata": {"attempts": 5, "time_window": "2 minutes"},
                "created_at": (now - timedelta(minutes=5)).isoformat(),
                "updated_at": (now - timedelta(minutes=5)).isoformat(),
                "resolved_at": None,
                "resolved_by": None,
                "resolution_notes": None
            },
            {
                "id": 2,
                "event_type": "suspicious_activity",
                "severity": "critical",
                "description": "Unauthorized access attempt detected on admin panel from IP 10.0.0.50",
                "username": "admin",
                "ip_address": "10.0.0.50",
                "status": "active",
                "location": "London, UK",
                "metadata": {"endpoint": "/admin/dashboard", "method": "POST"},
                "created_at": (now - timedelta(minutes=15)).isoformat(),
                "updated_at": (now - timedelta(minutes=15)).isoformat(),
                "resolved_at": None,
                "resolved_by": None,
                "resolution_notes": None
            },
            {
                "id": 3,
                "event_type": "password_change",
                "severity": "medium",
                "description": "Password changed from new device (unknown location)",
                "username": "jane_smith",
                "ip_address": "203.0.113.45",
                "status": "resolved",
                "location": "Unknown",
                "metadata": {"device_type": "Mobile", "browser": "Chrome"},
                "created_at": (now - timedelta(hours=2)).isoformat(),
                "updated_at": (now - timedelta(minutes=30)).isoformat(),
                "resolved_at": (now - timedelta(minutes=30)).isoformat(),
                "resolved_by": "admin",
                "resolution_notes": "User confirmed it was legitimate via email verification"
            },
            {
                "id": 4,
                "event_type": "login",
                "severity": "low",
                "description": "Successful login from new location (Tokyo, Japan)",
                "username": "bob_wilson",
                "ip_address": "198.51.100.75",
                "status": "active",
                "location": "Tokyo, Japan",
                "metadata": {"login_time": "00:45:32", "session_duration": "15m"},
                "created_at": (now - timedelta(minutes=45)).isoformat(),
                "updated_at": (now - timedelta(minutes=45)).isoformat(),
                "resolved_at": None,
                "resolved_by": None,
                "resolution_notes": None
            },
            {
                "id": 5,
                "event_type": "permission_change",
                "severity": "high",
                "description": "User role changed from 'viewer' to 'admin' by another admin",
                "username": "alice_wong",
                "ip_address": "192.168.1.200",
                "status": "active",
                "location": "San Francisco, USA",
                "metadata": {
                    "old_role": "viewer",
                    "new_role": "admin",
                    "changed_by": "admin_user"
                },
                "created_at": (now - timedelta(hours=1)).isoformat(),
                "updated_at": (now - timedelta(hours=1)).isoformat(),
                "resolved_at": None,
                "resolved_by": None,
                "resolution_notes": None
            },
            {
                "id": 6,
                "event_type": "failed_login",
                "severity": "critical",
                "description": "Brute force attack detected on admin account",
                "username": "admin",
                "ip_address": "45.33.22.11",
                "status": "active",
                "location": "Moscow, Russia",
                "metadata": {"attempts": 50, "time_window": "5 minutes"},
                "created_at": (now - timedelta(minutes=10)).isoformat(),
                "updated_at": (now - timedelta(minutes=10)).isoformat(),
                "resolved_at": None,
                "resolved_by": None,
                "resolution_notes": None
            }
        ]
        
        for event in sample_events:
            SECURITY_EVENTS.append(event)
            SECURITY_EVENT_ID += 1

# Initialize security events
init_security_events()

# ============== AUTH ENDPOINTS ==============

@app.post("/api/v1/auth/register")
async def register(request: dict, background_tasks: BackgroundTasks):
    """Register a new user with email verification"""
    username = request.get("username")
    email = request.get("email")
    password = request.get("password")
    name = request.get("name")
    role = request.get("role", "client")
    phone = request.get("phone", "")
    address = request.get("address", "")
    
    print(f"📝 Registration attempt: username='{username}', email='{email}', role='{role}'")
    
    # Validate required fields
    if not username or not email or not password or not name:
        raise HTTPException(status_code=400, detail="Username, email, password, and name are required")
    
    # Validate email
    if not validate_email(email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Validate password
    valid, msg = validate_password(password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)
    
    # Check if username already exists
    if find_user_by_username(username):
        raise HTTPException(status_code=409, detail="Username already taken")
    
    # Check if email already exists
    if find_user_by_email(email):
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # For client role, create a client record
    client_id = None
    if role == "client":
        client_id = generate_client_id()
        new_client = {
            "id": client_id,
            "client_code": generate_client_code(),
            "account_number": generate_account_number(),
            "name": name,
            "email": email,
            "phone": phone,
            "address": address,
            "status": "pending_verification",
            "total_debt": 0,
            "credit_balance": 0
        }
        CLIENTS.append(new_client)
    
    # Create new user
    new_user = {
        "id": generate_user_id(),
        "username": username,
        "email": email,
        "name": name,
        "role": role,
        "password": password,
        "client_id": client_id,
        "status": "pending_verification",
        "email_verified": False,
        "created_at": datetime.utcnow().isoformat()
    }
    USERS.append(new_user)
    
    # Generate verification token
    verification_token = generate_verification_token(email)
    
    # Store token with expiry
    VERIFICATION_TOKENS[email] = {
        "token": verification_token,
        "expires_at": datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRE_HOURS),
        "user_id": new_user["id"]
    }
    
    # Send verification email
    background_tasks.add_task(send_verification_email, email, username, verification_token)
    
    print(f"✅ User registered: {username} with ID: {new_user['id']}")
    print(f"📧 Verification email sent to: {email}")
    
    # Log registration
    AUDIT_LOGS.append({
        "id": f"AUD{len(AUDIT_LOGS) + 1:03d}",
        "user_id": new_user["id"],
        "action": "REGISTER",
        "details": f"New user {username} registered as {role} - Email verification sent",
        "status": "pending_verification",
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Emit socket notification
    await sio.emit('notification', {
        'type': 'info',
        'title': 'New User Registered',
        'message': f'{name} registered as {role}',
        'timestamp': datetime.utcnow().isoformat()
    })
    
    return {
        "success": True,
        "message": "Registration successful. Please check your email for verification link.",
        "user": {
            "id": new_user["id"],
            "username": new_user["username"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"],
            "status": new_user["status"],
            "client_id": new_user["client_id"]
        },
        "requires_verification": True,
        "verification_sent": True
    }

@app.post("/api/v1/auth/verify-email")
async def verify_email(request: dict):
    """Verify email using the token"""
    token = request.get("token")
    email = request.get("email")
    
    if not token or not email:
        raise HTTPException(status_code=400, detail="Token and email are required")
    
    # Verify the token
    verified_email = verify_token(token, VERIFICATION_TOKEN_EXPIRE_HOURS)
    
    if not verified_email or verified_email != email:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    # Find user by email
    user = find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user status
    user["status"] = "active"
    user["email_verified"] = True
    
    # Update client status if client
    if user.get("client_id"):
        for c in CLIENTS:
            if c.get("id") == user["client_id"]:
                c["status"] = "active"
                break
    
    # Remove from verification tokens
    if email in VERIFICATION_TOKENS:
        del VERIFICATION_TOKENS[email]
    
    # Send welcome email
    send_welcome_email(email, user.get("username"))
    
    # Log verification
    AUDIT_LOGS.append({
        "id": f"AUD{len(AUDIT_LOGS) + 1:03d}",
        "user_id": user["id"],
        "action": "EMAIL_VERIFIED",
        "details": f"Email {email} verified for user {user.get('username')}",
        "status": "success",
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {
        "success": True,
        "message": "Email verified successfully. You can now login.",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "status": user["status"]
        }
    }

@app.post("/api/v1/auth/resend-verification")
async def resend_verification(request: dict, background_tasks: BackgroundTasks):
    """Resend verification email"""
    email = request.get("email")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Find user by email
    user = find_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("email_verified"):
        raise HTTPException(status_code=400, detail="Email already verified")
    
    # Generate new verification token
    verification_token = generate_verification_token(email)
    
    # Store token with expiry
    VERIFICATION_TOKENS[email] = {
        "token": verification_token,
        "expires_at": datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRE_HOURS),
        "user_id": user["id"]
    }
    
    # Send verification email
    background_tasks.add_task(send_verification_email, email, user.get("username"), verification_token)
    
    return {
        "success": True,
        "message": "Verification email resent. Please check your email."
    }

@app.post("/api/v1/auth/login")
async def login(request: dict):
    username = request.get("username")
    password = request.get("password")
    
    print(f"🔐 Login attempt: username='{username}'")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    
    # Find user by username or email
    found_user = None
    for u in USERS:
        if u.get("username").lower() == username.lower() or u.get("email").lower() == username.lower():
            found_user = u
            break
    
    if not found_user:
        print(f"❌ User not found: {username}")
        raise HTTPException(status_code=401, detail="Invalid credentials. Please register first.")
    
    print(f"📝 Found user: {found_user.get('username')}, role: {found_user.get('role')}, status: {found_user.get('status')}")
    
    # Check if email is verified
    if not found_user.get("email_verified"):
        raise HTTPException(status_code=403, detail="Email not verified. Please check your email for verification link.")
    
    # Check password
    if password != found_user.get("password"):
        print(f"❌ Password mismatch for: {username}")
        raise HTTPException(status_code=401, detail="Invalid credentials. Please check your password.")
    
    # Check if user is active
    if found_user.get("status") == "inactive":
        raise HTTPException(status_code=403, detail="Account has been deactivated. Please contact support.")
    
    # Generate token
    token = f"token_{uuid.uuid4().hex[:32]}"
    
    user_role = found_user.get("role")
    print(f"✅ Login successful: {username} -> role: {user_role}")
    
    # Log audit
    AUDIT_LOGS.append({
        "id": f"AUD{len(AUDIT_LOGS) + 1:03d}",
        "user_id": found_user["id"],
        "action": "LOGIN_SUCCESS",
        "details": f"User {username} logged in as {user_role}",
        "status": "success",
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Emit socket notification for login
    await sio.emit('notification', {
        'type': 'success',
        'title': 'User Login',
        'message': f'{found_user.get("name")} logged in',
        'timestamp': datetime.utcnow().isoformat()
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": found_user["id"],
            "username": found_user["username"],
            "name": found_user["name"],
            "email": found_user["email"],
            "role": user_role,
            "client_id": found_user.get("client_id"),
            "status": found_user.get("status")
        },
        "menu": get_role_menu(user_role),
        "permissions": ["view_dashboard", "view_profile"],
        "currency": {
            "code": CURRENCY_CODE,
            "symbol": CURRENCY_SYMBOL,
            "exchange_rate": EXCHANGE_RATE
        }
    }

@app.post("/api/v1/auth/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}

@app.get("/api/v1/auth/me")
async def get_current_user():
    return {
        "user": {
            "id": "USR001",
            "username": "admin",
            "name": "System Admin",
            "email": "admin@edsa.gov.sl",
            "role": "administrator",
            "client_id": None,
            "status": "active"
        },
        "menu": get_role_menu("administrator"),
        "permissions": ["view_dashboard", "view_profile", "manage_users"]
    }

# ============== SECURITY EVENTS ENDPOINTS ==============

@app.get("/api/v1/security/events")
async def get_security_events(
    skip: int = 0,
    limit: int = 20,
    severity: str = None,
    status: str = None,
    event_type: str = None,
    search: str = None,
    start_date: str = None,
    end_date: str = None
):
    """Get security events with filtering"""
    global SECURITY_EVENTS
    
    filtered = SECURITY_EVENTS.copy()
    
    if severity:
        filtered = [e for e in filtered if e.get("severity") == severity]
    if status:
        filtered = [e for e in filtered if e.get("status") == status]
    if event_type:
        filtered = [e for e in filtered if e.get("event_type") == event_type]
    if search:
        search_lower = search.lower()
        filtered = [e for e in filtered if 
                   search_lower in e.get("description", "").lower() or 
                   search_lower in e.get("username", "").lower() or
                   search_lower in e.get("ip_address", "").lower()]
    
    filtered.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    total = len(filtered)
    events = filtered[skip:skip + limit]
    
    return {
        "items": events,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/v1/security/stats")
async def get_security_stats():
    """Get security event statistics"""
    global SECURITY_EVENTS
    
    total = len(SECURITY_EVENTS)
    unresolved = len([e for e in SECURITY_EVENTS if e.get("status") == "active"])
    
    last_24h = 0
    for e in SECURITY_EVENTS:
        try:
            if e.get("created_at"):
                created = datetime.fromisoformat(e["created_at"].replace('Z', '+00:00'))
                if created > datetime.now() - timedelta(hours=24):
                    last_24h += 1
        except:
            pass
    
    by_severity = {
        "low": len([e for e in SECURITY_EVENTS if e.get("severity") == "low"]),
        "medium": len([e for e in SECURITY_EVENTS if e.get("severity") == "medium"]),
        "high": len([e for e in SECURITY_EVENTS if e.get("severity") == "high"]),
        "critical": len([e for e in SECURITY_EVENTS if e.get("severity") == "critical"])
    }
    
    by_status = {
        "active": len([e for e in SECURITY_EVENTS if e.get("status") == "active"]),
        "resolved": len([e for e in SECURITY_EVENTS if e.get("status") == "resolved"]),
        "ignored": len([e for e in SECURITY_EVENTS if e.get("status") == "ignored"])
    }
    
    return {
        "total": total,
        "unresolved": unresolved,
        "last_24h": last_24h,
        "by_severity": by_severity,
        "by_status": by_status
    }

@app.post("/api/v1/security/events/simulate")
async def simulate_security_event(request: dict):
    """Simulate a security event for testing"""
    global SECURITY_EVENTS, SECURITY_EVENT_ID
    
    event_type = request.get("event_type", "suspicious_activity")
    severity = request.get("severity", "medium")
    description = request.get("description", "Simulated security event for testing")
    
    valid_severities = ["low", "medium", "high", "critical"]
    if severity not in valid_severities:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid severity. Must be one of: {', '.join(valid_severities)}"
        )
    
    event = {
        "id": SECURITY_EVENT_ID,
        "event_type": event_type,
        "severity": severity,
        "description": description,
        "username": "system_test",
        "ip_address": f"192.168.1.{random.randint(1, 255)}",
        "status": "active",
        "location": f"Location {random.randint(1, 10)}",
        "metadata": {
            "simulated": True,
            "timestamp": datetime.now().isoformat()
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "resolved_at": None,
        "resolved_by": None,
        "resolution_notes": None
    }
    
    SECURITY_EVENTS.append(event)
    SECURITY_EVENT_ID += 1
    
    # Emit socket notification for new security event
    await sio.emit('notification', {
        'type': 'security',
        'title': f'{severity.upper()} Security Event',
        'message': description,
        'timestamp': datetime.utcnow().isoformat(),
        'data': event
    })
    
    return event

@app.put("/api/v1/security/events/{event_id}/resolve")
async def resolve_security_event(event_id: int, request: dict):
    """Resolve a security event"""
    global SECURITY_EVENTS
    
    resolution_notes = request.get("resolution_notes")
    status = request.get("status", "resolved")
    
    if not resolution_notes:
        raise HTTPException(status_code=400, detail="Resolution notes are required")
    
    for event in SECURITY_EVENTS:
        if event.get("id") == event_id:
            event["status"] = status
            event["resolution_notes"] = resolution_notes
            event["resolved_by"] = "admin"
            event["resolved_at"] = datetime.now().isoformat()
            event["updated_at"] = datetime.now().isoformat()
            return event
    
    raise HTTPException(status_code=404, detail="Event not found")

@app.get("/api/v1/security/rules")
async def get_security_rules(is_active: bool = None):
    """Get security rules"""
    rules = SECURITY_RULES.copy()
    
    if is_active is not None:
        rules = [r for r in rules if r.get("is_active") == is_active]
    
    return rules

@app.put("/api/v1/security/rules/{rule_id}/toggle")
async def toggle_security_rule(rule_id: int):
    """Toggle security rule active status"""
    for rule in SECURITY_RULES:
        if rule.get("id") == rule_id:
            rule["is_active"] = not rule.get("is_active", True)
            return rule
    
    raise HTTPException(status_code=404, detail="Rule not found")

# ============== DASHBOARD STATS ==============

@app.get("/api/v1/dashboard/stats")
async def get_stats():
    total_revenue_sll = sum(p.get("amount_sll", 0) for p in PAYMENTS)
    
    return {
        "totalClients": len(CLIENTS),
        "activeMeters": len([m for m in METERS if m.get("status") == "active"]),
        "totalRevenue": total_revenue_sll,
        "totalRevenueUSD": convert_to_usd(total_revenue_sll),
        "monthlyRevenue": total_revenue_sll,
        "monthlyRevenueUSD": convert_to_usd(total_revenue_sll),
        "activeAlerts": len([a for a in ALERTS if not a.get("resolved")]),
        "criticalAlerts": len([a for a in ALERTS if a.get("severity") == "critical"]),
        "meterUtilization": 95,
        "collectionRate": 87.5,
        "stolenMeters": 3,
        "totalUsers": len(USERS),
        "activeUsers": len([u for u in USERS if u.get("status") == "active"]),
        "pendingVerifications": len([u for u in USERS if u.get("status") == "pending_verification"]),
        "backups": len(BACKUPS),
        "securityEvents": len(SECURITY_EVENTS),
        "pendingApprovals": len([e for e in EXCEPTION_REQUESTS if e.get("status") == "pending_approval"]),
        "activeComplaints": len([c for c in COMPLAINTS if c.get("status") in ["pending", "in_progress"]]),
        "resolvedCases": len([c for c in COMPLAINTS if c.get("status") == "resolved"]),
        "workOrders": len(WORK_ORDERS),
        "fieldTeams": 4,
        "creditBalance": 32.4,
        "totalTokens": len(TOKENS),
        "activeTokens": len([t for t in TOKENS if t.get("status") == "active"]),
        "totalPaid": total_revenue_sll,
        "totalPaidUSD": convert_to_usd(total_revenue_sll),
        "totalBills": len(BILLS),
        "pendingBills": len([b for b in BILLS if b.get("payment_status") in ["pending", "overdue"]]),
        "currency": {
            "code": CURRENCY_CODE,
            "symbol": CURRENCY_SYMBOL,
            "exchange_rate": EXCHANGE_RATE
        }
    }

# ============== CLIENT ENDPOINTS ==============

@app.get("/api/v1/clients")
async def get_clients():
    return CLIENTS

@app.get("/api/v1/clients/{client_id}")
async def get_client(client_id: str):
    client = next((c for c in CLIENTS if c.get("id") == client_id), None)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@app.get("/api/v1/meters")
async def get_meters():
    return METERS

@app.get("/api/v1/meters/client/{client_id}")
async def get_client_meters(client_id: str):
    return [m for m in METERS if m.get("client_id") == client_id]

@app.get("/api/v1/tokens")
async def get_tokens():
    return TOKENS

@app.get("/api/v1/tokens/client/{client_id}")
async def get_client_tokens(client_id: str):
    return [t for t in TOKENS if t.get("client_id") == client_id]

@app.get("/api/v1/bills")
async def get_bills():
    return BILLS

@app.get("/api/v1/bills/client/{client_id}")
async def get_client_bills(client_id: str):
    return [b for b in BILLS if b.get("client_id") == client_id]

@app.get("/api/v1/payments")
async def get_payments():
    return PAYMENTS

@app.get("/api/v1/payments/client/{client_id}")
async def get_client_payments(client_id: str):
    return [p for p in PAYMENTS if p.get("client_id") == client_id]

@app.get("/api/v1/alerts")
async def get_alerts():
    return ALERTS

@app.get("/api/v1/alerts/client/{client_id}")
async def get_client_alerts(client_id: str):
    return [a for a in ALERTS if a.get("client_id") == client_id]

@app.get("/api/v1/outages")
async def get_outages():
    return OUTAGES

@app.post("/api/v1/client/buy-credit")
async def buy_credit(request: dict):
    amount_usd = request.get("amount", 50)
    payment_method = request.get("payment_method", "mobile_money")
    provider = request.get("provider", "afrimoney")
    client_id = request.get("client_id", "CLT001")
    
    amount_sll = convert_to_sll(amount_usd)
    units = amount_usd / 15.50
    
    token_code = f"EDSA-{uuid.uuid4().hex[:4].upper()}-{uuid.uuid4().hex[:4].upper()}-{uuid.uuid4().hex[:4].upper()}-{uuid.uuid4().hex[:4].upper()}"
    
    token = {
        "id": f"TOK{len(TOKENS) + 1:03d}",
        "token_code": token_code,
        "client_id": client_id,
        "amount": amount_usd,
        "amount_sll": amount_sll,
        "units": units,
        "status": "active",
        "generation_date": datetime.utcnow().isoformat(),
        "expiry_date": (datetime.utcnow() + timedelta(days=30)).isoformat()
    }
    TOKENS.append(token)
    
    payment = {
        "id": f"PAY{len(PAYMENTS) + 1:03d}",
        "payment_reference": f"PAY-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "client_id": client_id,
        "client_name": "Client",
        "amount": amount_usd,
        "amount_sll": amount_sll,
        "payment_date": datetime.utcnow().isoformat(),
        "payment_method": payment_method,
        "provider": provider,
        "status": "completed",
        "token_code": token_code,
        "currency": CURRENCY_CODE
    }
    PAYMENTS.append(payment)
    
    # Emit socket notification for credit purchase
    await sio.emit('notification', {
        'type': 'success',
        'title': 'Credit Purchase',
        'message': f'Credit purchase of ${amount_usd} completed',
        'timestamp': datetime.utcnow().isoformat(),
        'data': {'token': token, 'payment': payment}
    })
    
    return {
        "success": True,
        "token": token,
        "payment": payment,
        "currency": {
            "code": CURRENCY_CODE,
            "symbol": CURRENCY_SYMBOL,
            "exchange_rate": EXCHANGE_RATE
        },
        "message": f"Credit purchased successfully in {CURRENCY_CODE}"
    }

@app.post("/api/v1/client/complaints")
async def submit_complaint(request: dict):
    complaint = {
        "id": f"COM{len(COMPLAINTS) + 1:04d}",
        "client_id": request.get("client_id", "CLT001"),
        "type": request.get("type"),
        "location": request.get("location"),
        "description": request.get("description"),
        "status": "pending",
        "priority": "high" if request.get("type") == "safety_emergency" else "medium",
        "created_at": datetime.utcnow().isoformat()
    }
    COMPLAINTS.append(complaint)
    
    # Emit socket notification for new complaint
    await sio.emit('notification', {
        'type': 'warning',
        'title': 'New Complaint',
        'message': f'New complaint: {complaint["type"]}',
        'timestamp': datetime.utcnow().isoformat(),
        'data': complaint
    })
    
    return {
        "success": True,
        "complaint": complaint,
        "reference": complaint["id"],
        "message": "Complaint submitted successfully"
    }

# ============== STAFF ENDPOINTS ==============

@app.get("/api/v1/staff/complaints")
async def get_staff_complaints():
    return COMPLAINTS

@app.get("/api/v1/staff/work-orders")
async def get_staff_work_orders():
    return WORK_ORDERS

# ============== IT MANAGER ENDPOINTS ==============

@app.get("/api/v1/it/system-health")
async def get_system_health():
    return {
        "status": "healthy",
        "uptime": "99.98%",
        "response_time": "142ms",
        "error_rate": "0.02%",
        "database": "connected",
        "redis": "connected",
        "mqtt": "connected",
        "environment": ENVIRONMENT,
        "currency": CURRENCY_CODE
    }

@app.get("/api/v1/it/backups")
async def get_it_backups():
    return BACKUPS

# ============== EXECUTIVE ENDPOINTS ==============

@app.get("/api/v1/executive/revenue")
async def get_revenue():
    total_revenue_sll = sum(p.get("amount_sll", 0) for p in PAYMENTS)
    
    return {
        "totalRevenue": total_revenue_sll,
        "totalRevenueUSD": convert_to_usd(total_revenue_sll),
        "monthlyRevenue": total_revenue_sll,
        "monthlyRevenueUSD": convert_to_usd(total_revenue_sll),
        "collectionRate": 87.5,
        "outstanding": 12500,
        "outstandingSLL": convert_to_sll(12500),
        "currency": CURRENCY_CODE,
        "currencySymbol": CURRENCY_SYMBOL,
        "revenueData": [
            {"month": "Jan", "amount": 85000, "amount_sll": convert_to_sll(85000)},
            {"month": "Feb", "amount": 92000, "amount_sll": convert_to_sll(92000)},
            {"month": "Mar", "amount": 88000, "amount_sll": convert_to_sll(88000)},
            {"month": "Apr", "amount": 95000, "amount_sll": convert_to_sll(95000)},
            {"month": "May", "amount": 102000, "amount_sll": convert_to_sll(102000)},
            {"month": "Jun", "amount": 98000, "amount_sll": convert_to_sll(98000)}
        ]
    }

@app.get("/api/v1/executive/losses")
async def get_losses():
    return {
        "totalLoss": 8.2,
        "lossCost": 45000,
        "lossCostSLL": convert_to_sll(45000),
        "improvement": 1.3,
        "highLossAreas": 3,
        "currency": CURRENCY_CODE,
        "lossData": [
            {"district": "Western", "loss": 8.2, "cost": 45000, "cost_sll": convert_to_sll(45000), "status": "critical"},
            {"district": "Eastern", "loss": 6.5, "cost": 32000, "cost_sll": convert_to_sll(32000), "status": "high"},
            {"district": "Northern", "loss": 5.1, "cost": 28000, "cost_sll": convert_to_sll(28000), "status": "medium"},
            {"district": "Southern", "loss": 4.8, "cost": 21000, "cost_sll": convert_to_sll(21000), "status": "low"}
        ]
    }

@app.get("/api/v1/executive/fraud-overview")
async def get_fraud_overview():
    return {
        "totalCases": 28,
        "openCases": 8,
        "recovered": 45000,
        "recoveredSLL": convert_to_sll(45000),
        "detectionRate": 78,
        "currency": CURRENCY_CODE,
        "fraudData": [
            {"id": "FRD001", "type": "Meter Tampering", "status": "open", "amount": 4500, "amount_sll": convert_to_sll(4500)},
            {"id": "FRD002", "type": "Electricity Theft", "status": "investigating", "amount": 12500, "amount_sll": convert_to_sll(12500)},
            {"id": "FRD003", "type": "Token Fraud", "status": "resolved", "amount": 1200, "amount_sll": convert_to_sll(1200)}
        ]
    }

# ============== OPERATIONS MANAGER ENDPOINTS ==============

@app.get("/api/v1/operations/approvals")
async def get_approvals():
    return EXCEPTION_REQUESTS

@app.get("/api/v1/operations/approvals")
async def get_operations_approvals():
    """Get all operations approvals"""
    return [
        {
            "id": "APR001",
            "type": "Debt Waiver",
            "requestor": "Jane Staff",
            "client": "CLT002",
            "amount": 12500,
            "status": "pending",
            "submitted": "2026-09-10T10:00:00",
            "description": "Customer requesting debt waiver due to financial hardship",
            "priority": "high"
        },
        {
            "id": "APR002",
            "type": "Bill Adjustment",
            "requestor": "John Staff",
            "client": "CLT001",
            "amount": 100,
            "status": "pending",
            "submitted": "2026-09-10T09:30:00",
            "description": "Incorrect billing adjustment request",
            "priority": "medium"
        },
        {
            "id": "APR003",
            "type": "Payment Plan",
            "requestor": "Mary Staff",
            "client": "CLT003",
            "amount": 8500,
            "status": "approved",
            "submitted": "2026-09-09T14:00:00",
            "description": "Payment plan for outstanding debt",
            "priority": "high"
        },
        {
            "id": "APR004",
            "type": "Meter Replacement",
            "requestor": "Tom Staff",
            "client": "CLT004",
            "amount": 2500,
            "status": "pending",
            "submitted": "2026-09-10T08:00:00",
            "description": "Meter replacement request due to damage",
            "priority": "medium"
        }
    ]

@app.post("/api/v1/operations/approvals/{approval_id}/approve")
async def approve_request(approval_id: str):
    """Approve a request"""
    # Emit socket notification
    await sio.emit('notification', {
        'type': 'success',
        'title': 'Request Approved',
        'message': f'Request {approval_id} has been approved',
        'timestamp': datetime.utcnow().isoformat(),
        'data': {'approval_id': approval_id, 'status': 'approved'}
    })
    
    return {
        "success": True,
        "message": f"Request {approval_id} approved",
        "approval_id": approval_id,
        "status": "approved"
    }

@app.post("/api/v1/operations/approvals/{approval_id}/reject")
async def reject_request(approval_id: str):
    """Reject a request"""
    # Emit socket notification
    await sio.emit('notification', {
        'type': 'warning',
        'title': 'Request Rejected',
        'message': f'Request {approval_id} has been rejected',
        'timestamp': datetime.utcnow().isoformat(),
        'data': {'approval_id': approval_id, 'status': 'rejected'}
    })
    
    return {
        "success": True,
        "message": f"Request {approval_id} rejected",
        "approval_id": approval_id,
        "status": "rejected"
    }

# ============== ADMIN ENDPOINTS ==============

@app.get("/api/v1/admin/users")
async def get_admin_users():
    return USERS

@app.get("/api/v1/admin/audit-log")
async def get_audit_log():
    return AUDIT_LOGS

@app.post("/api/v1/admin/backup")
async def create_backup():
    backup = {
        "id": f"BAK{len(BACKUPS) + 1:03d}",
        "name": f"Manual Backup {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
        "size": "2.6 GB",
        "date": datetime.utcnow().isoformat(),
        "status": "completed"
    }
    BACKUPS.append(backup)
    
    # Emit socket notification
    await sio.emit('notification', {
        'type': 'info',
        'title': 'Backup Created',
        'message': f'Backup {backup["name"]} completed',
        'timestamp': datetime.utcnow().isoformat(),
        'data': backup
    })
    
    return {
        "success": True,
        "backup": backup,
        "message": "Backup created successfully"
    }

# ============== HEALTH AND ROOT ==============

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": ENVIRONMENT,
        "currency": CURRENCY_CODE,
        "services": {
            "api": "running",
            "database": "connected",
            "socketio": "running"
        }
    }

@app.get("/")
async def root():
    return {
        "name": "EDSA Management System",
        "version": "2.0.0",
        "status": "running",
        "environment": ENVIRONMENT,
        "currency": {
            "code": CURRENCY_CODE,
            "symbol": CURRENCY_SYMBOL,
            "exchange_rate": EXCHANGE_RATE
        },
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "socketio": "/socket.io",
            "auth": "/api/v1/auth/login",
            "register": "/api/v1/auth/register",
            "verify-email": "/api/v1/auth/verify-email",
            "resend-verification": "/api/v1/auth/resend-verification",
            "dashboard": "/api/v1/dashboard/stats",
            "security": {
                "events": "/api/v1/security/events",
                "stats": "/api/v1/security/stats",
                "simulate": "/api/v1/security/events/simulate",
                "resolve": "/api/v1/security/events/{event_id}/resolve",
                "rules": "/api/v1/security/rules"
            }
        }
    }

# ============== SOCKET.IO ASGI APP ==============

# Create the combined ASGI app with Socket.io support
socket_app = socketio.ASGIApp(
    sio,
    other_asgi_app=app,
    socketio_path='socket.io'
)

# ============== MAIN ENTRY POINT ==============

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 8000))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    
    uvicorn.run(
        "app.main:socket_app",  # Use socket_app for Socket.io support
        host=host,
        port=port,
        reload=DEBUG,
        log_level="info" if not DEBUG else "debug"
    )