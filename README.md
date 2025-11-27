# TinyLink

A modern, full‑stack URL shortening service inspired by Bit.ly — built with **Next.js 14 (App Router)**, **React**, **TailwindCSS**, and **PostgreSQL** (Neon/Supabase). TinyLink allows users to shorten URLs, track click statistics, and manage links through a clean, responsive interface.

---

## 🚀 Features

### **Core Functionality**

* Shorten long URLs with automatically generated codes
* Optional **custom short codes** (`[A-Za-z0-9]{6,8}`)
* **302 redirects** from `/:code`
* Click tracking

  * `total_clicks`
  * `last_clicked` timestamp
* Delete links (soft delete)
* Public stats page for each code: `/code/:code`

### **UI & UX Highlights**

* Clean & modern interface using **TailwindCSS**
* Clear layout hierarchy & spacing
* Loading, error, and success states throughout the UI
* Inline form validation
* Copy-to-clipboard buttons
* Responsive design (mobile‑first)
* Search & filter capabilities

### **Infra & Deployment**

* Deployment-ready for **Vercel**
* Database hosted on **Neon** or **Supabase**
* Serverless API routes via Next.js
* Health check endpoint at `/healthz`

---

## 🗂️ Project Structure

```
app/
  api/
    links/          # Create + list
    links/[code]/   # Stats + delete
  [code]/           # Redirect handler
  code/[code]/      # Stats page
  page.tsx          # Dashboard
components/
lib/
styles/
```

---

## 🧪 API Endpoints

Follow the spec used for autograding.

### **POST** `/api/links`

Create a shortened URL.

**Request body:**

```json
{
  "target_url": "https://example.com/page",
  "code": "custom12"   // optional
}
```

**Responses:**

* `201` Created
* `409` Conflict (duplicate code)
* `400` Invalid input

---

### **GET** `/api/links`

Retrieve all non-deleted links.

---

### **GET** `/api/links/:code`

Retrieve stats for a single link.

---

### **DELETE** `/api/links/:code`

Soft-delete a link.

---

### **GET** `/:code`

Perform redirect (302) and increment click stats.

---

### **GET** `/healthz`

Basic service health check.

Example:

```json
{ "ok": true, "version": "1.0" }
```

---

## 🗃️ Database Schema

```sql
CREATE TABLE links (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(8) NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_clicks BIGINT NOT NULL DEFAULT 0,
  last_clicked TIMESTAMPTZ NULL,
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);
```

---

## 🔧 Environment Variables

Create `.env` based on the example below:

```
DATABASE_URL="postgres://user:pass@host:5432/db"
BASE_URL="https://your-deployment-url.com"
APP_VERSION="1.0"
```

---

## 🧑‍💻 Local Development

```bash
npm install
npm run dev
```

Ensure your PostgreSQL instance is running and accessible.

---

## 🚢 Deployment (Vercel + Neon)

1. Push the project to GitHub
2. Import the repo into Vercel
3. Add environment variables in Vercel dashboard
4. Link Neon or Supabase database
5. Deploy
6. Verify routes:

   * `/`
   * `/code/:code`
   * `/healthz`
   * `/:code`

---

## 📹 Demo & Documentation

Your submission should include:

* Public deployed URL
* GitHub repository
* Video walkthrough of architecture + code
* ChatGPT transcript link

---

## 📄 License

MIT © 2025

---

If you'd like, I can also generate:

* Screenshots for your README
* Architecture diagram (ASCII or image)
* A polished video script for your final walkthrough

