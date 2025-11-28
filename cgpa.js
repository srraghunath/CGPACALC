/* ========================================
   CGPA Calculator Logic - cgpa.js
   ======================================== */

// State management
let cgpaState = {
    semesters: []
};

// Load state on page load
document.addEventListener('DOMContentLoaded', function () {
    loadCGPAState();
    renderSemesters();
    updateCGPADisplay();

    // Event listeners
    document.getElementById('addSemesterBtn').addEventListener('click', addSemester);
});

/**
 * Load CGPA state from localStorage
 */
function loadCGPAState() {
    const saved = localStorage.getItem('cgpaCalculatorState');
    if (saved) {
        try {
            cgpaState = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading CGPA state:', e);
        }
    }
}

/**
 * Save CGPA state to localStorage
 */
function saveCGPAState() {
    localStorage.setItem('cgpaCalculatorState', JSON.stringify(cgpaState));
}

/**
 * Add a new semester
 */
function addSemester() {
    const semester = {
        id: Date.now(),
        credits: '',
        gpa: ''
    };
    cgpaState.semesters.push(semester);
    saveCGPAState();
    renderSemesters();
    updateCGPADisplay();
}

/**
 * Delete a semester
 */
function deleteSemester(id) {
    cgpaState.semesters = cgpaState.semesters.filter(s => s.id !== id);
    saveCGPAState();
    renderSemesters();
    updateCGPADisplay();
}

/**
 * Update semester value
 */
function updateSemester(id, field, value) {
    const semester = cgpaState.semesters.find(s => s.id === id);
    if (semester) {
        semester[field] = value;
        saveCGPAState();
        updateCGPADisplay();
    }
}

/**
 * Render all semesters
 */
function renderSemesters() {
    const container = document.getElementById('semestersContainer');
    
    if (cgpaState.semesters.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No semesters added yet. Click "Add Semester" to get started!</p></div>';
        return;
    }

    container.innerHTML = cgpaState.semesters.map((semester, index) => `
        <div class="semester-row" id="semester-${semester.id}">
            <div class="form-group">
                <label>Total Credits</label>
                <input 
                    type="number" 
                    min="0" 
                    max="200" 
                    step="0.5"
                    value="${semester.credits}"
                    placeholder="e.g., 24"
                    data-id="${semester.id}"
                    class="credits-input"
                    onchange="updateSemester(${semester.id}, 'credits', this.value)"
                >
            </div>
            <div class="form-group">
                <label>Semester GPA (0-10)</label>
                <input 
                    type="number" 
                    min="0" 
                    max="10" 
                    step="0.01"
                    value="${semester.gpa}"
                    placeholder="e.g., 8.50"
                    data-id="${semester.id}"
                    class="gpa-input"
                    onchange="updateSemester(${semester.id}, 'gpa', this.value)"
                >
            </div>
            <div class="form-group" style="justify-content: flex-end;">
                <button class="btn btn-delete" onclick="deleteSemester(${semester.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Calculate CGPA
 * Formula: sum(credits × GPA) / sum(credits)
 */
function calculateCGPA() {
    if (cgpaState.semesters.length === 0) return 0;

    let totalCredits = 0;
    let totalPoints = 0;

    cgpaState.semesters.forEach(semester => {
        const credits = parseFloat(semester.credits) || 0;
        const gpa = parseFloat(semester.gpa) || 0;

        if (credits > 0 && gpa > 0) {
            totalCredits += credits;
            totalPoints += credits * gpa;
        }
    });

    if (totalCredits === 0) return 0;
    return formatNumber(totalPoints / totalCredits);
}

/**
 * Calculate total credits
 */
function calculateTotalCredits() {
    let total = 0;
    cgpaState.semesters.forEach(semester => {
        const credits = parseFloat(semester.credits) || 0;
        if (credits > 0) total += credits;
    });
    return total;
}

/**
 * Update CGPA display
 */
function updateCGPADisplay() {
    const cgpa = calculateCGPA();
    const resultBox = document.getElementById('cgpaResult');
    
    // Update value
    resultBox.querySelector('.result-value').textContent = cgpa;

    // Update status and color
    resultBox.classList.remove('status-good', 'status-okay', 'status-poor');
    
    let status = '';
    const cgpaNum = parseFloat(cgpa);
    
    if (cgpaNum >= 8) {
        resultBox.classList.add('status-good');
        status = '🎉 Outstanding CGPA!';
    } else if (cgpaNum >= 6) {
        resultBox.classList.add('status-okay');
        status = '👍 Good CGPA';
    } else if (cgpaNum > 0) {
        resultBox.classList.add('status-poor');
        status = '⚠️ Needs Improvement';
    } else {
        status = 'Add semesters to calculate';
    }

    resultBox.querySelector('.result-status').textContent = status;

    // Update stats
    document.getElementById('totalSemesters').textContent = cgpaState.semesters.length;
    document.getElementById('totalCredits').textContent = calculateTotalCredits().toFixed(1);
}
