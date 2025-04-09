
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
-- Create cart items table
-- CREATE TABLE cart_items (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
--     shoe_id UUID REFERENCES shoes(id),
--     quantity INT CHECK (quantity > 0),
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- Create orders table
-- CREATE TABLE orders (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
--     total_price DECIMAL(10,2) NOT NULL,
--     status VARCHAR(20) DEFAULT 'pending',
--     tax DECIMAL(10, 2) DEFAULT 0;
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- Create order_items table
-- CREATE TABLE order_items (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
--     shoe_id UUID REFERENCES shoes(id),
--     quantity INT CHECK (quantity > 0),
--     price DECIMAL(10,2) NOT NULL,  -- store the price at the time of purchase
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- Create discount_codes table
-- CREATE TABLE discount_codes (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     code VARCHAR(50) UNIQUE NOT NULL,  -- Example SAVE10, WELCOME20
--     discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
--     discount_value DECIMAL(10,2) NOT NULL,
--     min_order_total DECIMAL(10,2) DEFAULT 0,
--     active BOOLEAN DEFAULT true,
--     expires_at TIMESTAMP,
--     usage_limit INT DEFAULT 0,
--     times_used INT DEFAULT 0, -- Max times code can be used overall, 0 means infinite
--     created_at TIMESTAMP DEFAULT NOW()
-- );
-- Create audit_logs table
-- CREATE TABLE audit_logs (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID REFERENCES customers(id) ON DELETE SET NULL,
--     action VARCHAR(50) NOT NULL,
--     target_table VARCHAR(50),
--     target_id UUID,
--     details JSONB,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE contact_messages (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(100) NOT NULL,
--     message TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- CREATE TABLE reviews (
--    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
--    shoe_id UUID NOT NULL REFERENCES shoes(id) ON DELETE CASCADE,
--    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
--    review_text TEXT,
--    helpful_count INT DEFAULT 0,
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--  );


-- ADDED A NEW COLUMN TO ALL SHOES FOR CLASSIFICATION
-- ALTER TABLE shoes
-- ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'mens' CHECK (category IN ('mens', 'womens', 'kids'));


-- ADDED A NEW COLUMN TO cart_items FOR SIZE 
-- ALTER TABLE cart_items
-- ADD COLUMN selected_size VARCHAR(10);

