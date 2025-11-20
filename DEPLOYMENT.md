# Deployment Guide

This guide covers deploying the AI Content Generation Platform to production.

## Architecture
- **Frontend**: Vercel (Next.js hosting)
- **Backend**: Render (FastAPI hosting)
- **Database**: SQLite (or upgrade to PostgreSQL on Render)

---

## Backend Deployment (Render)

### 1. Prepare Backend
1. Go to [Render](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-content-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Instance Type**: Free

### 2. Add Environment Variables
In Render dashboard, add these environment variables:
```
DATABASE_URL=sqlite:///./ai_content.db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key (optional)
```

### 3. Get Backend URL
After deployment, copy your backend URL (e.g., `https://ai-content-api.onrender.com`)

---

## Frontend Deployment (Vercel)

### 1. Update API URL
Create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://ai-content-api.onrender.com
```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL

6. Click "Deploy"

---

## Alternative: Deploy Both to Render

You can also deploy both frontend and backend to Render:

### Backend (same as above)

### Frontend
1. Create new "Static Site" on Render
2. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build && npm run export`
   - **Publish Directory**: `frontend/out`
3. Add environment variable with backend URL

---

## Alternative: All-in-One with Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Add two services:
   - **Backend**: Auto-detected as Python
   - **Frontend**: Auto-detected as Node.js
4. Add environment variables
5. Connect services using Railway's internal networking

---

## Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.com/health`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Content generation works (with API key)
- [ ] Content history displays
- [ ] CORS settings allow frontend domain

---

## Upgrade to PostgreSQL (Optional)

For production, replace SQLite with PostgreSQL:

1. On Render, add a PostgreSQL database
2. Update `requirements.txt`:
```txt
psycopg2-binary==2.9.9
```

3. Update `DATABASE_URL` environment variable to PostgreSQL connection string

4. Update `backend/app/config.py` if needed for PostgreSQL-specific settings

---

## Troubleshooting

### Backend Issues
- Check Render logs in dashboard
- Verify all environment variables are set
- Ensure `main.py` starts uvicorn on `0.0.0.0:8000`

### Frontend Issues
- Check Vercel build logs
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for CORS errors

### CORS Errors
Add your Vercel domain to backend CORS origins in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
