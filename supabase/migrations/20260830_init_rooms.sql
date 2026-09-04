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

-- Allow public delete access to rooms (for reset and room deletion)
CREATE POLICY "Allow public delete access to rooms" 
ON public.rooms 
FOR DELETE 
USING (true);

-- Enable Realtime for the rooms table
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;

-- Seed Sample Data (Rooms 101-105, 201-210, 301-310, 401-410 - Total 35 rooms)
INSERT INTO public.rooms (room_number, status, sort_order) VALUES
-- ชั้น 1 (101-105)
('101', 'DIRTY', 1),
('102', 'CLEAN', 2),
('103', 'DIRTY', 3),
('104', 'CLEAN', 4),
('105', 'CLEAN', 5),

-- ชั้น 2 (201-210)
('201', 'CLEAN', 6),
('202', 'DIRTY', 7),
('203', 'CLEAN', 8),
('204', 'DIRTY', 9),
('205', 'DIRTY', 10),
('206', 'CLEAN', 11),
('207', 'DIRTY', 12),
('208', 'CLEAN', 13),
('209', 'DIRTY', 14),
('210', 'CLEAN', 15),

-- ชั้น 3 (301-310)
('301', 'CLEAN', 16),
('302', 'CLEAN', 17),
('303', 'DIRTY', 18),
('304', 'CLEAN', 19),
('305', 'CLEAN', 20),
('306', 'DIRTY', 21),
('307', 'CLEAN', 22),
('308', 'DIRTY', 23),
('309', 'CLEAN', 24),
('310', 'CLEAN', 25),

-- ชั้น 4 (401-410)
('401', 'DIRTY', 26),
('402', 'CLEAN', 27),
('403', 'DIRTY', 28),
('404', 'CLEAN', 29),
('405', 'CLEAN', 30),
('406', 'DIRTY', 31),
('407', 'CLEAN', 32),
('408', 'CLEAN', 33),
('409', 'DIRTY', 34),
('410', 'CLEAN', 35)
ON CONFLICT (room_number) DO NOTHING;
