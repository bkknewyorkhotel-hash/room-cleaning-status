# Room Cleaning Status (ระบบติดตามสถานะทำความสะอาดห้องพัก)

เว็บแอปพลิเคชัน real-time สำหรับติดตามสถานะการทำความสะอาดห้องพักในโรงแรมรายชั่วโมง ออกแบบมาให้ใช้งานง่าย รวดเร็ว และรองรับมือถือ/แท็บเล็ต (PWA)

## คุณสมบัติหลัก (Key Features)

- ⚡ **Real-time Synchronization**: อัปเดตสถานะห้องทันทีบนทุกอุปกรณ์ที่เปิดอยู่ (ผ่าน Supabase Realtime หรือ BroadcastChannel ในโหมด local fallback)
- 🏨 **Room Status Card**: แสดงหมายเลขห้องขนาดใหญ่ สะดุดตา พร้อมสถานะชัดเจน (`รอทำความสะอาด` / `ทำความสะอาดแล้ว`)
- 📱 **Mobile & Tablet Friendly (PWA)**: การแสดงผล responsive รองรับมือถือ (2 คอลัมน์) แท็บเล็ต (3-4 คอลัมน์) และเดสก์ท็อป (5-6 คอลัมน์)
- 🔍 **Filter & Search**: กรองห้องตามสถานะ และค้นหาตามหมายเลขห้อง
- 🔐 **Staff & Admin Role**: มีโหมดสลับบทบาท (พนักงาน, ผู้ดูสถานะ, ผู้ดูแลระบบ) พร้อม PIN ล็อกอิน
- ⚙️ **Admin Room Management**: จัดการเพิ่ม/แก้ไขหมายเลขห้อง และเปิด-ปิดการใช้งานห้องพัก (`/admin/rooms`)
- 🇹🇭 **Thai Interface & Bangkok Timezone**: ภาษาไทยทั้งระบบ และแสดงเวลาในรูปแบบ 24 ชั่วโมง (Asia/Bangkok)

---

## เทคโนโลยีที่ใช้ (Tech Stack)

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Realtime**: Supabase PostgreSQL + Supabase Realtime Subscriptions
- **PWA**: Web App Manifest, Standalone Mode support

---

## การเริ่มใช้งานและทดสอบในเครื่อง local (Quick Start)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันแอปพลิเคชันในโหมดพัฒนา (Development Mode)
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## การเชื่อมต่อ Supabase Database

1. สร้างโปรเจกต์ใหม่บน [Supabase.com](https://supabase.com)
2. นำไฟล์ SQL Migration ใน `supabase/migrations/20260830_init_rooms.sql` ไปรันใน **Supabase SQL Editor**
3. คัดลอก `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` มาใส่ในไฟล์ `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJKV1QiLC...
```
4. รีสตาร์ท server `npm run dev`

---

## โครงสร้างโปรเจกต์ (Project Structure)

```text
src/
├── app/
│   ├── admin/rooms/page.tsx   # หน้าจัดการห้องพักสำหรับแอดมิน
│   ├── globals.css            # Tailwind CSS styling
│   ├── layout.tsx             # Root layout & PWA Metadata
│   └── page.tsx               # หน้า Dashboard หลัก
├── components/
│   ├── ConfirmationModal.tsx  # โมดัลยืนยันการเปลี่ยนสถานะ
│   ├── Header.tsx             # ส่วนหัว หัวข้อสถานะการเชื่อมต่อ และตัวนับสถานะ
│   ├── PinModal.tsx           # โมดัลเลือกบทบาทพนักงาน/สลับ PIN
│   ├── RoomCard.tsx           # การ์ดห้องพัก
│   ├── Toast.tsx              # ตัวแจ้งเตือนเมื่อเกิดข้อผิดพลาด
│   └── Toolbar.tsx            # แถบกรอง และค้นหา
└── lib/
    ├── supabase.ts            # Supabase Client & Fallback sync engine
    ├── types.ts               # TypeScript interfaces
    ├── useRooms.ts            # Hook จัดการสถานะห้องพัก & Realtime
    └── utils.ts               # ยูทิลิตี้จัดรูปแบบเวลา Bangkok 24h
```
