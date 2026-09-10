import sqlite3
import os

# Change to your backend directory
os.chdir(r'C:\Users\amich\Desktop\electricity-management-system\backend')

# Connect to the database
db_files = [f for f in os.listdir('.') if f.endswith('.db')]
if db_files:
    db_file = db_files[0]
    print("Found database: " + db_file)
    
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    # Update user status
    cursor.execute("UPDATE users SET status = 'active' WHERE username = 'testuser6'")
    conn.commit()
    
    # Check if updated
    cursor.execute("SELECT id, username, status FROM users WHERE username = 'testuser6'")
    result = cursor.fetchone()
    if result:
        print("User " + result[1] + " updated to status: " + result[2])
    else:
        print("User not found")
    
    conn.close()
else:
    print("No database file found in the current directory")