/* ========================================
   Main Shared Utilities - main.js
   ======================================== */

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    setupThemeToggle();
});

/**
 * Initialize theme based on localStorage or system preference
 */
function initializeTheme() {
    const saved = localStorage.getItem('theme');
    const html = document.documentElement;
    
    if (saved) {
        if (saved === 'dark') {
            html.classList.add('dark-mode');
            updateThemeIcon();
        }
    } else {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.classList.add('dark-mode');
            updateThemeIcon();
        }
    }
}

/**
 * Setup theme toggle button
 */
function setupThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

/**
 * Toggle between dark and light mode
 */
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark-mode');
    
    const isDark = html.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

/**
 * Update theme icon
 */
function updateThemeIcon() {
    const html = document.documentElement;
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        if (html.classList.contains('dark-mode')) {
            icon.textContent = '☀️';
        } else {
            icon.textContent = '🌙';
        }
    }
}

/**
 * Validate number input
 */
function validateNumber(value, min = 0, max = null) {
    const num = parseFloat(value);
    if (isNaN(num) || num < min) return false;
    if (max !== null && num > max) return false;
    return true;
}

/**
 * Format number to 2 decimal places
 */
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        font-weight: 600;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
