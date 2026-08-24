# Smart Resume Screener 📄🤖

Hi! Welcome to my **Smart Resume Screener** project. I built this full-stack application as a complete recruitment platform to help recruiters parse PDF resumes, evaluate candidates using AI, and rank applicants based on job requirements.

🌐 **Live Deployed Application**: [https://smart-resume-screener-1p4v.onrender.com/dashboard.html](https://smart-resume-screener-1p4v.onrender.com/dashboard.html)

---

## 🌟 About My Project

In recruitment, manually reviewing hundreds of resumes takes hours. I designed and built this Spring Boot application to solve that problem:

- **PDF Resume Upload**: Accepts candidate PDF resumes and extracts text using Apache PDFBox.
- **Candidate Extraction**: Automatically identifies candidate Name, Email, Phone, Skills, Experience, and Education.
- **AI Semantic Matching**: Evaluates candidate resumes against Job Descriptions using an LLM model, assigning a match score from **1.0 to 10.0** along with matching skills, missing skills, and detailed justification.
- **Candidate Ranking**: Shortlists and sorts applicants by match score descending so recruiters can find top talent instantly.
- **Recruiter Dashboard**: A clean web interface to manage jobs, screen candidates, and view scorecards.

---

## 🛠️ Tech Stack I Used

- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Apache PDFBox, Jackson
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 `fetch` API)
- **Database**: H2 Database (MySQL Mode) / MySQL Server
- **AI Integration**: LLM REST API Integration with heuristic fallback parser

---

## 🗄️ Database Details (`resume_screener`)

The project uses 3 main database tables managed via Spring Data JPA:

### 1. `resumes`
- `id` (BIGINT, Primary Key, Auto Increment)
- `name` (VARCHAR) — Candidate name extracted from PDF
- `email` (VARCHAR) — Candidate email address
- `phone` (VARCHAR) — Candidate contact phone number
- `skills` (TEXT) — Extracted candidate technical skills
- `experience` (TEXT) — Work experience summary
- `education` (TEXT) — Academic degrees and university details
- `file_name` (VARCHAR) — Original PDF file name
- `raw_text` (LONGTEXT) — Extracted raw plain text
- `created_at` (DATETIME) — Record creation timestamp

### 2. `jobs`
- `id` (BIGINT, Primary Key, Auto Increment)
- `title` (VARCHAR) — Job position title (e.g. Java Backend Developer)
- `description` (TEXT) — Detailed job responsibilities & requirements
- `required_skills` (TEXT) — Required technical skills
- `created_at` (DATETIME) — Record creation timestamp

### 3. `results`
- `id` (BIGINT, Primary Key, Auto Increment)
- `resume_id` (BIGINT) — Reference to candidate resume
- `job_id` (BIGINT) — Reference to target job position
- `score` (DOUBLE) — AI evaluation match score (1.0 to 10.0)
- `matching_skills` (TEXT) — List of matching candidate skills
- `missing_skills` (TEXT) — Required skills missing from candidate
- `experience_match` (BOOLEAN) — Experience qualification check
- `education_match` (BOOLEAN) — Education qualification check
- `reason` (TEXT) — Comprehensive AI screening justification
- `created_at` (DATETIME) — Record creation timestamp

---

## 📁 Project Structure

```
smart-resume-screener/
├── pom.xml
├── README.md
└── src/
    ├── main/
    │   ├── java/com/resumescreener/
    │   │   ├── ResumeScreenerApplication.java
    │   │   ├── controller/      # REST API Endpoints (Resume, Job, Result)
    │   │   ├── service/         # Business Logic (PdfService, LlmService, etc.)
    │   │   ├── entity/          # JPA Database Entities (Resume, Job, Result)
    │   │   ├── repository/      # Spring Data Repositories
    │   │   ├── dto/             # Data Transfer Objects
    │   │   └── exception/       # Global Exception Handler
    │   └── resources/
    │       ├── application.properties
    │       └── static/          # Web Dashboard UI (HTML, CSS, JS)
    └── test/                    # JUnit Test Suite
```

---

## 🚀 How to Run My Project

1. **Clone / Download** this repository.
2. **Start the Application**:
   Open terminal in project root and run:
   ```bash
   mvn spring-boot:run
   ```
3. **Open Dashboard**:
   Open your browser at:
   `http://localhost:8080/dashboard.html`

---

## 👨‍💻 Author

Built by **Adithya**
