-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(50) UNIQUE NOT NULL,
  vessel_type VARCHAR(50) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity DECIMAL(10,4) NOT NULL,
  fuel_consumption DECIMAL(10,2) NOT NULL,
  distance DECIMAL(10,2) NOT NULL,
  total_emissions DECIMAL(10,2) NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_routes_vessel_type ON routes(vessel_type);
CREATE INDEX IF NOT EXISTS idx_routes_fuel_type ON routes(fuel_type);
CREATE INDEX IF NOT EXISTS idx_routes_year ON routes(year);
CREATE INDEX IF NOT EXISTS idx_routes_baseline ON routes(is_baseline);

-- Comments
COMMENT ON TABLE routes IS 'FuelEU Maritime routes with emissions data';
COMMENT ON COLUMN routes.ghg_intensity IS 'GHG intensity in gCO₂e/MJ';
COMMENT ON COLUMN routes.fuel_consumption IS 'Fuel consumption in tonnes';
COMMENT ON COLUMN routes.distance IS 'Distance in kilometers';
COMMENT ON COLUMN routes.total_emissions IS 'Total emissions in tonnes CO₂e';
