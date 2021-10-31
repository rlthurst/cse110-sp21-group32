CREATE DATABASE mydb;

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" varchar(255) UNIQUE,
    "hash" varchar(255),
    "salt" varchar(255),
);