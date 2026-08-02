import sqlite3

DB_FILE = 'progress.db'

def get_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            target_id TEXT,
            level TEXT,
            item_id TEXT,
            score INTEGER,
            at INTEGER
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            user_id TEXT PRIMARY KEY,
            practice_seconds INTEGER
        )
    ''')
    conn.commit()
    conn.close()

def get_progress(user_id: str) -> dict:
    conn = get_connection()
    c = conn.cursor()
    
    c.execute('SELECT practice_seconds FROM sessions WHERE user_id = ?', (user_id,))
    row = c.fetchone()
    total_practice_seconds = row['practice_seconds'] if row else 0
    
    c.execute('SELECT target_id, level, item_id, score, at FROM attempts WHERE user_id = ? ORDER BY at ASC', (user_id,))
    attempts = []
    for r in c.fetchall():
        attempts.append({
            "targetId": r['target_id'],
            "level": r['level'],
            "itemId": r['item_id'],
            "score": r['score'],
            "at": r['at']
        })
        
    conn.close()
    return {
        "attempts": attempts,
        "totalPracticeSeconds": total_practice_seconds
    }

def save_attempt(user_id: str, attempt: dict):
    conn = get_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO attempts (user_id, target_id, level, item_id, score, at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        attempt.get("targetId", ""),
        attempt.get("level", ""),
        attempt.get("itemId", ""),
        attempt.get("score", 0),
        attempt.get("at", 0)
    ))
    conn.commit()
    conn.close()

def add_practice_time(user_id: str, seconds: int):
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT practice_seconds FROM sessions WHERE user_id = ?', (user_id,))
    row = c.fetchone()
    if row:
        c.execute('UPDATE sessions SET practice_seconds = practice_seconds + ? WHERE user_id = ?', (seconds, user_id))
    else:
        c.execute('INSERT INTO sessions (user_id, practice_seconds) VALUES (?, ?)', (user_id, seconds))
    conn.commit()
    conn.close()
