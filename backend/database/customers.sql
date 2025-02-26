DO $$
BEGIN
    -- Insert customers if they don't already exist
    IF NOT EXISTS (SELECT 1 FROM customers WHERE email = 'john@example.com') THEN
        INSERT INTO customers (first_name, last_name, email, password_hash, phone, address)
        VALUES ('John', 'Doe', 'john@example.com', 'hashed_password_here', '123-456-7890', '123 Main St, NY');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM customers WHERE email = 'test@robbymcbobbit.com') THEN
        INSERT INTO customers (first_name, last_name, email, password_hash, phone, address)
        VALUES ('Robby', 'McBobbit', 'test@robbymcbobbit.com', 'hashed_password_here TODO:write the script', '456-575-4569', '111 Converse St., NY');
    END IF;

END $$;
