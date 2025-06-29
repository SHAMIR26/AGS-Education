document.addEventListener('DOMContentLoaded', function() {
    const courseSelect = document.getElementById('course');
    const feeInput = document.getElementById('fee');
    const form = document.getElementById('purchaseForm');
    const successMsg = document.getElementById('successMsg');
    const transactionIdInput = document.getElementById('transactionId');

    // Demo valid transaction IDs
    const validTransactionIds = ["TX123456", "TX654321", "TX111222"];

    const BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : window.location.origin;

    courseSelect.addEventListener('change', function() {
        const selected = courseSelect.options[courseSelect.selectedIndex];
        feeInput.value = selected.getAttribute('data-fee') || '';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!courseSelect.value) return;
        const txId = transactionIdInput.value.trim();
        const specialCode = document.getElementById('specialCode').value.trim();
        const SPECIAL_CODE = "CAMBRIDGEPHYSICS26";

        // Special code logic
        if (specialCode === SPECIAL_CODE) {
            let user = JSON.parse(localStorage.getItem('ags_user') || 'null');
            if (user && user.role === 'Student') {
                user.purchasedCourses = user.purchasedCourses || [];
                if (!user.purchasedCourses.includes(courseSelect.value)) {
                    user.purchasedCourses.push(courseSelect.value);
                    localStorage.setItem('ags_user', JSON.stringify(user));
                    // Also update in ags_students
                    let students = JSON.parse(localStorage.getItem('ags_students') || '[]');
                    let idx = students.findIndex(u => u.email === user.email);
                    if (idx !== -1) {
                        students[idx].purchasedCourses = user.purchasedCourses;
                        localStorage.setItem('ags_students', JSON.stringify(students));
                    }
                }
                // --- Add this: call backend to register purchase ---
                fetch(`${BASE_URL}/api/purchase`, {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ courseTitle: courseSelect.value, email: user.email })
                });
            }
            successMsg.style.color = "green";
            successMsg.textContent = "Special code applied! Course joined for free.";
            form.reset();
            feeInput.value = '';
            return;
        }

        if (!validTransactionIds.includes(txId)) {
            successMsg.style.color = "red";
            successMsg.textContent = "Invalid Transaction ID!";
            return;
        }

        // Save purchased course to user
        let user = JSON.parse(localStorage.getItem('ags_user') || 'null');
        if (user && user.role === 'Student') {
            user.purchasedCourses = user.purchasedCourses || [];
            if (!user.purchasedCourses.includes(courseSelect.value)) {
                user.purchasedCourses.push(courseSelect.value);
                localStorage.setItem('ags_user', JSON.stringify(user));
                // Also update in ags_students
                let students = JSON.parse(localStorage.getItem('ags_students') || '[]');
                let idx = students.findIndex(u => u.email === user.email);
                if (idx !== -1) {
                    students[idx].purchasedCourses = user.purchasedCourses;
                    localStorage.setItem('ags_students', JSON.stringify(students));
                }
                // --- Add this: call backend to register purchase ---
                fetch(`${BASE_URL}/api/purchase`, {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ courseTitle: courseSelect.value, email: user.email })
                });
            }
        }

        successMsg.style.color = "green";
        successMsg.textContent = "Course purchased successfully!";
        form.reset();
        feeInput.value = '';
    });
});