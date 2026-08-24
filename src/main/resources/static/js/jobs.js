/* ==========================================================================
   SMART RESUME SCREENER - JOBS SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    const openCreateModalBtn = document.getElementById("openCreateModalBtn");
    const closeCreateModalBtn = document.getElementById("closeCreateModalBtn");
    const createJobCard = document.getElementById("createJobCard");
    const createJobForm = document.getElementById("createJobForm");
    const jobsTableBody = document.getElementById("jobsTableBody");

    openCreateModalBtn.addEventListener("click", () => {
        createJobCard.style.display = "block";
        createJobCard.scrollIntoView({ behavior: 'smooth' });
    });

    closeCreateModalBtn.addEventListener("click", () => {
        createJobCard.style.display = "none";
    });

    async function loadJobs() {
        try {
            const jobs = await Api.getJobs();
            if (jobs.length === 0) {
                jobsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No job positions created yet. Click "+ Create New Job" above.</td></tr>`;
                return;
            }

            jobsTableBody.innerHTML = jobs.map(j => `
                <tr>
                    <td>
                        <strong>${j.title}</strong><br>
                        <small class="text-muted" style="display: block; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${j.description}
                        </small>
                    </td>
                    <td>${renderSkills(j.requiredSkills)}</td>
                    <td>${new Date(j.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td>
                        <div class="flex gap-2">
                            <a href="screening.html?jobId=${j.id}" class="btn btn-primary btn-sm">Screen Candidates</a>
                            <a href="results.html?jobId=${j.id}" class="btn btn-secondary btn-sm">View Results</a>
                        </div>
                    </td>
                </tr>
            `).join('');

        } catch (err) {
            console.error("Jobs load error:", err);
            jobsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--match-low);">Failed to load jobs.</td></tr>`;
        }
    }

    createJobForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("jobTitleInput").value.trim();
        const requiredSkills = document.getElementById("jobSkillsInput").value.trim();
        const description = document.getElementById("jobDescInput").value.trim();

        if (!title || !description) {
            alert("Title and description are required.");
            return;
        }

        try {
            await Api.createJob({ title, requiredSkills, description });
            alert("Job created successfully!");
            createJobForm.reset();
            createJobCard.style.display = "none";
            await loadJobs();
        } catch (err) {
            alert("Error creating job: " + err.message);
        }
    });

    function renderSkills(skillsStr) {
        if (!skillsStr) return '<span class="text-muted">None</span>';
        const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
        return skills.slice(0, 4).map(s => `<span class="skill-tag matched">${s}</span>`).join(' ') +
            (skills.length > 4 ? ` <small class="text-muted">+${skills.length - 4} more</small>` : '');
    }

    await loadJobs();
});
