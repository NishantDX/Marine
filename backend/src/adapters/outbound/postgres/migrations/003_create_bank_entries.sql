-- Create bank_entries table
CREATE TABLE IF NOT EXISTS bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bank_entries_ship_year ON bank_entries(ship_id, year);

-- Comments
COMMENT ON TABLE bank_entries IS 'Banking records for surplus/deficit (FuelEU Article 20)';
COMMENT ON COLUMN bank_entries.amount_gco2eq IS 'Banked amount in gCO₂e (positive = banked, negative = applied)';
