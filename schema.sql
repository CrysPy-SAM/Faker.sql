CREATE TABLE user(
     id VARCHAR(50) PRIMARY KEY,
     username VARCHAR(50) UNIQUE,
     email VARCHAR(50) UNIQUE,
     password VARCHAR(50) NOT NULL
     
     );