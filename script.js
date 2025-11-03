// --- File Manager Dummy Data (Shared State) ---
let uploadedFiles = [
    {
        id: '1a2b3c',
        name: '[Sample] One Fine Week S1E01.mp4',
        size: '150.5 MB',
        host: 'RPMShare',
        date: '2024-10-31',
        url: 'https://playlinkhub.rpmvid.com/#a1b2c3d4e5f6g7h8' // RPMShare URL format
    },
    {
        id: '4d5e6f',
        name: '[Sample] Two Weeks - Episode 02.mkv',
        size: '312.8 MB',
        host: 'Abyss',
        date: '2024-10-30',
        url: 'https://abyss.to/embed/x9y8z7a6b5c4d3e2'
    },
    {
        id: '7g8h9i',
        name: 'Movie Title HD.mov',
        size: '1.2 GB',
        host: 'StreamHG',
        date: '2024-10-29',
        url: 'https://streamhg.com/v/q9w8e7r6t5y4u3i2'
    },
];

// --- Core Navigation and Content Loading ---
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('contentArea');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    const loadPage = async (page) => {
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Page not found');
            const content = await response.text();
            contentArea.innerHTML = content;
            
            // Re-bind events after content load
            bindEvents(page);

        } catch (error) {
            contentArea.innerHTML = `<div class="message danger">Error loading ${page} content.</div>`;
            console.error('Page load error:', error);
        }
    };

    const navigate = (page) => {
        // Update active link
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        // Change URL hash (for back/forward)
        window.location.hash = page;

        loadPage(page);
    };

    // Initial load based on URL hash or default to dashboard
    const initialPage = window.location.hash.substring(1) || 'dashboard';
    navigate(initialPage);

    // Navigation click listener
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigate(page);
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Handle back/forward buttons
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.substring(1) || 'dashboard';
        navigate(page);
    });
});

// --- Event Binding Function (called after content loads) ---
function bindEvents(page) {
    if (page === 'url_upload') {
        document.getElementById('uploadForm').addEventListener('submit', handleUrlUpload);
    } else if (page === 'file_manager') {
        renderFileManagerTable();
        document.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.currentTarget.getAttribute('data-url');
                playVideo(url);
            });
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteFile(id);
            });
        });
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const link = e.currentTarget.getAttribute('data-link');
                copyLink(link, e.currentTarget);
            });
        });
    } else if (page === 'gd_upload') {
        document.getElementById('gdUploadForm').addEventListener('submit', handleGdUpload);
    }
}

// --- File Manager Functions ---
function renderFileManagerTable() {
    const tableBody = document.getElementById('fileTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear existing
    
    uploadedFiles.forEach(file => {
        const row = tableBody.insertRow();
        
        row.innerHTML = `
            <td>${file.name}</td>
            <td>${file.size}</td>
            <td>${file.host}</td>
            <td>${file.date}</td>
            <td>
                <button class="btn btn-play" data-url="${file.url}" title="Play in Player">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="btn btn-copy" data-link="${file.url}" title="Copy Link">
                    <i class="fas fa-copy"></i> Copy Link
                </button>
                <button class="btn btn-delete" data-id="${file.id}" title="Delete File">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    });
}

function playVideo(url) {
    if (url) {
        // Encode URL to pass safely as a query parameter
        const encodedUrl = encodeURIComponent(url);
        // Open the player in a new tab
        window.open(`player.html?video=${encodedUrl}`, '_blank');
    } else {
        alert('Error: Video URL is missing.');
    }
}

function deleteFile(id) {
    if (confirm(`Are you sure you want to delete file with ID: ${id}? (Simulation)`)) {
        uploadedFiles = uploadedFiles.filter(file => file.id !== id);
        renderFileManagerTable();
        alert(`File ${id} simulated deletion.`);
    }
}

function copyLink(link, buttonElement) {
    navigator.clipboard.writeText(link).then(() => {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
        buttonElement.classList.remove('btn-copy');
        buttonElement.classList.add('btn-success-feedback');
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.add('btn-copy');
            buttonElement.classList.remove('btn-success-feedback');
        }, 1500);
    }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy link.');
    });
}

// --- URL Upload Function ---
async function handleUrlUpload(e) {
    e.preventDefault();
    const urlInput = document.getElementById('videoUrlInput');
    const url = urlInput.value.trim();
    const resultsDiv = document.getElementById('uploadResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const messageDiv = document.getElementById('urlUploadMessage');

    if (!url) {
        messageDiv.className = 'message danger';
        messageDiv.textContent = 'Please paste a valid video URL.';
        messageDiv.style.display = 'block';
        return;
    }

    messageDiv.style.display = 'none';
    resultsDiv.style.display = 'block';
    resultsContainer.innerHTML = '<div style="text-align:center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Remote upload in progress...</div>';

    try {
        // Simulated API call to PHP backend
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=url_upload&video_url=${encodeURIComponent(url)}`
        });

        const data = await response.json();

        if (data.success) {
            resultsContainer.innerHTML = '';
            
            const newId = (Math.random() * 1000000).toFixed(0);
            const now = new Date().toISOString().split('T')[0];
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            
            const newFile = {
                id: newId,
                name: fileName.length > 50 ? fileName.substring(0, 47) + '...' : fileName,
                size: 'N/A (Remote)',
                host: 'MultiHost', // Use a generic host for the entry
                date: now,
                url: data.links.RPMShare // For simplicity, use one link for 'Play'
            };

            // Add new file to state (for File Manager)
            uploadedFiles.push(newFile);

            // Display results in the URL Upload panel
            ['RPMShare', 'Abyss', 'StreamHG'].forEach(host => {
                const link = data.links[host];
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <div class="host-name">${host}:</div>
                    <div class="generated-link" title="${link}">${link}</div>
                    <button class="btn btn-copy" data-link="${link}" onclick="copyLink('${link}', this)">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                `;
                resultsContainer.appendChild(resultItem);
            });

            messageDiv.className = 'message success';
            messageDiv.textContent = 'Remote upload successful! Links generated.';
            messageDiv.style.display = 'block';
            
            urlInput.value = ''; // Clear input
            
        } else {
            resultsContainer.innerHTML = '';
            messageDiv.className = 'message danger';
            messageDiv.textContent = data.message || 'Remote upload failed due to an unknown error.';
            messageDiv.style.display = 'block';
        }

    } catch (error) {
        resultsContainer.innerHTML = '';
        messageDiv.className = 'message danger';
        messageDiv.textContent = 'Network or API error during upload.';
        messageDiv.style.display = 'block';
        console.error('Upload Error:', error);
    }
}

// --- GD Upload Function (Simulated) ---
function handleGdUpload(e) {
    e.preventDefault();
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBarFill = document.getElementById('progressBarFill');
    const messageDiv = document.getElementById('gdUploadMessage');
    const fileInput = document.getElementById('localFileInput');
    const submitBtn = e.currentTarget.querySelector('.btn-submit');

    if (fileInput.files.length === 0) {
        messageDiv.className = 'message danger';
        messageDiv.textContent = 'Please select a file to upload.';
        messageDiv.style.display = 'block';
        return;
    }

    messageDiv.style.display = 'none';
    submitBtn.disabled = true;
    progressBarContainer.style.display = 'block';

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1; // Random increment
        if (progress > 100) progress = 100;

        progressBarFill.style.width = progress + '%';
        progressBarFill.textContent = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressBarContainer.style.display = 'none';
                progressBarFill.style.width = '0%';
                progressBarFill.textContent = '0%';
                
                messageDiv.className = 'message success';
                messageDiv.textContent = `File "${fileInput.files[0].name}" uploaded successfully to Google Drive! (Simulation)`;
                messageDiv.style.display = 'block';

                submitBtn.disabled = false;
                fileInput.value = ''; // Clear file input
            }, 500);
        }
    }, 300);
}
