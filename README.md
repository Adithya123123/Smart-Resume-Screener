# Smart Resume Screener 📄🤖

An AI-powered recruitment SaaS application built with **Java 17, Spring Boot, MySQL, Apache PDFBox**, and **Vanilla HTML/CSS/JavaScript**.

This application allows recruiters to upload PDF resumes, parse structured candidate data (Name, Email, Phone, Skills, Experience, Education), define Job Descriptions, evaluate candidates using an LLM model (generating match scores from 1–10, matching skills, missing skills, and detailed AI reasoning), and view shortlisted candidates on a recruiter dashboard.

---

## 🌟 Key Features

- **PDF Resume Upload & Text Extraction**: Reads PDF resumes using Apache PDFBox.
- **Structured Candidate Data Extraction**: Identifies candidate Name, Email, Phone, Skills, Experience, and Education.
- **Job Description Management**: Create and manage job roles with required technical skills.
- **AI Semantic Matching & Scoring**: Evaluates candidate resumes against job descriptions via LLM API, outputting a match score from **1.0 to 10.0**, matching skills, missing skills, and detailed text justification.
- **Candidate Ranking & Shortlisting**: Ranks applicants by match score descending (`GET /api/results/job/{jobId}`).
- **Modern Recruiter Dashboard UI**: Clean dashboard displaying statistics, recent screening logs, top candidates, and interactive scorecard analysis.
- **Student-Friendly Monolithic Architecture**: Simple, un-overengineered 3-tier structure (Controller -> Service -> Repository) designed for easy code walkthroughs in interviews.

---

## 🛠️ Technology Stack

### Backend
- **Java 17 / 21**
- **Spring Boot 3.2**
- **Spring Data JPA & Hibernate**
- **MySQL Database**
- **Apache PDFBox 3.0** (PDF Text Extraction)
- **Jackson** (JSON Processing)
- **Spring Boot Starter Validation**

### Frontend
- **HTML5, CSS3** (Custom Modern SaaS UI with Flexbox & CSS Grid)
- **Vanilla JavaScript** (ES6 `fetch()` API calls)
- *No heavy JS frameworks (No React/Angular/Vue required)*

### LLM AI Integration
- **OpenAI-Compatible REST API** (or fallback keyword heuristic mode for offline/eval execution)

---

## 🏛️ Application Architecture

```
                      +------------------------------------------+
                      |         Recruiter Dashboard UI           |
                      |   (HTML5 / CSS3 / Vanilla JavaScript)    |
                      +--------------------+---------------------+
                                           | HTTP REST API
                                           v
                      +--------------------+---------------------+
                      |           REST Controllers               |
                      | (ResumeController, JobController, etc.)  |
                      +--------------------+---------------------+
                                           |
                                           v
                      +--------------------+---------------------+
                      |            Service Layer                 |
                      | (ResumeService, JobService, ResultService) |
                      +----------+------------------+------------+
                                 |                  |
               +-----------------+                  +------------------+
               v                                                       v
   +-----------+-----------+                               +-----------+-----------+
   |       PdfService      |                               |       LlmService      |
   | (Apache PDFBox text)  |                               | (Candidate extraction &   |
   +-----------------------+                               |  screening score JSON)    |
                                                           +---------------------------+
                                           |
                                           v
                      +--------------------+---------------------+
                      |       Spring Data JPA Repositories       |
                      +--------------------+---------------------+
                                           |
                                           v
                      +--------------------+---------------------+
                      |            MySQL Database                |
                      |          (resume_screener DB)            |
                      +------------------------------------------+
```

---

## 📁 Package & File Structure

```
smart-resume-screener/
├── pom.xml
├── README.md
├── .gitignore
├── application-example.properties
└── src/
    ├── main/
    │   ├── java/com/resumescreener/
    │   │   ├── ResumeScreenerApplication.java
    │   │   ├── controller/
    │   │   │   ├── ResumeController.java
    │   │   │   ├── JobController.java
    │   │   │   └── ResultController.java
    │   │   ├── service/
    │   │   │   ├── ResumeService.java
    │   │   │   ├── JobService.java
    │   │   │   ├── ResultService.java
    │   │   │   ├── PdfService.java
    │   │   │   └── LlmService.java
    │   │   ├── entity/
    │   │   │   ├── Resume.java
    │   │   │   ├── Job.java
    │   │   │   └── Result.java
    │   │   ├── repository/
    │   │   │   ├── ResumeRepository.java
    │   │   │   ├── JobRepository.java
    │   │   │   └── ResultRepository.java
    │   │   ├── dto/
    │   │   │   ├── ResumeDto.java
    │   │   │   ├── JobDto.java
    │   │   │   └── ResultDto.java
    │   │   └── exception/
    │   │       └── GlobalExceptionHandler.java
    │   └── resources/
    │       ├── application.properties
    │       └── static/
    │           ├── index.html
    │           ├── dashboard.html
    │           ├── screening.html
    │           ├── results.html
    │           ├── candidate.html
    │           ├── jobs.html
    │           ├── resumes.html
    │           ├── css/
    │           │   ├── style.css
    │           │   └── responsive.css
    │           └── js/
    │               ├── api.js
    │               ├── dashboard.js
    │               ├── screening.js
    │               ├── results.js
    │               ├── candidate.js
    │               ├── jobs.js
    │               └── resumes.js
    └── test/
        └── java/com/resumescreener/
            ├── ResumeScreenerApplicationTests.java
            └── service/
                ├── PdfServiceTest.java
                └── LlmServiceTest.java
```

---

## 🗄️ Database Schema (`resume_screener`)

### 1. `resumes`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT PK AI | Resume unique identifier |
| `name` | VARCHAR | Candidate name extracted from resume |
| `email` | VARCHAR | Candidate email address |
| `phone` | VARCHAR | Candidate phone number |
| `skills` | TEXT | Comma-separated extracted skills |
| `experience` | TEXT | Extracted work experience summary |
| `education` | TEXT | Extracted education degrees |
| `file_name` | VARCHAR | Original PDF file name |
| `raw_text` | LONGTEXT | Raw extracted plain text |
| `created_at` | DATETIME | Record creation timestamp |

### 2. `jobs`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT PK AI | Job unique identifier |
| `title` | VARCHAR | Job title (e.g. Java Backend Developer) |
| `description` | TEXT | Detailed job description |
| `required_skills` | TEXT | Required technical skills |
| `created_at` | DATETIME | Record creation timestamp |

### 3. `results`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT PK AI | Screening result unique identifier |
| `resume_id` | BIGINT | Foreign key reference to candidate resume |
| `job_id` | BIGINT | Foreign key reference to target job position |
| `score` | DOUBLE | Match score (1.0 to 10.0) |
| `matching_skills` | TEXT | List of matching candidate skills |
| `missing_skills` | TEXT | Required skills missing from candidate |
| `experience_match` | BOOLEAN | Indicates whether experience requirement is met |
| `education_match` | BOOLEAN | Indicates whether education requirement is met |
| `reason` | TEXT | AI generated evaluation justification |
| `created_at` | DATETIME | Record creation timestamp |

---

## 📡 REST API Endpoints

### Resume APIs
- `POST /api/resumes/upload` — Upload PDF resume, extract text & save structured candidate info.
- `GET /api/resumes` — List all candidate resumes.
- `GET /api/resumes/{id}` — Fetch candidate resume by ID.

### Job APIs
- `POST /api/jobs` — Create a new job description.
- `GET /api/jobs` — List all job descriptions.
- `GET /api/jobs/{id}` — Fetch job details by ID.

### Screening & Result APIs
- `POST /api/results/screen/{resumeId}/{jobId}` — Perform LLM semantic match between resume and job description.
- `GET /api/results/{id}` — Fetch detailed screening result and scorecard.
- `GET /api/results/job/{jobId}` — Fetch all candidates screened for a job position, **sorted by score descending**.

---

## 🚀 Setup & Execution Guide

### Step 1: MySQL Setup
Open MySQL Workbench or MySQL CLI and run:

```sql
CREATE DATABASE IF NOT EXISTS resume_screener;
```

### Step 2: Configure Environment Variables
Copy `application-example.properties` or set standard environment variables:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_screener?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# LLM API Key (OpenAI or compatible endpoint)
LLM_API_KEY=your_openai_api_key
```

> **Note**: If `LLM_API_KEY` is not provided, the application automatically falls back to built-in keyword heuristic extraction & scoring so that it works seamlessly offline for demonstration!

### Step 3: Run Backend Application
Run Maven from terminal:

```bash
mvn spring-boot:run
```

Or execute the built `.jar` package:
```bash
mvn clean package
java -jar target/smart-resume-screener-1.0.0.jar
```

The Spring Boot server will start on `http://localhost:8080`.

### Step 4: Open Frontend Dashboard
Open your browser and navigate to:
```
http://localhost:8080/dashboard.html
```

---

## 🔄 Example Recruiter Workflow

1. **Open Dashboard**: View recruitment pipeline stats, active jobs, and top candidates.
2. **Create Job Position**: Navigate to **Jobs** -> Click `+ Create New Job` -> Enter Title: `"Java Backend Developer"`, Required Skills: `"Java, Spring Boot, MySQL, REST API"`.
3. **Upload Resumes**: Navigate to **Screen Candidates** -> Select job position -> Drag & drop candidate `.pdf` files.
4. **Trigger AI Screening**: Click `⚡ Start AI Screening Process`. PDFBox extracts raw text, LLM analyzes skills/experience alignment, and saves match score to MySQL.
5. **Review Scorecard & Shortlist**: Browse ranked results sorted by match score descending. Click any candidate to view AI justification, matching skills, and shortlist candidate.

---

## 🧪 Testing

Run automated unit tests:
```bash
mvn test
```

Includes unit tests for:
- `ResumeScreenerApplicationTests`: Context loading.
- `PdfServiceTest`: PDF text extraction via PDFBox.
- `LlmServiceTest`: Candidate information parsing and match scoring.

---

## 💡 Student Interview Explanation Guide

When presenting this project in an interview:
1. **Architecture**: Explain that the application uses a clean 3-tier architecture (**Controller -> Service -> Repository**).
2. **PDF Parsing**: Explain how `PdfService` utilizes Apache PDFBox's `PDFTextStripper` to read document streams safely.
3. **LLM Integration**: Explain that `LlmService` uses `RestTemplate` and `Jackson` to send structured prompts to an LLM REST API, parsing candidate JSON output while enforcing a fallback mechanism for resilience.
4. **Data Persistence**: Explain how Spring Data JPA maps entities (`Resume`, `Job`, `Result`) to MySQL tables and uses custom queries like `findByJobIdOrderByScoreDesc` for ranking candidates.
