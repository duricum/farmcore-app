-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',   -- admin, farm_manager, sales_rep, accountant, vet
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- LIVESTOCK TABLE
CREATE TABLE livestock (
  id SERIAL PRIMARY KEY,
  tag_id VARCHAR(30) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,           -- Cattle, Goat, Sheep, Pig, Poultry
  breed VARCHAR(100),
  gender VARCHAR(10),
  age_months INT,
  weight_kg DECIMAL(8,2),
  status VARCHAR(30) DEFAULT 'healthy', -- healthy, sick, quarantine, sold, deceased
  acquisition_cost DECIMAL(12,2),
  acquired_date DATE,
  pen_location VARCHAR(50),
  notes TEXT,
  added_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- HEALTH RECORDS
CREATE TABLE health_records (
  id SERIAL PRIMARY KEY,
  livestock_id INT REFERENCES livestock(id),
  condition_name VARCHAR(100),
  treatment TEXT,
  vet_name VARCHAR(100),
  medication VARCHAR(200),
  cost DECIMAL(10,2),
  follow_up_date DATE,
  status VARCHAR(30) DEFAULT 'active', -- active, recovered, deceased
  recorded_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- VACCINATIONS
CREATE TABLE vaccinations (
  id SERIAL PRIMARY KEY,
  livestock_id INT REFERENCES livestock(id),
  vaccine_name VARCHAR(100),
  due_date DATE,
  administered_date DATE,
  administered_by VARCHAR(100),
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, upcoming, overdue, done
  created_at TIMESTAMP DEFAULT NOW()
);

-- FEED INVENTORY
CREATE TABLE feed_inventory (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  quantity DECIMAL(10,2),
  unit VARCHAR(20),
  cost_per_unit DECIMAL(10,2),
  reorder_threshold DECIMAL(10,2) DEFAULT 20,
  supplier VARCHAR(100),
  last_restocked DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MARKETPLACE LISTINGS
CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  livestock_id INT REFERENCES livestock(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  quantity INT DEFAULT 1,
  delivery_available BOOLEAN DEFAULT FALSE,
  location VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- active, sold, draft, expired
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE,
  listing_id INT REFERENCES listings(id),
  buyer_name VARCHAR(100),
  buyer_phone VARCHAR(20),
  buyer_email VARCHAR(150),
  quantity INT,
  total_amount DECIMAL(12,2),
  delivery_address TEXT,
  status VARCHAR(30) DEFAULT 'pending', -- pending, confirmed, transit, completed, cancelled
  notes TEXT,
  processed_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- INVESTORS
CREATE TABLE investors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  investment_amount DECIMAL(14,2),
  agreed_roi_percent DECIMAL(5,2),
  investment_date DATE,
  return_date DATE,
  category VARCHAR(100),
  amount_returned DECIMAL(14,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TRANSACTIONS (Finance)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  description VARCHAR(200),
  category VARCHAR(100),
  amount DECIMAL(12,2),
  type VARCHAR(10),              -- income, expense
  reference_id INT,
  reference_type VARCHAR(50),    -- order, investor, feed, other
  recorded_by INT REFERENCES users(id),
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CRM CONTACTS
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(30),              -- Lead, Customer, Investor, Supplier
  email VARCHAR(150),
  phone VARCHAR(20),
  city VARCHAR(100),
  pipeline_stage VARCHAR(50) DEFAULT 'New Lead',
  deal_value DECIMAL(12,2),
  notes TEXT,
  assigned_to INT REFERENCES users(id),
  last_contact DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AUDIT LOG
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(200),
  table_name VARCHAR(50),
  record_id INT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default admin user (password: Admin@1234)
INSERT INTO users (name, email, password, role)
VALUES ('Admin Owner', 'idriswale70@gmail.com',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'admin');