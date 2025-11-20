# AI Content Generation Platform

Full-stack application for generating AI-powered marketing content, blog posts, and social media captions.

## Quick Links

- [Full Documentation](./README.md)
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && python main.py`

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, SQLAlchemy
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o-mini / Claude 3.5 Sonnet

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python main.py
```

### Frontend
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Visit: http://localhost:3000

## Features

✅ Generate marketing emails, blog posts, social media content
✅ Customizable tone & length
✅ User authentication (JWT)
✅ Save & manage content history
✅ Copy & regenerate functionality

## Next Steps

1. Get your OpenAI API key from https://platform.openai.com/api-keys
2. Create PostgreSQL database
3. Update .env files
4. Start building!
