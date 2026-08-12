-- QueueLess Database Schema
-- Database: MySQL

CREATE DATABASE IF NOT EXISTS queueless;

USE queueless;


-- =========================================================
-- 1. Businesses
-- =========================================================

CREATE TABLE businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. Users
-- =========================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'BUSINESS') NOT NULL,
    business_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
);


-- =========================================================
-- 3. Services
-- =========================================================

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    average_service_time INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
);


-- =========================================================
-- 4. Queues
-- =========================================================

CREATE TABLE queues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    service_id INT NOT NULL,
    status ENUM('OPEN', 'PAUSED', 'CLOSED') NOT NULL DEFAULT 'CLOSED',
    current_token INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id),

    FOREIGN KEY (service_id)
        REFERENCES services(id)
);


-- =========================================================
-- 5. Queue Tokens
-- =========================================================

CREATE TABLE queue_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queue_id INT NOT NULL,
    user_id INT NOT NULL,
    token_number INT NOT NULL,

    status ENUM(
        'WAITING',
        'SERVING',
        'COMPLETED',
        'SKIPPED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'WAITING',

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (queue_id)
        REFERENCES queues(id),

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    UNIQUE (queue_id, token_number)
);
