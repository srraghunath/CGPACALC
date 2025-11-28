/* ========================================
   GPA Calculator Logic - gpa.js
   ======================================== */

// Grade to GPA points mapping (EXACT as specified)
const GRADE_POINTS = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'D': 0,
    'E': 0,
    'F': 0,
    'Ab': 0
};

// Grades in order from best to worst
const GRADES = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'E', 'F', 'Ab'];

// State management
let gpaState = {
    subjects: []
};

// Load state on page load
document.addEventListener('DOMContentLoaded', function () {
    loadGPAState();
    renderSubjects();
    updateGPADisplay();

    // Event listeners
    document.getElementById('addSubjectBtn').addEventListener('click', addSubject);
});

/**
 * Load GPA state from localStorage
 */
function loadGPAState() {
    const saved = localStorage.getItem('gpaCalculatorState');
    if (saved) {
        try {
            gpaState = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading GPA state:', e);
        }
    }
}

/**
 * Save GPA state to localStorage
 */
function saveGPAState() {
    localStorage.setItem('gpaCalculatorState', JSON.stringify(gpaState));
}

/**
 * Add a new subject
 */
function addSubject() {
    const subject = {
        id: Date.now(),
        credit: '',
        grade: 'O'
    };
    gpaState.subjects.push(subject);
    saveGPAState();
    renderSubjects();
    updateGPADisplay();
}

/**
 * Delete a subject
 */
function deleteSubject(id) {
    gpaState.subjects = gpaState.subjects.filter(s => s.id !== id);
    saveGPAState();
    renderSubjects();
    updateGPADisplay();
}

/**
 * Update subject data
 */
function updateSubject(id, field, value) {
    const subject = gpaState.subjects.find(s => s.id === id);
    if (subject) {
        subject[field] = value;
        saveGPAState();
        updateGPADisplay();
    }
}

// Slider helper removed - using dropdown select now

/**
 * Render all subjects
 */
function renderSubjects() {
    const container = document.getElementById('subjectsContainer');
    
    if (gpaState.subjects.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No subjects added yet. Click "Add Subject" to get started!</p></div>';
        return;
    }

    container.innerHTML = gpaState.subjects.map((subject, index) => `
        <div class="subject-row" id="subject-${subject.id}">
            <div class="form-group">
                <label>Credit Hours</label>
                <input 
                    type="number" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value="${subject.credit}"
                    placeholder="e.g., 4"
                    data-id="${subject.id}"
                    class="credit-input"
                    onchange="updateSubject(${subject.id}, 'credit', this.value)"
                >
            </div>
            <div class="form-group">
                <label>Grade</label>
                <div class="grade-select-container">
                    <select 
                        class="grade-select"
                        onchange="updateSubject(${subject.id}, 'grade', this.value)"
                    >
                        ${GRADES.map(g => `<option value="${g}" ${g === subject.grade ? 'selected' : ''}>${g} (${GRADE_POINTS[g]} pts)</option>`).join('')}
                    </select>
                    <div class="grade-display">
                        <span class="grade-value">${subject.grade}</span>
                        <span class="grade-points">(${GRADE_POINTS[subject.grade]} pts)</span>
                    </div>
                </div>
            </div>
            <div class="form-group" style="justify-content: flex-end;">
                <button class="btn btn-delete" onclick="deleteSubject(${subject.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Calculate GPA
 * Formula: sum(credit × gradePoint) / sum(credit)
 */
function calculateGPA() {
    if (gpaState.subjects.length === 0) return 0;

    let totalCredits = 0;
    let totalPoints = 0;

    gpaState.subjects.forEach(subject => {
        const credit = parseFloat(subject.credit) || 0;
        const gradePoint = GRADE_POINTS[subject.grade] || 0;

        if (credit > 0) {
            totalCredits += credit;
            totalPoints += credit * gradePoint;
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
    gpaState.subjects.forEach(subject => {
        const credit = parseFloat(subject.credit) || 0;
        if (credit > 0) total += credit;
    });
    return total;
}

/**
 * Update GPA display
 */
function updateGPADisplay() {
    const gpa = calculateGPA();
    const resultBox = document.getElementById('gpaResult');
    
    // Update value
    resultBox.querySelector('.result-value').textContent = gpa;

    // Update status and color
    resultBox.classList.remove('status-good', 'status-okay', 'status-poor');
    
    let status = '';
    const gpaNum = parseFloat(gpa);
    
    if (gpaNum >= 8) {
        resultBox.classList.add('status-good');
        status = '🎉 Excellent Performance!';
    } else if (gpaNum >= 6) {
        resultBox.classList.add('status-okay');
        status = '👍 Good Performance';
    } else if (gpaNum > 0) {
        resultBox.classList.add('status-poor');
        status = '⚠️ Needs Improvement';
    } else {
        status = 'Add subjects to calculate';
    }

    resultBox.querySelector('.result-status').textContent = status;

    // Update stats
    document.getElementById('totalSubjects').textContent = gpaState.subjects.length;
    document.getElementById('totalCredits').textContent = calculateTotalCredits().toFixed(1);
}
