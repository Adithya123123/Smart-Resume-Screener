/* ==========================================================================
   SMART RESUME SCREENER - DASHBOARD SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Setup Mobile Sidebar Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    try {
        const [resumes, jobs, results] = await Promise.all([
            Api.getResumes(),
            Api.getJobs(),
            Api.getAllResults()
        ]);

        // Update Statistics
        document.getElementById("statCandidates").textContent = resumes.length;
        document.getElementById("statJobs").textContent = jobs.length;
        document.getElementById("statScreened").textContent = results.length;

        if (results.length > 0) {
            const sum = results.reduce((acc, r) => acc + (r.score || 0), 0);
            const avg = (sum / results.length).toFixed(1);
            document.getElementById("statAvgScore").textContent = `${avg}/10`;
        } else {
            document.getElementById("statAvgScore").textContent = "N/A";
        }

        // Render Recent Table
        const recentTableBody = document.getElementById("recentTableBody");
        if (results.length === 0) {
            recentTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No screening activity yet. Upload resumes and screen candidates to populate statistics.</td></tr>`;
        } else {
            recentTableBody.innerHTML = results.slice(0, 5).map(res => {
                const scoreClass = res.score >= 8.0 ? 'strong' : (res.score >= 6.0 ? 'good' : 'weak');
                return `
                    <tr>
                        <td>
                            <strong>${res.candidateName || 'Candidate #' + res.resumeId}</strong><br>
                            <small class="text-muted">${res.candidateEmail || ''}</small>
                        </td>
                        <td>${res.jobTitle || 'Job #' + res.jobId}</td>
                        <td><span class="score-badge ${scoreClass}">${res.score.toFixed(1)} / 10</span></td>
                        <td>${renderSkillTags(res.matchingSkills)}</td>
                        <td><a href="candidate.html?id=${res.id}" class="btn btn-secondary btn-sm">View Match</a></td>
                    </tr>
                `;
            }).join('');
        }

        // Render Top Candidates Cards
        const topCandidatesGrid = document.getElementById("topCandidatesGrid");
        const sortedResults = [...results].sort((a, b) => b.score - a.score);
        if (sortedResults.length === 0) {
            topCandidatesGrid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No top candidates available yet.</div>`;
        } else {
            topCandidatesGrid.innerHTML = sortedResults.slice(0, 3).map(res => {
                const scoreClass = res.score >= 8.0 ? 'strong' : (res.score >= 6.0 ? 'good' : 'weak');
                return `
                    <div class="candidate-card">
                        <div>
                            <div class="candidate-card-header">
                                <div>
                                    <h3 style="font-size: 16px; font-weight: 700;">${res.candidateName}</h3>
                                    <span class="text-muted" style="font-size: 13px;">${res.jobTitle}</span>
                                </div>
                                <span class="score-badge ${scoreClass}">${res.score.toFixed(1)}</span>
                            </div>
                            <div style="margin: 12px 0;">
                                <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px;">MATCHING SKILLS:</div>
                                <div>${renderSkillTags(res.matchingSkills)}</div>
                            </div>
                        </div>
                        <a href="candidate.html?id=${res.id}" class="btn btn-secondary btn-sm mt-4" style="width: 100%;">View Full Profile</a>
                    </div>
                `;
            }).join('');
        }

    } catch (err) {
        console.error("Dashboard error:", err);
    }
});

function renderSkillTags(skillsStr) {
    if (!skillsStr) return '<span class="text-muted">None</span>';
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    return skills.slice(0, 3).map(s => `<span class="skill-tag matched">${s}</span>`).join(' ') +
        (skills.length > 3 ? ` <small class="text-muted">+${skills.length - 3} more</small>` : '');
}
