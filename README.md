# YUTIRA 2026 — Full Offline Project

This is a full **Next.js + MongoDB** project for Yutira 2026 registration + dashboard + single admin login.

## What’s included

- Landing page with **live countdown** (target: **27 Mar 2026, 09:00 IST**)
- Pages: Events, Workshop, Paper Presentation, Sponsors, About, FAQ, Contact
- Registration:
  - General registration (events + paper) and Workshop (separate)
  - PSG students are detected by email suffix `@psgtech.ac.in`
  - If user selects both, note is shown: **payment must be done separately**
  - Registration closes after **26 Mar 2026, 11:59 PM IST**
- Email workflow (as your admin asked):
  1) Registration first
  2) Email verification
  3) Generate **YUTIRA ID**
  4) Send payment link email with note: **use same name & mobile**
  5) Admin verifies payment manually
- Dashboard:
  - Shows YUTIRA ID
  - Shows payment status (general/workshop)
  - Shows attendance (day 1/day 2)
  - Shows paper abstract submission status
  - Displays notice: **External participants must bring ID card and Bonafide certificate**
- Admin dashboard:
  - Search by YUTIRA ID / name / email / phone
  - Mark general/workshop payment paid/pending
  - Mark attendance Day 1 / Day 2
  - Accept/Reject paper submission
  - Export registrations as CSV

## Tech stack

- Next.js (App Router)
- TailwindCSS
- MongoDB + Mongoose
- JWT auth (httpOnly cookie)
- Nodemailer (SMTP)

---

## How to run (offline)

### 1) Install requirements

- Node.js 18+
- MongoDB (local)

### 2) Setup environment

Copy `.env.example` to `.env` and fill the values.

> You said you will fill `SMTP_PASS` manually — keep it blank until you add it.

If you want to test without email first, set:

```
EMAIL_ENABLED=false
```

### 3) Install dependencies

```bash
npm install
```

### 4) Start MongoDB

Make sure MongoDB is running and `MONGODB_URI` in `.env` is correct.

### 5) Run the app

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## Admin login

Admin login is a **single login** using:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

in `.env`.

Login page: `/login`
Admin dashboard: `/admin`

---

## Paper abstract submission

In the dashboard, users can submit a **PDF URL** (Drive/Cloud link). For strict upload via server (Cloudinary), add Cloudinary credentials in `.env` and implement an upload route.

---

## College list

`lib/colleges.js` currently contains a small sample list + "My college not listed" option.

If you want the full dropdown list you shared, paste it into the `colleges` array in `lib/colleges.js`.

---

## Project structure

- `app/` Pages + API routes
- `models/` Mongoose models
- `lib/` Helpers and constants
- `components/` UI components
- `public/` Logo + sponsor images

---

## Developer

Jafer Sathik B — 8428122334
