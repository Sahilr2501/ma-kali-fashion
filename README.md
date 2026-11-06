# MA Kali Fashion & Accessories

A simple Next.js store for clothing and fashion jewellery. Customers browse products, add items to a cart, and place orders. The server validates prices and stock, then emails the customer and the store owner. Orders are not saved in MongoDB.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- MongoDB with Mongoose for products and categories
- Nodemailer for order emails

## Setup

1. Copy `.env.example` to `.env.local` and fill in MongoDB, SMTP, admin, and session values.
2. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to the values you will use on `/admin/login`. Set `SESSION_SECRET` to a long random string.

3. Install and run:

```bash
npm install
npm run seed
npm run dev
```

The seed script replaces catalogue data with the starter categories and products.

## Environment

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Transactional email |
| `EMAIL_FROM` | Verified sender address |
| `ADMIN_EMAIL` | Inbox that receives new-order notifications |
| `ADMIN_USERNAME` | Admin sign-in name |
| `ADMIN_PASSWORD` | Admin sign-in password |
| `SESSION_SECRET` | Signs the admin session cookie |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_STORE_PHONE` | Footer and contact details |
| `NEXT_PUBLIC_STORE_EMAIL` | Public contact email |
| `NEXT_PUBLIC_STORE_ADDRESS` | Public address |
| `NEXT_PUBLIC_UPI_ID` | Shown for manual UPI payment |

Never commit `.env.local`.

## How orders work

Checkout recalculates prices from MongoDB. It does **not** create an order document.

- Both emails accepted: the customer sees a success message.
- Customer email fails, admin email succeeds: the store has the order, but the page does not claim that confirmation was emailed.
- Admin email fails: the customer is told the submission could not be fully confirmed and should contact the store.
- SMTP acceptance is not the same as inbox delivery.

Jewellery copy uses **gold-coloured coated** where that is accurate. Do not describe items as solid gold or gold-plated unless that is true.

## Admin

- Sign in at `/admin/login`
- Manage products and categories
- There is no order dashboard in version 1; keep admin order emails

## Deploy

Deploy the app on Vercel (or similar), set the same environment variables, use HTTPS, and send a real test order before launch.

On Vercel, open **Project → Settings → Environment Variables** and set these for **Production** (then **Redeploy**):

- `ADMIN_USERNAME` — same as local, for example `Ma_Kali_Admin`
- `ADMIN_PASSWORD` — the plain password (do not use `ADMIN_PASSWORD_HASH`)
- `SESSION_SECRET` — a long random string
- MongoDB, SMTP, and the other store variables from `.env`

Do not wrap the password in quotes in the Vercel dashboard. If the password contains a space, type the space as part of the value. Environment variables from `.env` are not uploaded automatically.

## Limitations of this version

- No customer accounts, payment gateway, or order history
- Stock is checked at checkout but not reserved, so overlapping orders can still conflict
- Image hosting is URL-based; Cloudinary or another host can be used by pasting image URLs
