DROP TABLE IF EXISTS users, password_reset_codes;

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      image_url text,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    CREATE TABLE password_reset_codes(
      code VARCHAR(255),
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );