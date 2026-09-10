import sqlite3 
import os 
 
os.chdir(r'C:\Users\amich\Desktop\electricity-management-system\backend') 
 
db_file = "electricity.db" 
 
conn = sqlite3.connect(db_file) 
cursor = conn.cursor() 
 
cursor.execute(''' 
CREATE TABLE IF NOT EXISTS users ( 
    id TEXT PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL, 
    name TEXT NOT NULL, 
    role TEXT DEFAULT 'client', 
    status TEXT DEFAULT 'pending_verification', 
    client_id TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
) 
''') 
 
cursor.execute(''' 
INSERT OR REPLACE INTO users (id, username, email, password, name, role, status, client_id) 
VALUES ('USR008', 'testuser6', 'test6@example.com', 'Password123', 'Test User 6', 'client', 'active', 'CLT004') 
''') 
 
cursor.execute(''' 
INSERT OR REPLACE INTO users (id, username, email, password, name, role, status, client_id) 
VALUES ('USR001', 'admin', 'admin@example.com', 'Admin123', 'Administrator', 'admin', 'active', 'CLT001') 
''') 
 
conn.commit() 
 
cursor.execute("SELECT id, username, status FROM users") 
users = cursor.fetchall() 
print("Users in database:") 
for user in users: 
    print(f"  - {user[0]}: {user[1]} ({user[2]})") 
 
conn.close() 
print(f"\nDatabase created: {db_file}") 
print("Setup complete!") 
