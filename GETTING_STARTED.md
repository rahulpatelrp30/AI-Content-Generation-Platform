# ✅ Getting Started Checklist

Follow these steps in order to get your AI Content Generation Platform running!

## Prerequisites Installation

### 1. Install Required Software
- [ ] **Python 3.11+**: Download from [python.org](https://www.python.org/downloads/)
- [ ] **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- [ ] **PostgreSQL 15+**: Download from [postgresql.org](https://www.postgresql.org/download/)
- [ ] **Git**: Download from [git-scm.com](https://git-scm.com/downloads)

### 2. Get API Keys
- [ ] **OpenAI API Key**: 
  1. Visit [platform.openai.com](https://platform.openai.com/)
  2. Sign up or log in
  3. Go to API Keys section
  4. Create new key
  5. Copy and save it (you'll need it later)
  
- [ ] **Anthropic API Key** (Optional):
  1. Visit [console.anthropic.com](https://console.anthropic.com/)
  2. Sign up or log in
  3. Go to API Keys
  4. Create new key

---

## Database Setup

### 3. Create PostgreSQL Database
```powershell
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# In psql, run:
CREATE DATABASE ai_content_db;

# Verify it was created:
\l

# Exit psql:
\q
```

- [ ] Database created successfully
- [ ] Remember your PostgreSQL username (usually `postgres`)
- [ ] Remember your PostgreSQL password

---

## Backend Setup (FastAPI)

### 4. Setup Backend Environment

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

- [ ] Virtual environment created
- [ ] All packages installed without errors

### 5. Configure Backend Environment Variables

```powershell
# Copy example env file
cp .env.example .env

# Open .env in your editor
notepad .env
```

Edit the `.env` file with your actual values:

```env
# Database - Update with your PostgreSQL password
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/ai_content_db

# JWT Secret - Generate a random string (at least 32 characters)
SECRET_KEY=your-super-secret-key-change-this-to-something-random-and-long

# OpenAI - Paste your API key here
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Optional - Claude API key
ANTHROPIC_API_KEY=sk-your-anthropic-key-here

# Token expiration (24 hours = 1440 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

- [ ] DATABASE_URL updated with your PostgreSQL password
- [ ] SECRET_KEY changed to a random string
- [ ] OPENAI_API_KEY added
- [ ] File saved

### 6. Start Backend Server

```powershell
# Make sure you're in backend directory with venv activated
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
🚀 Starting AI Content Generation Platform API...
```

- [ ] Server started without errors
- [ ] Visit http://localhost:8000/health - should see: `{"status":"healthy",...}`
- [ ] Visit http://localhost:8000/docs - should see API documentation

**Keep this terminal open!**

---

## Frontend Setup (Next.js)

### 7. Setup Frontend (Open NEW Terminal)

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

- [ ] All packages installed without errors

### 8. Configure Frontend Environment

```powershell
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Verify it was created
cat .env.local
```

- [ ] .env.local file created
- [ ] Contains correct API URL

### 9. Start Frontend Server

```powershell
# Make sure you're in frontend directory
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

- [ ] Server started without errors
- [ ] No compilation errors

**Keep this terminal open too!**

---

## Verify Everything Works

### 10. Test the Application

Open your browser and visit these URLs:

#### Frontend Tests:
- [ ] **Landing Page**: http://localhost:3000
  - Should see beautiful gradient homepage
  - "AI Content Gen" logo visible
  - Features section displays
  
- [ ] **Generate Page**: http://localhost:3000/generate
  - Should see content generation form
  - Can fill in form fields
  - Can click "Generate Content" (will use mock data for now)

#### Backend Tests:
- [ ] **API Health**: http://localhost:8000/health
  - Should see: `{"status":"healthy",...}`
  
- [ ] **API Docs**: http://localhost:8000/docs
  - Should see interactive API documentation
  - Can see all endpoints listed

---

## Test the API (Optional but Recommended)

### 11. Create Test User

Open PowerShell (keep servers running):

```powershell
# Test registration
$body = @{
    email = "test@example.com"
    password = "testpass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

- [ ] User created successfully
- [ ] Received user response with ID and email

### 12. Test Login

```powershell
# Test login
$body = @{
    email = "test@example.com"
    password = "testpass123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Save token
$token = $response.access_token
Write-Host "Your token: $token"
```

- [ ] Login successful
- [ ] Received JWT token

### 13. Test Content Generation

```powershell
# Generate content
$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    content_type = "social"
    tone = "casual"
    length = "short"
    product = "AI Resume Analyzer"
    audience = "recent CS graduates"
    extra_instructions = "Make it inspiring with a call-to-action"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:8000/api/generate" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

Write-Host "`nGenerated Content:"
Write-Host $result.generated_content
```

- [ ] Content generated successfully
- [ ] Received AI-generated text
- [ ] Content saved to database

### 14. Check Generation History

```powershell
# Get history
$headers = @{
    "Authorization" = "Bearer $token"
}

$history = Invoke-RestMethod -Uri "http://localhost:8000/api/history" `
    -Method GET `
    -Headers $headers

Write-Host "`nTotal generations: $($history.Count)"
$history | Format-Table id, content_type, tone, created_at
```

- [ ] Retrieved history successfully
- [ ] Can see your test generation

---

## 🎉 Success!

If all checkboxes are checked, congratulations! Your AI Content Generation Platform is fully operational!

### What You Have Now:
✅ Working backend API with authentication
✅ AI content generation with OpenAI
✅ PostgreSQL database storing users and content
✅ Beautiful Next.js frontend
✅ All components communicating correctly

---

## 🚀 Next Steps

Now you can work on:

### Priority 1: Connect Frontend to Backend
1. Create `frontend/lib/api.ts` for API calls
2. Add authentication context
3. Connect generate page to real API
4. Add token storage

### Priority 2: Build Auth Pages
1. Create login page
2. Create register page
3. Add form validation
4. Implement redirects

### Priority 3: Build Dashboard
1. Create dashboard page
2. Display saved generations
3. Add view/delete functionality
4. Add filtering/search

### Priority 4: Polish & Deploy
1. Add loading states everywhere
2. Improve error handling
3. Add dark mode (optional)
4. Deploy to production

---

## 🆘 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (needs 3.11+)
- Check if port 8000 is available
- Verify .env file exists and has correct values
- Check PostgreSQL is running

### Frontend won't start
- Check Node version: `node --version` (needs 18+)
- Delete node_modules and reinstall: `rm -r node_modules; npm install`
- Check if port 3000 is available
- Verify .env.local exists

### Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database `ai_content_db` exists
- Verify password is correct

### API calls failing
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Verify CORS is configured (it should be by default)
- Check browser console for errors (F12)

---

## 📚 Documentation

- **Full Documentation**: `README.md`
- **Quick Reference**: `QUICKSTART.md`
- **Development Guide**: `DEV_GUIDE.md`
- **Project Summary**: `PROJECT_SUMMARY.md`

---

## 🎯 Remember

You're building a **portfolio project** - focus on:
1. Clean, readable code
2. Good git commit messages
3. Comprehensive documentation
4. Working features over perfect features

**Happy building! 🚀**

---

**Questions or Issues?**
- Check the DEV_GUIDE.md for common commands
- Visit http://localhost:8000/docs to test API
- Look at browser console (F12) for frontend errors
- Check terminal output for backend errors
