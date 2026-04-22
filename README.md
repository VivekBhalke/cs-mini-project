# Stored XSS Demonstration Blog

A cybersecurity educational project built to demonstrate **Stored Cross-Site Scripting (XSS)** vulnerabilities in modern web applications. This project simulates a professional blog platform where an attacker can inject malicious scripts into the database, which are then executed in the browsers of unsuspecting visitors.

---

## 🛡️ Educational Purpose
This project is an **intentionally vulnerable** application created for educational and demonstration purposes. It highlights the critical importance of input sanitization and output encoding. **Never use the patterns shown in this "vulnerable" version in a production environment.**

---

## 🔍 What is Stored XSS?
**Stored Cross-Site Scripting (XSS)**, also known as Persistent XSS, occurs when an application receives data from a user and stores it in a database without proper validation or escaping. 

Unlike *Reflected XSS* (where the script is part of a URL), Stored XSS is particularly dangerous because:
1.  **Persistence**: The malicious script lives in the database permanently.
2.  **Breadth**: Every user who views the affected page becomes a victim.
3.  **Passive Execution**: The victim does not need to click a suspicious link; simply visiting a legitimate page triggers the attack.

---

## 🏗️ Project Architecture

### Folder Structure
- `client/`: Next.js 15 Frontend (App Router, TypeScript, Tailwind CSS)
- `server/`: Express.js Backend (Node.js, Prisma ORM, PostgreSQL)

### Tech Stack
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, TypeScript | UI & Interactive Blog Pages |
| **Styling** | Tailwind CSS | Modern Glassmorphism Design |
| **Backend** | Node.js, Express.js | RESTful API for Comments |
| **Database** | PostgreSQL | Persistent Storage |
| **ORM** | Prisma | Database Management & Queries |

---

## 🛠️ Technical Implementation

### Database Schema (Prisma)
The `Comment` model stores user-submitted thoughts. Note that the `comment` field is used to store raw, unsanitized HTML/JavaScript.

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  blogId    String   // Identifies the blog post (slug)
  name      String   // Commenter's name
  comment   String   // Raw input (Vulnerable Field)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Endpoints
- **GET** `/api/comments?blogId={slug}`: Fetches all comments for a specific post.
- **POST** `/api/comment`: Accepts `{ blogId, name, comment }` and saves them directly to the database without sanitization.

---

## ☣️ The Vulnerability: How it Works

### 1. Unsanitized Storage
In `server/index.js`, the POST handler accepts the `comment` string exactly as the user typed it and saves it to PostgreSQL. No filtering of `<script>`, `<img>`, or `onerror` attributes is performed.

### 2. Dangerous Rendering
In `app/blog/[slug]/page.tsx`, the frontend renders comments using React's **`dangerouslySetInnerHTML`**:

```tsx
<div 
  dangerouslySetInnerHTML={{ __html: comment.comment }} 
/>
```
This tells React to bypass its built-in XSS protection and inject the raw string directly into the DOM as HTML.

### 🚀 Attack Payload
While `<script>` tags are often blocked by browsers when injected via `innerHTML`, attackers use event handlers like `onerror` to bypass this:
```html
<img src="x" onerror="alert('XSS Attacked!')">
```
The browser attempts to load the non-existent image "x", fails, and immediately executes the JavaScript in the `onerror` attribute.

---

## 🧪 Demo Flow
1.  **Preparation**: Open `http://localhost:3000`. Both blog posts ("Rise of AI" and "Art of Slow Living") are initially clean.
2.  **The Attack**: Open the "Rise of AI" post. Submit a comment with:
    - **Name**: `Attacker`
    - **Comment**: `<img src="x" onerror="alert('XSS Attacked!')">`
3.  **The Victim**: Open a different browser (or Incognito mode) and visit the same post.
4.  **Execution**: The alert box fires automatically upon page load. The victim's security is compromised without any interaction.
5.  **Isolation**: Visit the "Art of Slow Living" post. No alert fires, proving the attack is localized to the specific `blogId`.

---

## 🚀 How to Run locally

### Backend Setup
```bash
cd server
npm install
npx prisma migrate dev
node index.js
# Server runs on port 8000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend runs on port 3000
```

---

## ✅ The Fix
To prevent this attack, the frontend should **never** use `dangerouslySetInnerHTML` for user-generated content. Instead, render the text as a standard React child:

```diff
- <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
+ <div>{comment.comment}</div>
```

By using `{comment.comment}`, React automatically **escapes** the HTML. The payload `<img src=...>` will be displayed as literal text on the screen and will never execute as code.

---
*Created for Cyber Security Mini Project — 2026*
