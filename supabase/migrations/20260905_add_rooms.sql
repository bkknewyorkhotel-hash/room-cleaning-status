-- Migration script for adding new rooms (206-210, 306-310, 401-410)
-- and ensuring DELETE policy exists.
-- Run this in Supabase SQL Editor if you already ran the initial migration.

-- 1. Ensure DELETE policy exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'rooms' AND policyname = 'Allow public delete access to rooms'
    ) THEN
        CREATE POLICY "Allow public delete access to rooms" 
        ON public.rooms 
        FOR DELETE 
        USING (true);
    END IF;
END $$;

-- 2. Insert new rooms if they do not exist
INSERT INTO public.rooms (room_number, status, sort_order) VALUES
-- ชั้น 2 ที่เพิ่มเติม (206-210)
('206', 'CLEAN', 11),
('207', 'DIRTY', 12),
('208', 'CLEAN', 13),
('209', 'DIRTY', 14),
('210', 'CLEAN', 15),

-- ชั้น 3 ที่เพิ่มเติม (306-310)
('306', 'DIRTY', 21),
('307', 'CLEAN', 22),
('308', 'DIRTY', 23),
('309', 'CLEAN', 24),
('310', 'CLEAN', 25),

-- ชั้น 4 ทั้งหมด (401-410)
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
