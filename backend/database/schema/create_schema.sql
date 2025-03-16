
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

-- --Create discount tabble
--CREATE TABLE discounts(
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   code VARCHAR(50) UNIQUE NOT NULL,
--   discount_percent DECIMAL(5,2) NOT NULL,
--   expiration_date TIMESTAMP NOT NULL,
--   is_active BOOLEAN DEFAULT TRUE
-- );



-- Insert Sample Data Example (Moved to external files)
-- 
-- INSERT INTO customers (first_name, last_name, email, password_hash, phone, address)
-- VALUES ('John', 'Doe', 'john@example.com', 'hashed_password_here', '123-456-7890', '123 Main St, NY');

-- INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
-- VALUES ('Air Jordan 1', 'Nike', 199.99, 50, ARRAY[7,8,9,10,11], 'https://example.com/airjordan1.jpg');





