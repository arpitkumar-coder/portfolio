# Personal Portfolio Website — PostgreSQL Edition

Full-stack portfolio built with:

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express.js
- Database: PostgreSQL
- PostgreSQL driver: `pg`
- Email: Nodemailer + SMTP
- Architecture: MVC / layered
- Security: Helmet, CORS, rate limiting, environment variables

## 1. Install prerequisites

Install:

- Node.js 18+ (20+ recommended)
- PostgreSQL 14+ recommended

Check Node:

```powershell
node -v
npm -v
```

Check PostgreSQL:

```powershell
psql --version
```

## 2. Create the PostgreSQL database

Open PostgreSQL / SQL Shell (`psql`) and run:

```sql
CREATE DATABASE portfolio_db;
```

Then connect to it:

```sql
\c portfolio_db
```

Run the project's schema:

```sql
\i 'FULL_PATH_TO_PROJECT\backend\sql\schema.sql'
```

For example, if the project is in `E:\personal-portfolio`:

```sql
\i 'E:/personal-portfolio/backend/sql/schema.sql'
```

### Alternative: PowerShell

From the project root:

```powershell
psql -U postgres -d portfolio_db -f backend\sql\schema.sql
```

Enter your PostgreSQL password when asked.

## 3. Configure `.env`

Copy:

```text
backend/.env.example
```

to:

```text
backend/.env
```

PowerShell:

```powershell
Copy-Item backend\.env.example backend\.env
```

Set your PostgreSQL password:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/portfolio_db
CLIENT_URL=http://localhost:5000
```

For example:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/portfolio_db
```

Do not commit `.env`.

## 4. Install dependencies

```powershell
cd backend
npm install
```

## 5. Run

Development:

```powershell
npm run dev
```

Production-style:

```powershell
npm start
```

Open:

http://localhost:5000

API health:

http://localhost:5000/api/health

Portfolio API:

http://localhost:5000/api/portfolio

## 6. Database structure

```text
profile
  |
skills
  |
projects ---- project_technologies
  |
contacts
```

The `contacts` table stores every contact-form submission.

Example:

```sql
SELECT * FROM contacts ORDER BY created_at DESC;
```

Edit your profile:

```sql
UPDATE profile
SET
  name = 'Your Real Name',
  role = 'Full-Stack Developer',
  bio = 'Your professional bio',
  email = 'you@example.com',
  location = 'Dehradun, India',
  github = 'https://github.com/yourusername',
  linkedin = 'https://linkedin.com/in/yourusername'
WHERE id = 1;
```

Add a skill:

```sql
INSERT INTO skills (name, category, level)
VALUES ('React', 'Frontend', 85);
```

Add a project:

```sql
INSERT INTO projects
(title, description, live_url, github_url, featured)
VALUES
('My Project', 'Project description',
 'https://example.com',
 'https://github.com/yourusername/project',
 true);
```

Then add technologies:

```sql
INSERT INTO project_technologies (project_id, technology)
VALUES
(2, 'React'),
(2, 'Node.js'),
(2, 'PostgreSQL');
```

## 7. API

### GET portfolio

```http
GET /api/portfolio
```

Response contains:

```json
{
  "success": true,
  "data": {
    "profile": {},
    "skills": [],
    "projects": []
  }
}
```

### POST contact

```http
POST /api/contact
Content-Type: application/json
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project inquiry",
  "message": "I would like to discuss a project."
}
```

## 8. Email

Configure Gmail SMTP using an App Password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_RECEIVER=your-email@gmail.com
```

The contact is saved to PostgreSQL first. If email fails, the API still returns success for the database submission and logs the email error.

## 9. PostgreSQL troubleshooting

If you see:

```text
password authentication failed for user "postgres"
```

check the password in `DATABASE_URL`.

If you see:

```text
database "portfolio_db" does not exist
```

create it:

```sql
CREATE DATABASE portfolio_db;
```

If you see:

```text
relation "contacts" does not exist
```

run:

```powershell
psql -U postgres -d portfolio_db -f backend\sql\schema.sql
```

If you see:

```text
ECONNREFUSED
```

make sure the PostgreSQL Windows service/server is running.

## 10. Production deployment

1. Create a production PostgreSQL database, such as on a managed PostgreSQL provider.
2. Set `DATABASE_URL` in the hosting provider's environment variables.
3. Set SMTP environment variables.
4. Set `CLIENT_URL` to your deployed domain.
5. Run the schema against the production database.
6. Deploy the Node.js application.
7. Use HTTPS.
8. Never upload `.env`.
9. Restrict production database access.
10. Test `/api/health`, `/api/portfolio`, and the contact form.

Express serves the frontend directly, so the frontend and API can be deployed as one Node.js service.
