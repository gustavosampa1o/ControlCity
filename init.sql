CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

INSERT INTO users (email, password, role) VALUES
    ('admin@controlcity.com', 'demo123', 'admin');
