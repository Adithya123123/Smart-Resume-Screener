# Smart Resume Screener 

Hi! Welcome to my **Smart Resume Screener** project. I built this full-stack application as a complete recruitment platform to help recruiters parse PDF resumes, evaluate candidates using AI, and rank applicants based on job requirements.

---

##  About My Project

In recruitment, manually reviewing hundreds of resumes takes hours. I designed and built this Spring Boot application to solve that problem:

- **PDF Resume Upload**: Accepts candidate PDF resumes and extracts text using Apache PDFBox.
- **Candidate Extraction**: Automatically identifies candidate Name, Email, Phone, Skills, Experience, and Education.
- **AI Semantic Matching**: Evaluates candidate resumes against Job Descriptions using an LLM model, assigning a match score from **1.0 to 10.0** along with matching skills, missing skills, and detailed justification.
- **Candidate Ranking**: Shortlists and sorts applicants by match score descending so recruiters can find top talent instantly.
- **Recruiter Dashboard**: A clean web interface to manage jobs, screen candidates, and view scorecards.

---

## Tech Stack I Used

- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Apache PDFBox, Jackson
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 `fetch` API)
- **Database**: MySQL / H2 Database
- **AI Integration**: LLM REST API Integration with heuristic fallback parser

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

## How to Run My Project

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

## Author

Built by **Adithya**
