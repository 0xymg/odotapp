# ODOT Frontend

A modern, Notion-inspired React frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes (dark/light mode)
- **API Client**: Axios
- **Notifications**: Sonner (toast notifications)
- **Fonts**: Geist Sans & Geist Mono

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel page
│   ├── dashboard/         # Main todo dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── DeleteConfirmDialog.tsx
│   └── ThemeToggle.tsx
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication state
│   └── ThemeContext.tsx  # Theme management
├── lib/                  # Utilities and API
│   ├── api.ts           # API client and endpoints
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    ├── auth.ts
    └── todo.ts
```

## 🎨 Features

### UI/UX
- ✅ Notion-inspired modern design
- ✅ Dark/light theme toggle with system preference detection
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations and transitions
- ✅ Ghost button styles with hover effects
- ✅ Light red text selection colors
- ✅ Clean, minimal interface

### Authentication
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Auto-redirect on login/logout
- ✅ Persistent auth state
- ✅ Role-based access (admin/user)

### Todo Management
- ✅ Create, read, update, delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Real-time todo statistics
- ✅ Empty state handling
- ✅ Input focus retention after actions

### Admin Features
- ✅ User management (view, delete, role change)
- ✅ Admin-only routes
- ✅ User statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_TODO_SERVICE_URL=http://localhost:3002
```

### Docker Development

```bash
# Build Docker image
docker build -t odot-frontend .

# Run container
docker run -p 3000:3000 odot-frontend
```

## 📝 API Integration

The frontend integrates with two backend services:

### User Service (Port 3001)
- Authentication endpoints
- User management
- Admin operations

### Todo Service (Port 3002)
- Todo CRUD operations
- Todo statistics
- User-specific todos

## 🎯 Key Components

### Pages
- **Landing Page** (`app/page.tsx`): Modern landing with features showcase
- **Dashboard** (`app/dashboard/page.tsx`): Main todo management interface
- **Login/Register** (`app/login/page.tsx`, `app/register/page.tsx`): Authentication forms
- **Admin Panel** (`app/admin/page.tsx`): User management for admins

### Contexts
- **AuthContext**: Manages authentication state, JWT tokens, and user data
- **ThemeContext**: Handles dark/light theme switching with next-themes

### Components
- **ThemeToggle**: Dark/light mode switcher
- **DeleteConfirmDialog**: Reusable confirmation dialog
- **UI Components**: shadcn/ui based components (Button, Card, Input, etc.)

## 🎨 Design System

### Colors
- **Primary**: Blue tones for main actions
- **Secondary**: Muted grays for supporting elements
- **Success**: Green for completed states
- **Destructive**: Red for delete actions
- **Selection**: Light red background with dark red text

### Typography
- **Headings**: Geist Sans with various weights
- **Body**: Geist Sans regular
- **Code**: Geist Mono

### Components
- **Buttons**: Ghost style with hover effects
- **Cards**: Notion-style with subtle borders
- **Inputs**: Clean with focus states
- **Themes**: Automatic dark/light mode detection

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Adapted layouts for medium screens
- **Desktop**: Full feature set with optimized layouts
- **Container**: Responsive max-widths with proper padding

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🐳 Docker

The frontend is containerized and can be run with Docker:

```dockerfile
# Multi-stage build for optimized production image
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (if configured)
- **Import organization**: Clean import structure

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t odot-frontend .
docker run -p 3000:3000 odot-frontend
```

### Environment Setup
Make sure to set the correct API URLs for your environment:
- Development: localhost:3001, localhost:3002
- Production: Your deployed backend URLs

## 🎯 Performance

- **Next.js 15**: Latest performance optimizations
- **Image Optimization**: Automatic with next/image
- **Font Optimization**: Automatic with next/font
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Where applicable

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test on both light and dark themes
5. Ensure mobile responsiveness

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
