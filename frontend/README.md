# ODOT Frontend

Modern React frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling
- **next-themes** for dark/light mode
- **Axios** for API calls


## 🎨 Features

- ✅ Notion-inspired design with dark/light themes
- ✅ JWT authentication with protected routes
- ✅ Todo CRUD operations with real-time stats
- ✅ Admin panel for user management
- ✅ Responsive mobile-first design
- ✅ Ghost button styles with hover effects

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```env
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_TODO_SERVICE_URL=http://localhost:3002
```

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
```

## 🐳 Docker

```bash
docker build -t odot-frontend .
docker run -p 3000:3000 odot-frontend
```

---

Part of the ODOT todo application suite.
