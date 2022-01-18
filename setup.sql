DROP TABLE IF EXISTS users, password_reset_codes, friendships;

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      image_url text,
      bio text,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    CREATE TABLE password_reset_codes(
      code VARCHAR(255),
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    CREATE TABLE friendships( 
      id SERIAL PRIMARY KEY, 
      sender_id INT REFERENCES users(id) NOT NULL,
      recipient_id INT REFERENCES users(id) NOT NULL,
      accepted BOOLEAN DEFAULT false);

