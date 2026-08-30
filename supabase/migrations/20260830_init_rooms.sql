-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DIRTY' CHECK (status IN ('DIRTY', 'CLEAN')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON public.rooms (room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms (status);
CREATE INDEX IF NOT EXISTS idx_rooms_active ON public.rooms (active);
CREATE INDEX IF NOT EXISTS idx_rooms_sort_order ON public.rooms (sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active rooms
CREATE POLICY "Allow public read access to rooms" 
ON public.rooms 
FOR SELECT 
USING (true);

-- Allow public insert access to rooms
CREATE POLICY "Allow public insert access to rooms" 
ON public.rooms 
FOR INSERT 
WITH CHECK (true);

-- Allow public update access to rooms (for room status updates)
CREATE POLICY "Allow public update access to rooms" 
ON public.rooms 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Enable Realtime for the rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;

-- Seed Sample Data (Rooms 101-105, 201-205, 301-305)
INSERT INTO public.rooms (room_number, status, sort_order) VALUES
('101', 'DIRTY', 1),
('102', 'CLEAN', 2),
('103', 'DIRTY', 3),
('104', 'CLEAN', 4),
('105', 'CLEAN', 5),
('201', 'CLEAN', 6),
('202', 'DIRTY', 7),
('203', 'CLEAN', 8),
('204', 'DIRTY', 9),
('205', 'DIRTY', 10),
('301', 'CLEAN', 11),
('302', 'CLEAN', 12),
('303', 'DIRTY', 13),
('304', 'CLEAN', 14),
('305', 'CLEAN', 15)
ON CONFLICT (room_number) DO NOTHING;
