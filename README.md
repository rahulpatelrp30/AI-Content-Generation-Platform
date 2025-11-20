# 🚀 AI Content Generation Platform

A full-stack web application that generates high-quality marketing content, blog posts, and social media captions using AI. Built with Next.js, FastAPI, PostgreSQL, and OpenAI/Claude APIs.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black)
![Tech Stack](https://img.shields.io/badge/FastAPI-0.115-green)
![Tech Stack](https://img.shields.io/badge/PostgreSQL-15-blue)
![Tech Stack](https://img.shields.io/badge/TypeScript-5-blue)
![Tech Stack](https://img.shields.io/badge/Python-3.11-yellow)

## ✨ Features

- **Multi-Format Content Generation**: Create blog posts, marketing emails, and social media content
- **Customizable Output**: Choose tone (formal, casual, funny, persuasive) and length (short, medium, long)
- **User Authentication**: Secure JWT-based authentication system
- **Content History**: Save and manage all your generated content
- **Real-time Generation**: Fast AI-powered content creation
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Copy & Regenerate**: Easy content management with one-click actions

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks

### Backend (FastAPI)
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: OpenAI GPT-4 & Anthropic Claude
- **Migrations**: Alembic

### Database Schema

```sql
users
├── id (PK)
├── email (unique)
├── password_hash
└── created_at

content_generations
├── id (PK)
├── user_id (FK)
├── content_type
├── tone
├── length
├── product
├── audience
├── extra_instructions
├── generated_content
├── model_used
└── created_at
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+
- OpenAI API key or Anthropic API key

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup PostgreSQL database**
```bash
# Create database
psql -U postgres
CREATE DATABASE ai_content_db;
\q
```

5. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/ai_content_db
SECRET_KEY=your-secret-key-change-this-in-production
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-your-anthropic-api-key  # Optional
```

6. **Run the backend server**
```bash
python main.py
```

Backend will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

4. **Run the development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Content Generation
- `POST /api/generate` - Generate new content (requires auth)
- `GET /api/history` - Get user's generation history (requires auth)
- `GET /api/history/{id}` - Get specific content by ID (requires auth)
- `DELETE /api/history/{id}` - Delete content (requires auth)

### Health Check
- `GET /health` - Check API status

## 🎯 Usage Example

### Generate Content Request
```json
POST /api/generate
Authorization: Bearer <jwt_token>

{
  "content_type": "social",
  "tone": "casual",
  "length": "short",
  "product": "AI Resume Analyzer",
  "audience": "recent CS graduates",
  "extra_instructions": "Make it inspiring and include a call-to-action"
}
```

### Response
```json
{
  "id": 123,
  "generated_content": "🚀 Struggling to stand out in the job market? ...",
  "model_used": "gpt-4o-mini",
  "created_at": "2025-11-19T12:00:00Z"
}
```

## 🛠️ Development Workflow

### Phase 1: ✅ Setup Complete
- [x] Next.js frontend with Tailwind CSS
- [x] FastAPI backend with PostgreSQL
- [x] Database models and schemas
- [x] Authentication system
- [x] AI service integration

### Phase 2: 🚧 In Progress
- [x] Landing page
- [x] Content generation form
- [ ] Auth pages (login/register)
- [ ] Dashboard page

### Phase 3: Planned
- [ ] Connect frontend to backend API
- [ ] Implement protected routes
- [ ] Add loading states and error handling

### Phase 4: Future Enhancements
- [ ] Dark mode
- [ ] Content templates
- [ ] Export to PDF/Markdown
- [ ] Rate limiting
- [ ] Redis caching
- [ ] Team collaboration features

## 📦 Project Structure

```
ai-content-generation-platform/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── content.py
│   │   │   └── health.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── ai_service.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── generate/
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   └── page.tsx
    ├── package.json
    └── tailwind.config.ts
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection via SQLAlchemy ORM
- CORS configuration for API security
- Environment-based configuration

## 🎨 UI Features

- Gradient backgrounds and modern design
- Responsive layout for all devices
- Loading states and animations
- Copy-to-clipboard functionality
- Form validation
- Error handling with user feedback

## 📝 Resume Bullet Points

```
AI Content Generation Platform | Personal Project
Next.js, FastAPI, PostgreSQL, OpenAI API, TailwindCSS, JWT Auth

• Built a full-stack web app that generates marketing copy, blog posts, and 
  social captions using GPT-based models with configurable tone, length, 
  and content type.

• Designed a FastAPI backend with JWT authentication, PostgreSQL persistence, 
  and RESTful endpoints for AI generation, content history, and user management.

• Implemented a responsive Next.js UI with TailwindCSS, featuring reusable 
  form components, loading states, error handling, and a dashboard to browse 
  and reuse past generations.

• Integrated OpenAI's API with prompt engineering and input validation to 
  produce consistent, on-brand content while maintaining secure API key 
  handling and environment-based configuration.
```

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Database (Supabase/Neon)
1. Create PostgreSQL database
2. Update DATABASE_URL in backend environment

## 🤝 Contributing

This is a personal portfolio project, but suggestions are welcome!

## 📄 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 👤 Author

**Rahul**
- Portfolio: [kaabil.engineer](https://kaabil.engineer)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- OpenAI for GPT API
- Anthropic for Claude API
- Next.js team for the amazing framework
- FastAPI for the high-performance backend framework

---

Built with ❤️ by Rahul | November 2025
