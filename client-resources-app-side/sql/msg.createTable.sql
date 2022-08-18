CREATE TABLE group${group_id} (
    cursor VARCHAR(63) NOT NULL PRIMARY KEY,
    content VARCHAR(2047) NOT NULL,
    cType INTEGER DEFAULT 0,
    status INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    username VARCHAR(63) NOT NULL,
    is_received INTEGER DEFAULT 0,
    timestamp INTEGER NOT NULL DEFAULT 0,
    ip VARCHAR(42)
);