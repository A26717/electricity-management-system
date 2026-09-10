import sqlite3
import os

os.chdir(r'C:\Users\amich\Desktop\electricity-management-system\backend')

db_file = "electricity.db"

try:
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, username, status FROM users")
    users = cursor.fetchall()
    
    print("Users in database:")
    if users:
        for user in users:
            print(f"  - ID: {user[0]}, Username: {user[1]}, Status: {user[2]}")
    else:
        print("  No users found in database.")
    
    conn.close()
except Exception as e:
    print(f"Error: {e}")
    print(f"Database file: {db_file}")