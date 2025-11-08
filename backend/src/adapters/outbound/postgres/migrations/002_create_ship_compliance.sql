-- Create ship_compliance table
CREATE TABLE IF NOT EXISTS ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ship_id, year)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ship_compliance_ship_year ON ship_compliance(ship_id, year);

-- Comments
COMMENT ON TABLE ship_compliance IS 'Ship compliance balance records';
COMMENT ON COLUMN ship_compliance.cb_gco2eq IS 'Compliance Balance in gCO₂e (positive = surplus, negative = deficit)';
