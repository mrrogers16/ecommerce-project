    
DO $$
BEGIN
    -- Insert shoes if they don't already exist
    IF NOT EXISTS (SELECT 1 FROM shoes WHERE name = 'Chuck Taylor All Star' AND brand = 'Converse') THEN
        INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
        VALUES ('Chuck Taylor All Star', 'Converse', 65, 20, ARRAY[2,3,4,5,6,7,8,9], 'https://m.media-amazon.com/images/I/514DUfoH7mL._AC_SX575_.jpg');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM shoes WHERE name = 'Mens Running Shoe' AND brand = 'Nike') THEN
        INSERT INTO shoes (name, brand, price, stock, sizes, image_url)
        VALUES ('Mens Running Shoe', 'Nike', 72.99, 200, ARRAY[2,3,4,5,6,7,8,9,10,11,12], 'https://m.media-amazon.com/images/I/51yUmzHLKBL._AC_SY695_.jpg');
    END IF;
    
END $$;