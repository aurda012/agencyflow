<div align="center">
  <br />
    <img src="" alt="Project Banner">  
  <br />

  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="mysql" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="prisma" />
    <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="stripe" />
  </div>

  <h3 align="center">Saas Agency Management, CRM, Website Builder and Dashboard</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Assets & Code](#snippets)
6. 🚀 [More](#more)

## <a name="introduction">🤖 Introduction</a>

Built with the latest Next.js and TypeScript, this project creates a beautiful UI along with multiple complex features to help automate any agency and create an amazing experience for your clients.

Agency Owners can create sub accounts for their clients. They can connect their Stripe account using Stripe connect, add subaccounts for their clients, add, invite and manage their team members, and a dashboard to see all their live analytics.

Sub Accounts for clients have multiple features. They can add contacts as their own "clients". They can create multiple pipelines (kanbans) to manage their projects and whatever they can think of. They can create funnels and organize them for their products and create funnel websites using a drag and drop website editor which can publish live websites for these funnels they create along with easy connection to their stripe account. They can manage all their settings, upload media content using their own media page and see all their analytics on their own dashboard.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- Shadcn UI
- Tailwind CSS
- Clerk
- Stripe
- Upload Thing
- MySQL
- Prisma
- Webhooks
- React Hook Form
- Zod

## <a name="features">🔋 Features</a>

- 🤯 Multivendor B2B2B Saas
- 🏢 Agency and Sub accounts
- 🌐 Unlimited funnel hosting
- 🚀 Full Website & Funnel builder
- 💻 Role-based Access
- 🔄 Stripe Subscription plans
- 🛒 Stripe add-on products
- 🔐 Connect Stripe accounts for all users! - Stripe Connect
- 💳 Charge application fee per sale and recurring sales
- 💰 Custom Dashboards
- 📊 Media Storage
- 📈 Stripe Product Sync
- 📌 Custom checkouts on funnels
- 📢 Get leads from funnels
- 🎨 Khanban board
- 📂 Project management system
- 🔗 Notifications
- 📆 Funnel performance metrics
- 🧾 Agency and Sub Account metrics
- 🌙 Graphs and charts
- ☀️ Light & Dark mode
- 📄 Functioning landing page

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [Bun](https://bun.sh/)

**Cloning the Repository**

```bash
git clone https://github.com/aurda012/agencyflow.git
cd agencyflow
```

**Installation**

Install the project dependencies using Bun:

```bash
bun install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/agency/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/agency/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/agency
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/agency

# Change For Production
NEXT_PUBLIC_URL=http://localhost:3000/
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=http://

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_CLIENT_ID=
NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT=1
NEXT_PUBLIC_PLATFORM_ONETIME_FEE=2
NEXT_PUBLIC_PLATFORM_AGENY_PERCENT=1
NEXT_AGENCYFLOW_PRODUCT_ID=

# Update to your MySQL Database
DATABASE_URL=mysql://janedoe:mypassword@localhost:5432/mydb
```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up on [Clerk](https://clerk.com/), [Stripe](https://stripe.com/), [UploadThing](https://uploadthing.com/) and [Digital Ocean](https://www.digitalocean.com/products/managed-databases-mysql) for MySQL hosting.

**Running the Project**

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>app/globals.css</code></summary>

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  height: 100vh;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

@layer base {
  :root {
    --background: 216 100% 98.04%;
    --foreground: 213.6 100% 4.9%;

    --primary: 214.12 100% 50%;
    --primary-foreground: 0 0% 100%;

    --card: 216 100% 98.04%;
    --card-foreground: 213.6 100% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 213.6 100% 4.9%;

    --secondary: 214.74 100% 92.55%;
    --secondary-foreground: 216 100% 0.98%;

    --muted: 213.6 100% 95.1%;
    --muted-foreground: 0 0% 40%;

    --accent: 213.6 100% 95.1%;
    --accent-foreground: 214.12 100% 50%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 0 0% 90.2%;
    --input: 0 0% 90.2%;
    --ring: 214.12 100% 50%;

    --radius: 0.75rem;
  }

  .dark {
    --gradient: linear-gradient(to top left, #007adf, #00ecbc);

    --background: 220 65% 3.52%;
    --foreground: 220 10% 97.2%;

    --muted: 220 50% 13.2%;
    --muted-foreground: 220 10% 54.4%;

    --popover: 220 45% 5.72%;
    --popover-foreground: 220 10% 97.2%;

    --card: 220 45% 5.72%;
    --card-foreground: 220 10% 97.2%;

    --border: 240 3.7% 15.9%;
    --input: 220 50% 13.2%;

    --primary: 220 100% 44%;
    --primary-foreground: 220 10% 97.2%;

    --secondary: 220 50% 13.2%;
    --secondary-foreground: 220 10% 97.2%;

    --accent: 220 50% 13.2%;
    --accent-foreground: 220 10% 97.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --ring: 220 100% 44%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer utilities {
  .scrollbar-medium::-webkit-scrollbar {
    width: 6px;
  }
}

.dotPattern {
  background-image: radial-gradient(rgb(35, 40, 68) 1px, transparent 1px);
  background-size: 25px 25px;
}

.use-automation-zoom-in {
  animation: automation-zoom-in cubic-bezier(0.4, 0, 0.2, 1) 0.5s;
}

@keyframes automation-zoom-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

</details>

<details>
<summary><code>tailwind.config.ts</code></summary>

```typescript
import { withUt } from "uploadthing/tw";
import colors from "tailwindcss/colors";

module.exports = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
        "dark-tremor": {
          brand: {
            faint: "#0B1229",
            muted: colors.blue[950],
            subtle: colors.blue[800],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            inverted: colors.blue[950],
          },
          fontFamily: {
            sans: "var(--font-dm-sans)",
            mono: "var(--font-dm-mono)",
          },
          background: {
            muted: "#131A2B",
            subtle: colors.gray[800],
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
          },
          border: {
            DEFAULT: colors.gray[700],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
          content: {
            subtle: colors.gray[600],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            strong: colors.gray[50],
            inverted: colors.gray[950],
          },
        },
        boxShadow: {
          // light
          "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "tremor-card":
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "tremor-dropdown":
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          // dark
          "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "dark-tremor-card":
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          "dark-tremor-dropdown":
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
        borderRadius: {
          "tremor-small": "0.375rem",
          "tremor-default": "0.5rem",
          "tremor-full": "9999px",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "automation-zoom-in": {
          "0%": { transform: "translateY(-30px) scale(0.2)" },
          "100%": { transform: "transform: translateY(0px) scale(1)" },
        },
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "automation-zoom-in": "automation-zoom-in 0.5s",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
});
```

</details>

<details>
<summary><code>next.config.mjs</code></summary>

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "subdomain",
        port: "",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
```

</details>

<details>
<summary><code>middleware.ts</code></summary>

```typescript
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
  // Allow signed out users to access the specified routes:
  publicRoutes: ["/site", "/api/uploadthing"],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    //rewrite for domains
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
  },
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)",
  ],
};
```

</details>
