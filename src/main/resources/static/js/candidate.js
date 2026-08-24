/* ==========================================================================
   SMART RESUME SCREENER - CANDIDATE SCORECARD SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get("id");

    if (!resultId) {
        alert("No candidate result specified.");
        window.location.href = "results.html";
        return;
    }

    try {
        const result = await Api.getResultById(resultId);
        const resume = await Api.getResumeById(result.resumeId);

        // Header Metadata
        document.getElementById("candName").textContent = result.candidateName || resume.name;
        document.getElementById("candJobTitle").textContent = result.jobTitle || "Job #" + result.jobId;
        document.getElementById("candEmail").textContent = result.candidateEmail || resume.email;
        document.getElementById("candPhone").textContent = result.candidatePhone || resume.phone;

        // Score & Status
        const score = result.score || 0;
        document.getElementById("scoreDisplay").textContent = `${score.toFixed(1)} / 10`;

        const statusBadge = document.getElementById("statusBadge");
        if (score >= 8.0) {
            statusBadge.className = "score-badge strong";
            statusBadge.textContent = "Strong Match";
        } else if (score >= 6.0) {
            statusBadge.className = "score-badge good";
            statusBadge.textContent = "Good Match";
        } else {
            statusBadge.className = "score-badge weak";
            statusBadge.textContent = "Weak Match";
        }

        // AI Reasoning
        document.getElementById("aiReason").textContent = result.reason || "Evaluation completed.";

        // Skills Matrix
        renderSkills("matchingSkillsBox", result.matchingSkills, "matched");
        renderSkills("missingSkillsBox", result.missingSkills, "missing");

        // Checks
        const expCheck = document.getElementById("expCheckBadge");
        expCheck.className = result.experienceMatch ? "score-badge strong" : "score-badge weak";
        expCheck.textContent = result.experienceMatch ? "✓ Matched" : "✗ Gap Found";

        const eduCheck = document.getElementById("eduCheckBadge");
        eduCheck.className = result.educationMatch ? "score-badge strong" : "score-badge weak";
        eduCheck.textContent = result.educationMatch ? "✓ Matched" : "✗ Gap Found";

        // Extracted Resume Details
        document.getElementById("extractedDetailsBox").innerHTML = `
            <div style="margin-bottom: 8px;"><strong>File Name:</strong> ${resume.fileName || 'N/A'}</div>
            <div style="margin-bottom: 8px;"><strong>Extracted Skills:</strong> ${resume.skills || 'N/A'}</div>
            <div style="margin-bottom: 8px;"><strong>Experience:</strong> ${resume.experience || 'N/A'}</div>
            <div><strong>Education:</strong> ${resume.education || 'N/A'}</div>
        `;

        // Shortlist Button Toggle
        const shortlistBtn = document.getElementById("shortlistBtn");
        shortlistBtn.addEventListener("click", () => {
            if (shortlistBtn.textContent.includes("Shortlisted")) {
                shortlistBtn.textContent = "★ Shortlist Candidate";
                shortlistBtn.className = "btn btn-primary btn-sm";
            } else {
                shortlistBtn.textContent = "✓ Shortlisted!";
                shortlistBtn.className = "btn btn-secondary btn-sm";
            }
        });

    } catch (err) {
        console.error("Candidate load error:", err);
        alert("Failed to load candidate details.");
    }

    function renderSkills(containerId, skillsStr, type) {
        const container = document.getElementById(containerId);
        if (!skillsStr || skillsStr.trim() === "") {
            container.innerHTML = `<span class="text-muted">None specified</span>`;
            return;
        }
        const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
        if (skills.length === 0) {
            container.innerHTML = `<span class="text-muted">None specified</span>`;
            return;
        }
        container.innerHTML = skills.map(s => `<span class="skill-tag ${type}">${s}</span>`).join(' ');
    }
});
