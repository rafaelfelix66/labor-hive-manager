-- Initial database setup for Labor Hive Manager

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE entity_type AS ENUM ('Corporation', 'LLC', 'Partnership');
CREATE TYPE markup_type AS ENUM ('Percent', 'Dollar');
CREATE TYPE bill_status AS ENUM ('Paid', 'Pending', 'Overdue');
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn VARCHAR(11) NOT NULL,
    gender gender_type NOT NULL,
    english_level INTEGER NOT NULL,
    has_drivers_license BOOLEAN NOT NULL DEFAULT FALSE,
    license_file_url VARCHAR(500),
    work_experience TEXT[],
    additional_experience TEXT,
    previous_company_name VARCHAR(255),
    previous_company_phone VARCHAR(20),
    previous_company_email VARCHAR(255),
    address1 VARCHAR(255) NOT NULL,
    suite VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    emergency_contact_relation VARCHAR(100) NOT NULL,
    how_did_you_hear VARCHAR(255) NOT NULL,
    status application_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id)
);

-- Service providers table
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id),
    services TEXT[],
    hourly_rate DECIMAL(10,2),
    assigned_to VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table (for both clients and suppliers)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    entity entity_type NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'client' or 'supplier'
    street VARCHAR(255) NOT NULL,
    suite VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    wc_class VARCHAR(10),
    markup_type markup_type,
    markup_value DECIMAL(10,2),
    commission DECIMAL(5,2),
    assigned_to VARCHAR(255),
    internal_notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bills table
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES companies(id),
    provider_id UUID REFERENCES service_providers(id),
    service VARCHAR(255) NOT NULL,
    hours_worked DECIMAL(5,2) NOT NULL,
    service_rate DECIMAL(10,2) NOT NULL,
    total_client DECIMAL(10,2) NOT NULL,
    total_provider DECIMAL(10,2) NOT NULL,
    status bill_status NOT NULL DEFAULT 'Pending',
    due_date DATE,
    paid_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role) 
VALUES ('admin', 'admin@laborpro.com', '$2b$10$placeholder', 'admin');

-- Insert default user
INSERT INTO users (username, email, password_hash, role) 
VALUES ('user', 'user@laborpro.com', '$2b$10$placeholder', 'user');

-- Create indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);
CREATE INDEX idx_service_providers_active ON service_providers(active);
CREATE INDEX idx_companies_type ON companies(type);
CREATE INDEX idx_companies_active ON companies(active);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_created_at ON bills(created_at);