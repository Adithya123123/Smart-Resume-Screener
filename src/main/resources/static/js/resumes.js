/* ==========================================================================
   SMART RESUME SCREENER - RESUMES SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    const resumeSearchInput = document.getElementById("resumeSearchInput");
    const resumesTableBody = document.getElementById("resumesTableBody");

    let allResumes = [];

    async function loadResumes() {
        try {
            allResumes = await Api.getResumes();
            renderTable();
        } catch (err) {
            console.error("Resumes load error:", err);
            resumesTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--match-low);">Failed to load resumes.</td></tr>`;
        }
    }

    function renderTable() {
        const query = resumeSearchInput.value.toLowerCase().trim();
        let filtered = allResumes;

        if (query) {
            filtered = allResumes.filter(r =>
                (r.name && r.name.toLowerCase().includes(query)) ||
                (r.email && r.email.toLowerCase().includes(query)) ||
                (r.skills && r.skills.toLowerCase().includes(query)) ||
                (r.fileName && r.fileName.toLowerCase().includes(query))
            );
        }

        if (filtered.length === 0) {
            resumesTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No candidate resumes found.</td></tr>`;
            return;
        }

        resumesTableBody.innerHTML = filtered.map(r => `
            <tr>
                <td>
                    <strong>${r.name}</strong><br>
                    <small class="text-muted">${r.email || ''}</small><br>
                    <small class="text-muted">${r.phone || ''}</small>
                </td>
                <td>
                    <span style="font-size: 13px; font-weight: 500;">📄 ${r.fileName || 'resume.pdf'}</span>
                </td>
                <td>${renderSkills(r.skills)}</td>
                <td>${new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                    <a href="screening.html" class="btn btn-secondary btn-sm">Screen Candidate</a>
                </td>
            </tr>
        `).join('');
    }

    function renderSkills(skillsStr) {
        if (!skillsStr) return '<span class="text-muted">None</span>';
        const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
        return skills.slice(0, 4).map(s => `<span class="skill-tag matched">${s}</span>`).join(' ') +
            (skills.length > 4 ? ` <small class="text-muted">+${skills.length - 4} more</small>` : '');
    }

    resumeSearchInput.addEventListener("input", renderTable);

    await loadResumes();
});
