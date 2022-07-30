CREATE TABLE cache(
    list_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key VARCHAR(255) NOT NULL UNIQUE,
    cache_value BLOB,
    expires_at INTEGER NOT NULL,
    no_query NOT NULL DEFAULT 0
)