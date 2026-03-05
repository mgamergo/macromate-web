# 🥗 Macromate

**Macromate** is a personal health & fitness tracking web app built with Next.js. It helps you log your meals, track macros, monitor workouts, manage supplements, and visualize your progress — all in one place.

---

## ✨ Features

- **Macro & Calorie Tracking** — Log meals by type (breakfast, lunch, dinner, snacks) with detailed macro breakdowns (protein, carbs, fats, fiber, calories)
- **Workout Logging** — Record workout sessions with exercises, sets, reps, and weights
- **Step Counter** — Track your daily step count and compare against your goal
- **Water Intake** — Log daily water consumption
- **Weight Tracking** — Log your weight over time and view trend charts
- **Supplement Management** — Track supplements, dosages, stock levels, and intake status
- **7-Day Analytics Dashboard** — Visualize calorie intake, macro breakdowns, step counts, and weight trends with interactive charts
- **Smart Onboarding** — Set your goals, activity level, body stats, and get personalized daily targets (calories, macros, steps, water)
- **Authentication** — Secure sign-in/sign-up powered by Clerk

---

## 🛠️ Tech Stack

| Layer                | Technology                                                                  |
| -------------------- | --------------------------------------------------------------------------- |
| Framework            | [Next.js 15](https://nextjs.org/) (App Router)                              |
| Language             | TypeScript                                                                  |
| Database & Backend   | [Convex](https://convex.dev/) (real-time DB + serverless functions)         |
| Auth                 | [Clerk](https://clerk.com/)                                                 |
| UI Components        | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Styling              | [Tailwind CSS v4](https://tailwindcss.com/)                                 |
| Charts               | [Recharts](https://recharts.org/)                                           |
| Forms                | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)   |
| State Management     | [Zustand](https://zustand-demo.pmnd.rs/)                                    |
| Linting / Formatting | [Biome](https://biomejs.dev/)                                               |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Bun](https://bun.sh/) (recommended) or npm / pnpm / yarn
- A [Convex](https://convex.dev/) account
- A [Clerk](https://clerk.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/macromate-web.git
cd macromate-web
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

```env
# Convex
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Set up Convex

```bash
npx convex dev
```

This will push your schema and functions to Convex and start the local dev server for your backend.

### 5. Run the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
macromate-web/
├── convex/               # Convex backend (schema, queries, mutations)
│   ├── schema.ts         # Database schema
│   ├── meals.ts
│   ├── workouts.ts
│   ├── supplements.ts
│   ├── weightLogs.ts
│   ├── waterLogs.ts
│   ├── steps.ts
│   ├── stats.ts
│   └── users.ts
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Auth pages (sign-in, sign-up)
│   │   ├── (protected)/  # Protected pages (dashboard, stats)
│   │   ├── on-boarding/  # First-time user onboarding
│   │   └── profile/      # User profile page
│   ├── components/
│   │   ├── dashboard/    # Dashboard feature components (meals, workouts, charts)
│   │   ├── common/       # Shared layout components (navbar, providers)
│   │   ├── ui/           # shadcn/ui base components
│   │   └── user-details/ # Onboarding flow components
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React context providers
│   └── lib/              # Utilities and helpers
```

---

## 📜 Available Scripts

| Script       | Description                          |
| ------------ | ------------------------------------ |
| `bun dev`    | Start the Next.js development server |
| `bun build`  | Build the app for production         |
| `bun start`  | Start the production server          |
| `bun lint`   | Run Biome linter                     |
| `bun format` | Format code with Biome               |

---

## 📦 Deployment

This app is optimized for deployment on **Vercel**.

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

Make sure your Convex deployment is also set to production mode (`npx convex deploy`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
