## Project Overview

This is a full-stack web application built using:

* Next.js (App Router)
* Node.js
* MongoDB (Mongoose)
* JWT Authentication
* SMTP Email (Nodemailer)
* Tailwind CSS

This is **NOT** a static website.
It requires a Node.js runtime environment.

---

## Current Deployment

The website is currently deployed and running at:

[https://yutira.vercel.app](https://yutira.vercel.app)

Deployment is production-ready and fully functional.

---

## Server Requirements (If Hosting Internally)

Minimum:

* Node.js 18 or higher
* npm
* Ability to configure environment variables
* Outbound internet access to:

  * MongoDB (Atlas or internal database)
  * SMTP server (port 465 or 587)

## Required Environment Variables

These must be configured in production:

APP_URL, MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, EMAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME

Important:

* Do NOT commit `.env` files to repository.
* Ensure `APP_URL` matches production domain.

---