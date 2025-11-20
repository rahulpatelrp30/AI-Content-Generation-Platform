# 🛠️ Development Guide

Quick reference for common development tasks.

## 🚀 Starting the Application

### Start Everything (2 terminals needed)

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## 📦 Installation Commands

### First Time Setup
```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings

# Frontend
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Adding New Dependencies

**Backend (Python):**
```powershell
cd backend
.\venv\Scripts\activate
pip install package-name
pip freeze > requirements.txt
```

**Frontend (Node):**
```powershell
cd frontend
npm install package-name
```

## 🗄️ Database Commands

### Create Database
```powershell
# Start PostgreSQL
# Then run:
psql -U postgres
CREATE DATABASE ai_content_db;
\c ai_content_db
\dt  # List tables
\q   # Quit
```

### Reset Database (if needed)
```powershell
psql -U postgres
DROP DATABASE ai_content_db;
CREATE DATABASE ai_content_db;
\q
```

### Database Migrations (Alembic)
```powershell
cd backend
.\venv\Scripts\activate

# Initialize Alembic (only once)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🧪 Testing API Endpoints

### Using PowerShell (Invoke-RestMethod)

**Health Check:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET
```

**Register User:**
```powershell
$body = @{
    email = "test@example.com"
    password = "testpassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Login:**
```powershell
$body = @{
    email = "test@example.com"
    password = "testpassword123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$token = $response.access_token
Write-Host "Token: $token"
```

**Generate Content:**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    content_type = "social"
    tone = "casual"
    length = "short"
    product = "AI Resume Analyzer"
    audience = "recent CS graduates"
    extra_instructions = "Make it inspiring"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/generate" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"
```

**Get History:**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/history" `
    -Method GET `
    -Headers $headers
```

### Using cURL (if installed)

**Register:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🐛 Debugging

### Check Backend Logs
Backend logs appear in the terminal where you ran `python main.py`

### Check Frontend Logs
- Browser console (F12)
- Terminal where `npm run dev` is running

### Common Issues

**Port Already in Use:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Database Connection Error:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Ensure database exists

**Module Not Found:**
```powershell
# Backend
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## 📝 Code Quality

### Format Python Code
```powershell
cd backend
pip install black
black .
```

### Format TypeScript/React Code
```powershell
cd frontend
npm run lint
npx prettier --write .
```

## 🔄 Git Workflow

### Initial Commit
```powershell
git init
git add .
git commit -m "Initial commit: AI Content Generation Platform"
git branch -M main
git remote add origin https://github.com/yourusername/ai-content-platform.git
git push -u origin main
```

### Regular Workflow
```powershell
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add dashboard page"

# Push
git push
```

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test-related changes
- `chore:` Build/config changes

## 🚀 Production Build

### Frontend Production Build
```powershell
cd frontend
npm run build
npm start  # Run production server locally
```

### Backend Production
```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📊 Useful Commands

### Check Python Version
```powershell
python --version
```

### Check Node Version
```powershell
node --version
npm --version
```

### List Python Packages
```powershell
cd backend
.\venv\Scripts\activate
pip list
```

### List Node Packages
```powershell
cd frontend
npm list --depth=0
```

### Clean Install

**Backend:**
```powershell
cd backend
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend:**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Required
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db
SECRET_KEY=your-secret-key-min-32-chars
OPENAI_API_KEY=sk-your-key-here

# Optional
ANTHROPIC_API_KEY=sk-your-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 URLs Reference

- Frontend Dev: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- API Redoc: http://localhost:8000/redoc

## 🎯 Quick Tasks

### Add New API Endpoint
1. Create function in `backend/app/routers/*.py`
2. Add route decorator
3. Define request/response schemas in `schemas.py`
4. Test at http://localhost:8000/docs

### Add New Frontend Page
1. Create `frontend/app/pagename/page.tsx`
2. Add navigation link
3. Test at http://localhost:3000/pagename

### Add New Database Model
1. Define model in `backend/app/models.py`
2. Create migration: `alembic revision --autogenerate -m "add model"`
3. Apply: `alembic upgrade head`

---

## 💡 Pro Tips

1. **Use two terminals**: One for backend, one for frontend
2. **Check API docs**: http://localhost:8000/docs for testing
3. **Use browser DevTools**: F12 to debug frontend
4. **Save API token**: Store in variable for quick testing
5. **Version control often**: Commit after each feature
6. **Test endpoints first**: Before connecting frontend
7. **Read error messages**: They usually tell you what's wrong

---

**Happy Coding! 🚀**
