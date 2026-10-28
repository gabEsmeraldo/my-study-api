CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150)   NOT NULL UNIQUE,
    description TEXT,
    price       NUMERIC(12,2)  NOT NULL CHECK (price > 0),
    stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

INSERT INTO products (name, description, price, stock)
SELECT 
    'Produto ' || LPAD(n::text, 2, '0'),
    'Descrição do produto ' || n,
    ROUND((10 + random() * 490)::numeric, 2),
    (random() * 100)::int
FROM generate_series(1, 35) AS n
ON CONFLICT (name) DO NOTHING;