/* ==========================================================================
   SMART RESUME SCREENER - RESULTS SCREENING PAGE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const targetJobId = urlParams.get("jobId");

    const resultsSubHeader = document.getElementById("resultsSubHeader");
    const jobFilterSelect = document.getElementById("jobFilterSelect");
    const sortSelect = document.getElementById("sortSelect");
    const searchInput = document.getElementById("searchInput");
    const resultsTableBody = document.getElementById("resultsTableBody");
    const filterBtnGroup = document.getElementById("filterBtnGroup");

    let rawResults = [];
    let activeGradeFilter = "all";

    // Load available jobs into filter dropdown
    try {
        const jobs = await Api.getJobs();
        jobFilterSelect.innerHTML = `<option value="all">All Jobs</option>` +
            jobs.map(j => `<option value="${j.id}" ${targetJobId == j.id ? 'selected' : ''}>${j.title}</option>`).join('');
    } catch (e) {
        console.error(e);
    }

    // Initial Data Fetch
    async function loadData() {
        try {
            const selectedJob = jobFilterSelect.value;
            if (selectedJob && selectedJob !== "all") {
                rawResults = await Api.getResultsByJobId(selectedJob);
            } else {
                rawResults = await Api.getAllResults();
            }
            renderTable();
        } catch (err) {
            console.error("Results load error:", err);
            resultsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--match-low);">Error loading screening results.</td></tr>`;
        }
    }

    function renderTable() {
        let filtered = [...rawResults];

        // 1. Job Filter
        const selectedJob = jobFilterSelect.value;
        if (selectedJob && selectedJob !== "all") {
            filtered = filtered.filter(r => r.jobId == selectedJob);
        }

        // 2. Grade Filter
        if (activeGradeFilter === "strong") {
            filtered = filtered.filter(r => r.score >= 8.0);
        } else if (activeGradeFilter === "good") {
            filtered = filtered.filter(r => r.score >= 6.0 && r.score < 8.0);
        } else if (activeGradeFilter === "weak") {
            filtered = filtered.filter(r => r.score < 6.0);
        }

        // 3. Search Query Filter
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            filtered = filtered.filter(r => 
                (r.candidateName && r.candidateName.toLowerCase().includes(query)) ||
                (r.matchingSkills && r.matchingSkills.toLowerCase().includes(query)) ||
                (r.jobTitle && r.jobTitle.toLowerCase().includes(query))
            );
        }

        // 4. Sort Order
        const sortVal = sortSelect.value;
        if (sortVal === "score-desc") {
            filtered.sort((a, b) => b.score - a.score);
        } else if (sortVal === "score-asc") {
            filtered.sort((a, b) => a.score - b.score);
        } else if (sortVal === "name-asc") {
            filtered.sort((a, b) => (a.candidateName || '').localeCompare(b.candidateName || ''));
        }

        resultsSubHeader.textContent = `Showing ${filtered.length} candidate result(s).`;

        if (filtered.length === 0) {
            resultsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">No matching candidates found for this filter criteria.</td></tr>`;
            return;
        }

        resultsTableBody.innerHTML = filtered.map(r => {
            const scoreClass = r.score >= 8.0 ? 'strong' : (r.score >= 6.0 ? 'good' : 'weak');
            const statusLabel = r.score >= 8.0 ? 'Strong Match' : (r.score >= 6.0 ? 'Good Match' : 'Weak Match');

            return `
                <tr>
                    <td>
                        <strong>${r.candidateName || 'Candidate #' + r.resumeId}</strong><br>
                        <small class="text-muted">${r.candidateEmail || ''}</small><br>
                        <small style="color: var(--primary); font-size: 11px;">${r.jobTitle || 'Job #' + r.jobId}</small>
                    </td>
                    <td>
                        <span class="score-badge ${scoreClass}" style="font-size: 15px; padding: 6px 14px;">
                            ${r.score.toFixed(1)} / 10
                        </span>
                    </td>
                    <td>${renderTags(r.matchingSkills, 'matched')}</td>
                    <td>${renderTags(r.missingSkills, 'missing')}</td>
                    <td><span class="score-badge ${scoreClass}">${statusLabel}</span></td>
                    <td>
                        <a href="candidate.html?id=${r.id}" class="btn btn-secondary btn-sm">View Analysis</a>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderTags(str, type) {
        if (!str) return '<span class="text-muted">None</span>';
        const items = str.split(',').map(s => s.trim()).filter(Boolean);
        if (items.length === 0) return '<span class="text-muted">None</span>';
        return items.map(s => `<span class="skill-tag ${type}">${s}</span>`).join(' ');
    }

    // Filter Buttons Listener
    filterBtnGroup.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtnGroup.querySelectorAll("button").forEach(b => b.style.backgroundColor = "var(--surface)");
            btn.style.backgroundColor = "var(--primary-light)";
            activeGradeFilter = btn.dataset.filter;
            renderTable();
        });
    });

    jobFilterSelect.addEventListener("change", loadData);
    sortSelect.addEventListener("change", renderTable);
    searchInput.addEventListener("input", renderTable);

    await loadData();
});
