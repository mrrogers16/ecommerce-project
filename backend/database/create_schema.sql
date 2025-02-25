
-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create shoes table
CREATE TABLE shoes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    sizes INTEGER[],
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Sample Data Example
-- 
-- INSERT INTO customers (first_name, last_name, email, password_hash, phone, address)
-- VALUES ('John', 'Doe', 'john@example.com', 'hashed_password_here', '123-456-7890', '123 Main St, NY');

-- INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
-- VALUES ('Air Jordan 1', 'Nike', 199.99, 50, ARRAY[7,8,9,10,11], 'https://example.com/airjordan1.jpg');

INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
VALUES ('Chuck Taylor All Star', 
        'Converse',
        65,
        20, 
        ARRAY[2, 3, 4, 5, 6, 7, 8, 9],
        'https://m.media-amazon.com/images/I/514DUfoH7mL._AC_SX575_.jpg'
    );

INSERT INTO customers (first_name, last_name, email, password_hash, phone, address)
VALUES ('John',
        'Doe',
        'john@example.com',
        'hashed_password_here',
        '123-456-7890',
        '123 Main St, NY'
    );


