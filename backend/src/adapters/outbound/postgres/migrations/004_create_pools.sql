-- Create pools table
CREATE TABLE IF NOT EXISTS pools (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pool_members table
CREATE TABLE IF NOT EXISTS pool_members (
  id SERIAL PRIMARY KEY,
  pool_id INTEGER NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(50) NOT NULL,
  cb_before DECIMAL(15,2) NOT NULL,
  cb_after DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pools_year ON pools(year);
CREATE INDEX IF NOT EXISTS idx_pool_members_pool_id ON pool_members(pool_id);
CREATE INDEX IF NOT EXISTS idx_pool_members_ship_id ON pool_members(ship_id);

-- Comments
COMMENT ON TABLE pools IS 'Pooling arrangements (FuelEU Article 21)';
COMMENT ON TABLE pool_members IS 'Members of each pool with before/after CB';
COMMENT ON COLUMN pool_members.cb_before IS 'CB before pooling in gCO₂e';
COMMENT ON COLUMN pool_members.cb_after IS 'CB after pooling in gCO₂e';
