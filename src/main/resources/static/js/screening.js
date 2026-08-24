/* ==========================================================================
   SMART RESUME SCREENER - SCREENING WORKFLOW SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById("mobileToggle");
    const sidebar = document.getElementById("sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    const jobSelect = document.getElementById("jobSelect");
    const jobDetailsBox = document.getElementById("jobDetailsBox");
    const selectedJobTitle = document.getElementById("selectedJobTitle");
    const selectedJobSkills = document.getElementById("selectedJobSkills");
    const selectedJobDesc = document.getElementById("selectedJobDesc");

    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    const filesQueueContainer = document.getElementById("filesQueueContainer");
    const filesList = document.getElementById("filesList");
    const startScreeningBtn = document.getElementById("startScreeningBtn");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const loadingStatusText = document.getElementById("loadingStatusText");

    let stagedFiles = [];
    let loadedJobs = [];

    // Load available jobs into dropdown
    try {
        loadedJobs = await Api.getJobs();
        if (loadedJobs.length === 0) {
            jobSelect.innerHTML = `<option value="">No jobs found. Create a job position first.</option>`;
        } else {
            jobSelect.innerHTML = `<option value="">-- Choose Target Job Position --</option>` +
                loadedJobs.map(j => `<option value="${j.id}">${j.title}</option>`).join('');
        }
    } catch (err) {
        console.error("Failed to load jobs:", err);
    }

    jobSelect.addEventListener("change", () => {
        const jobId = jobSelect.value;
        const job = loadedJobs.find(j => j.id == jobId);
        if (job) {
            selectedJobTitle.textContent = job.title;
            selectedJobSkills.textContent = `Required Skills: ${job.requiredSkills || 'N/A'}`;
            selectedJobDesc.textContent = job.description;
            jobDetailsBox.style.display = "block";
        } else {
            jobDetailsBox.style.display = "none";
        }
    });

    // Handle Dropzone Events
    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    });

    fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleFiles(Array.from(fileInput.files));
        }
    });

    function handleFiles(files) {
        const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith(".pdf"));
        if (pdfFiles.length < files.length) {
            alert("Only PDF files are supported.");
        }
        pdfFiles.forEach(file => {
            if (!stagedFiles.some(f => f.name === file.name && f.size === file.size)) {
                stagedFiles.push(file);
            }
        });
        renderFilesList();
    }

    function renderFilesList() {
        if (stagedFiles.length === 0) {
            filesQueueContainer.style.display = "none";
            return;
        }
        filesQueueContainer.style.display = "block";
        filesList.innerHTML = stagedFiles.map((file, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); padding: 10px 14px; border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 18px;">📄</span>
                    <div>
                        <div style="font-weight: 600; font-size: 13px;">${file.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                </div>
                <button class="btn btn-secondary btn-sm" style="color: var(--match-low);" onclick="removeStagedFile(${idx})">Remove</button>
            </div>
        `).join('');
    }

    window.removeStagedFile = function(index) {
        stagedFiles.splice(index, 1);
        renderFilesList();
    };

    // Screening Execution
    startScreeningBtn.addEventListener("click", async () => {
        const jobId = jobSelect.value;
        if (!jobId) {
            alert("Please select a target job position first.");
            return;
        }
        if (stagedFiles.length === 0) {
            alert("Please upload at least one PDF resume.");
            return;
        }

        loadingOverlay.classList.add("active");

        try {
            for (let i = 0; i < stagedFiles.length; i++) {
                const file = stagedFiles[i];
                loadingStatusText.textContent = `[${i + 1}/${stagedFiles.length}] Uploading & analyzing ${file.name}...`;
                
                // 1. Upload PDF and extract info
                const uploadedResume = await Api.uploadResume(file);
                
                // 2. Perform screening match against job
                loadingStatusText.textContent = `[${i + 1}/${stagedFiles.length}] Evaluating candidate skills with LLM...`;
                await Api.screenResume(uploadedResume.id, jobId);
            }

            loadingStatusText.textContent = "Screening complete! Redirecting to results...";
            setTimeout(() => {
                window.location.href = `results.html?jobId=${jobId}`;
            }, 800);

        } catch (err) {
            alert("Screening failed: " + err.message);
            loadingOverlay.classList.remove("active");
        }
    });
});
