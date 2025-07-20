// Client-side JavaScript for HR Assessment App

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('button[type="submit"]');
    const fileInput = document.getElementById('resume');
    const uploadArea = document.querySelector('.upload-area');

    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Update upload area with file info
                updateUploadArea(file);
            }
        });
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e) {
            // Show loading state
            showLoadingState();
        });
    }

    // Drag and drop functionality
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.backgroundColor = '#f8f9fa';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = 'white';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = 'white';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                updateUploadArea(files[0]);
            }
        });
    }

    // Update upload area with file information
    function updateUploadArea(file) {
        const fileInfo = document.createElement('div');
        fileInfo.className = 'mt-2';
        fileInfo.innerHTML = `
            <small class="text-success">
                <i class="fas fa-check-circle"></i> ${file.name} (${formatFileSize(file.size)})
            </small>
        `;
        
        // Remove existing file info
        const existingInfo = uploadArea.querySelector('.mt-2');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        uploadArea.appendChild(fileInfo);
    }

    // Show loading state
    function showLoadingState() {
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Analyzing...';
            submitBtn.disabled = true;
            
            // Reset after a timeout (in case of error)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 30000);
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Smooth scroll to results
    function scrollToResults() {
        const results = document.querySelector('.card:last-child');
        if (results) {
            results.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Auto-scroll to results if they exist
    if (document.querySelector('.score-circle')) {
        setTimeout(scrollToResults, 500);
    }

    // Add animation to score circle
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        scoreCircle.style.opacity = '0';
        scoreCircle.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            scoreCircle.style.transition = 'all 0.5s ease';
            scoreCircle.style.opacity = '1';
            scoreCircle.style.transform = 'scale(1)';
        }, 100);
    }
}); 