
-- -- Create customers table
-- CREATE TABLE customers (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password_hash TEXT NOT NULL,
--     phone VARCHAR(20),
--     address TEXT,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- -- Create shoes table
-- CREATE TABLE shoes(
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(100) NOT NULL,
--     brand VARCHAR(50) NOT NULL,
--     price DECIMAL(10,2) NOT NULL,
--     stock INT DEFAULT 0,
--     sizes INTEGER[],
--     image_url TEXT,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- --Create discount table
--CREATE TABLE discounts(
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   code VARCHAR(50) UNIQUE NOT NULL,
--   discount_percent DECIMAL(5,2) NOT NULL,
--   expiration_date TIMESTAMP NOT NULL,
--   is_active BOOLEAN DEFAULT TRUE
-- );

-- Create carts table
-- CREATE TABLE carts ( 
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DECIMAL NOW()
-- );

-- CREATE TABLE cart_items (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
--     shoe_id UUID REFERENCES shoes(id),
--     quantity INT CHECK (quantity > 0),
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE orders (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
--     total_price DECIMAL(10,2) NOT NULL,
--     status VARCHAR(20) DEFAULT 'pending',
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE order_items (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
--     shoe_id UUID REFERENCES shoes(id),
--     quantity INT CHECK (quantity > 0),
--     price DECIMAL(10,2) NOT NULL,  -- store the price at the time of purchase
--     created_at TIMESTAMP DEFAULT NOW()
-- );





