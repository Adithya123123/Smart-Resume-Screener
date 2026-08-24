/* ==========================================================================
   SMART RESUME SCREENER - API INTEGRATION MODULE
   ========================================================================== */

const API_BASE_URL = 'http://localhost:8080/api';

// Realistic Mock Data for Standalone UI Preview / Fallback
const MOCK_JOBS = [
    {
        id: 1,
        title: "Senior Java Backend Engineer",
        description: "We are seeking an experienced Java Backend Engineer with expertise in Spring Boot, MySQL, REST APIs, and Microservices.",
        requiredSkills: "Java, Spring Boot, MySQL, REST API, Microservices, Docker",
        createdAt: "2026-08-20T10:00:00"
    },
    {
        id: 2,
        title: "Full Stack Java Developer",
        description: "Looking for a full stack engineer skilled in Java, Spring Boot, MySQL, and modern JavaScript for web UI development.",
        requiredSkills: "Java, Spring Boot, MySQL, JavaScript, HTML, CSS",
        createdAt: "2026-08-22T14:30:00"
    }
];

const MOCK_RESUMES = [
    {
        id: 1,
        name: "Alex Morgan",
        email: "alex.morgan@gmail.com",
        phone: "+1 (555) 234-5678",
        skills: "Java, Spring Boot, MySQL, REST API, Microservices, Git, Maven",
        experience: "Senior Software Engineer - TechCorp (3 years)",
        education: "B.Tech in Computer Science - State University",
        fileName: "Alex_Morgan_Resume.pdf",
        createdAt: "2026-08-23T09:15:00"
    },
    {
        id: 2,
        name: "Sophia Chen",
        email: "sophia.chen@devmail.io",
        phone: "+1 (555) 876-5432",
        skills: "Java, Spring Data JPA, MySQL, JavaScript, HTML, CSS",
        experience: "Java Developer Intern - CodeWorks (1 year)",
        education: "B.S. Software Engineering - Tech Institute",
        fileName: "Sophia_Chen_Resume.pdf",
        createdAt: "2026-08-23T11:45:00"
    },
    {
        id: 3,
        name: "David Miller",
        email: "david.m@cybernet.org",
        phone: "+1 (555) 345-6789",
        skills: "Python, Django, PostgreSQL, HTML, CSS",
        experience: "Python Developer - WebLabs (2 years)",
        education: "B.Tech Information Technology",
        fileName: "David_Miller_Resume.pdf",
        createdAt: "2026-08-24T08:20:00"
    }
];

const MOCK_RESULTS = [
    {
        id: 1,
        resumeId: 1,
        jobId: 1,
        score: 9.2,
        matchingSkills: "Java, Spring Boot, MySQL, REST API, Microservices",
        missingSkills: "Docker",
        experienceMatch: true,
        educationMatch: true,
        reason: "Alex displays exceptional alignment with core backend requirements. He possesses 3 years of enterprise Java and Spring Boot experience.",
        candidateName: "Alex Morgan",
        candidateEmail: "alex.morgan@gmail.com",
        candidatePhone: "+1 (555) 234-5678",
        jobTitle: "Senior Java Backend Engineer",
        createdAt: "2026-08-24T10:00:00"
    },
    {
        id: 2,
        resumeId: 2,
        jobId: 1,
        score: 7.5,
        matchingSkills: "Java, Spring Boot, MySQL",
        missingSkills: "REST API, Microservices, Docker",
        experienceMatch: true,
        educationMatch: true,
        reason: "Sophia has solid foundational Java skills and Spring Boot knowledge from her internship, though she lacks senior microservices experience.",
        candidateName: "Sophia Chen",
        candidateEmail: "sophia.chen@devmail.io",
        candidatePhone: "+1 (555) 876-5432",
        jobTitle: "Senior Java Backend Engineer",
        createdAt: "2026-08-24T10:05:00"
    },
    {
        id: 3,
        resumeId: 3,
        jobId: 1,
        score: 4.1,
        matchingSkills: "MySQL, HTML, CSS",
        missingSkills: "Java, Spring Boot, REST API, Microservices, Docker",
        experienceMatch: false,
        educationMatch: true,
        reason: "David is primarily a Python developer. He lacks required Java and Spring Boot backend skills for this specific position.",
        candidateName: "David Miller",
        candidateEmail: "david.m@cybernet.org",
        candidatePhone: "+1 (555) 345-6789",
        jobTitle: "Senior Java Backend Engineer",
        createdAt: "2026-08-24T10:10:00"
    }
];

const Api = {
    // Jobs API
    async getJobs() {
        try {
            const res = await fetch(`${API_BASE_URL}/jobs`);
            if (!res.ok) throw new Error("Backend offline");
            return await res.json();
        } catch (err) {
            console.warn("Using mock jobs data (Backend offline)");
            return MOCK_JOBS;
        }
    },

    async getJobById(id) {
        try {
            const res = await fetch(`${API_BASE_URL}/jobs/${id}`);
            if (!res.ok) throw new Error("Job not found");
            return await res.json();
        } catch (err) {
            return MOCK_JOBS.find(j => j.id == id) || MOCK_JOBS[0];
        }
    },

    async createJob(jobData) {
        try {
            const res = await fetch(`${API_BASE_URL}/jobs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobData)
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create job");
            }
            return await res.json();
        } catch (err) {
            if (err.message !== "Failed to create job") {
                console.warn("Simulating job creation (Backend offline)");
                const newJob = { id: Date.now(), ...jobData, createdAt: new Date().toISOString() };
                MOCK_JOBS.unshift(newJob);
                return newJob;
            }
            throw err;
        }
    },

    // Resumes API
    async getResumes() {
        try {
            const res = await fetch(`${API_BASE_URL}/resumes`);
            if (!res.ok) throw new Error("Backend offline");
            return await res.json();
        } catch (err) {
            console.warn("Using mock resumes data (Backend offline)");
            return MOCK_RESUMES;
        }
    },

    async getResumeById(id) {
        try {
            const res = await fetch(`${API_BASE_URL}/resumes/${id}`);
            if (!res.ok) throw new Error("Resume not found");
            return await res.json();
        } catch (err) {
            return MOCK_RESUMES.find(r => r.id == id) || MOCK_RESUMES[0];
        }
    },

    async uploadResume(file) {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_BASE_URL}/resumes/upload`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to upload PDF");
            }
            return await res.json();
        } catch (err) {
            if (err.message.includes("Only PDF") || err.message.includes("empty")) {
                throw err;
            }
            console.warn("Simulating resume upload (Backend offline)");
            const name = file.name.replace(".pdf", "").replace("_", " ");
            const newResume = {
                id: Date.now(),
                name: name,
                email: name.toLowerCase().replace(" ", ".") + "@example.com",
                phone: "+1 (555) 999-0000",
                skills: "Java, Spring Boot, REST API, SQL",
                experience: "Software Engineer",
                education: "B.Tech Computer Science",
                fileName: file.name,
                createdAt: new Date().toISOString()
            };
            MOCK_RESUMES.unshift(newResume);
            return newResume;
        }
    },

    // Results / Screening API
    async screenResume(resumeId, jobId) {
        try {
            const res = await fetch(`${API_BASE_URL}/results/screen/${resumeId}/${jobId}`, {
                method: "POST"
            });
            if (!res.ok) throw new Error("Screening failed");
            return await res.json();
        } catch (err) {
            console.warn("Simulating LLM screening result (Backend offline)");
            const resume = MOCK_RESUMES.find(r => r.id == resumeId) || MOCK_RESUMES[0];
            const job = MOCK_JOBS.find(j => j.id == jobId) || MOCK_JOBS[0];
            const mockResult = {
                id: Date.now(),
                resumeId: resume.id,
                jobId: job.id,
                score: 8.5,
                matchingSkills: "Java, Spring Boot, MySQL",
                missingSkills: "Microservices, Docker",
                experienceMatch: true,
                educationMatch: true,
                reason: `The candidate ${resume.name} demonstrates strong alignment with ${job.title}. Key matching skills include Java and Spring Boot.`,
                candidateName: resume.name,
                candidateEmail: resume.email,
                candidatePhone: resume.phone,
                jobTitle: job.title,
                createdAt: new Date().toISOString()
            };
            MOCK_RESULTS.unshift(mockResult);
            return mockResult;
        }
    },

    async getResultsByJobId(jobId) {
        try {
            const res = await fetch(`${API_BASE_URL}/results/job/${jobId}`);
            if (!res.ok) throw new Error("Backend offline");
            return await res.json();
        } catch (err) {
            console.warn("Using mock results by job ID (Backend offline)");
            return MOCK_RESULTS.filter(r => r.jobId == jobId);
        }
    },

    async getResultById(id) {
        try {
            const res = await fetch(`${API_BASE_URL}/results/${id}`);
            if (!res.ok) throw new Error("Result not found");
            return await res.json();
        } catch (err) {
            return MOCK_RESULTS.find(r => r.id == id) || MOCK_RESULTS[0];
        }
    },

    async getAllResults() {
        try {
            const res = await fetch(`${API_BASE_URL}/results`);
            if (!res.ok) throw new Error("Backend offline");
            return await res.json();
        } catch (err) {
            return MOCK_RESULTS;
        }
    }
};
