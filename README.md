# Eco-Expert Recycling Site

## Firebase Real-Time Synchronization

This project is now set up with Firebase Firestore for real-time synchronization between admin changes and client views. This means that any changes made in the admin panel will be instantly visible to all users viewing the site.

### Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use an existing one)
   - Set up a Firestore database
   - Register a web app in your Firebase project

3. **Configure Environment Variables**

   - Copy the `.env.example` file to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and fill in your Firebase project details from the Firebase console
   - Keep the admin credentials as they are or update them if needed:
     ```
     NEXT_PUBLIC_ADMIN_EMAIL=ecoexpert@gmail.com
     NEXT_PUBLIC_ADMIN_PASSWORD=admin123
     ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
5. **Test Admin Access**
   - Navigate to `/auth/login`
   - Login with the admin credentials:
     - Email: `ecoexpert@gmail.com`
     - Password: `admin123`

### How It Works

1. **Admin Panel Updates:**

   - When you make changes in the admin panel (settings, content, media, users), they are:
     - Saved to local browser storage (for immediate local effect)
     - Sent to Firebase Firestore (for global synchronization)
     - Broadcast to other components via custom events (for immediate UI updates)

2. **Client-Side Updates:**

   - All client instances of the website connect to Firebase and listen for changes
   - When changes occur in Firestore, all clients automatically update
   - This happens without page refreshes, providing a seamless experience

3. **Offline Support:**
   - Firebase includes offline capabilities, so the site will continue to work offline
   - Changes made offline will sync when connection is restored

### Firestore Database Structure

The Firestore database uses two main collections:

- **settings**: Stores site-wide settings

  - `site`: Document containing all site settings (appearance, contact info, etc.)

- **content**: Stores website content
  - `main`: Document containing all pages, blog posts, and media

### Troubleshooting

If you encounter issues with the real-time updates:

1. Check the browser console for any Firebase errors
2. Verify your Firebase configuration in `.env.local`
3. Make sure your Firestore database rules allow read/write operations
4. Try refreshing the page if changes aren't appearing

### Security Considerations

For a production environment:

1. Update Firestore security rules to require authentication
2. Implement proper Firebase Authentication rather than hardcoded admin credentials
3. Set up Firebase Functions for server-side validation if needed

### Admin Credentials

The current admin credentials are:

- Email: `ecoexpert@gmail.com`
- Password: `admin123`

For production, you should change these and implement proper authentication.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
