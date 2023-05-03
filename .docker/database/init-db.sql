CREATE TABLE
    IF NOT EXISTS bank_payment_slip (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255) NOT NULL,
        due_date DATE NOT NULL,
        payment_date DATE NOT NULL,
        amount FLOAT NOT NULL,
        total_amount_with_fine FLOAT NOT NULL,
        interest_amount_calculated FLOAT NOT NULL,
        fine_amount_calculated FLOAT NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        recipient_document VARCHAR(255) NOT NULL,
        type VARCHAR(56) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW ()
    );