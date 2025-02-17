/*
  # Initial Schema Setup for Building Booking System

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - phone (text)
      - role (text)
      - created_at (timestamp)
    
    - buildings
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - location (text)
      - price_per_day (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - bookings
      - id (uuid, primary key)
      - building_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - start_date (timestamp)
      - end_date (timestamp)
      - status (text)
      - payment_proof (text)
      - total_price (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
      - google_calendar_event_id (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  role text DEFAULT 'client',
  created_at timestamptz DEFAULT now()
);

-- Create buildings table
CREATE TABLE buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  price_per_day numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id uuid REFERENCES buildings(id),
  user_id uuid REFERENCES users(id),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'pending',
  payment_proof text,
  total_price numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  google_calendar_event_id text
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for buildings table
CREATE POLICY "Anyone can view buildings"
  ON buildings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify buildings"
  ON buildings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ));

-- Policies for bookings table
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );