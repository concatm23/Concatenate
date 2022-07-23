CREATE TABLE list(
    list_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    alias VARCHAR(63) DEFAULT '',
    join_time INTEGER DEFAULT 0,
    last_read INTEGER DEFAULT 0,
    last_msg INTEGER DEFAULT 0,
    is_on_top INTEGER DEFAULT 0,
    is_show INTEGER DEFAULT 1,
    group_type INTEGER DEFAULT 0,
    user_uid INTEGER NOT NULL
)