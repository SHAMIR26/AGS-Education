document.addEventListener('DOMContentLoaded', function() {
    // Students
    const sTbody = document.querySelector('#studentsTable tbody');
    const students = JSON.parse(localStorage.getItem('ags_students') || '[]');
    if (students.length === 0) {
        sTbody.innerHTML = `<tr><td colspan="5" style="color:#888;text-align:center;">No students found.</td></tr>`;
    } else {
        sTbody.innerHTML = students.map(s =>
            `<tr>
                <td>${s.name || ''}</td>
                <td>${s.email || ''}</td>
                <td>${s.mobile || ''}</td>
                <td>${s.password || ''}</td>
                <td>${(s.purchasedCourses || []).join(', ')}</td>
            </tr>`
        ).join('');
    }

    // Teachers
    const tTbody = document.querySelector('#teachersTable tbody');
    const teachers = JSON.parse(localStorage.getItem('ags_teachers') || '[]');
    if (teachers.length === 0) {
        tTbody.innerHTML = `<tr><td colspan="5" style="color:#888;text-align:center;">No teachers found.</td></tr>`;
    } else {
        // Get launched courses for each teacher
        const allCourses = JSON.parse(localStorage.getItem('ags_courses') || '[]');
        tTbody.innerHTML = teachers.map(t => {
            const launched = allCourses.filter(c => c.launchedBy === t.email).map(c => c.title).join(', ');
            return `<tr>
                <td>${t.name || ''}</td>
                <td>${t.email || ''}</td>
                <td>${t.mobile || ''}</td>
                <td>${t.password || ''}</td>
                <td>${launched}</td>
            </tr>`;
        }).join('');
    }

    // All Launched Courses
    const cTbody = document.querySelector('#coursesTable tbody');
    const courses = JSON.parse(localStorage.getItem('ags_courses') || '[]');
    if (courses.length === 0) {
        cTbody.innerHTML = `<tr><td colspan="4" style="color:#888;text-align:center;">No courses launched yet.</td></tr>`;
    } else {
        cTbody.innerHTML = courses.map(c =>
            `<tr>
                <td>${c.title || ''}</td>
                <td>${c.teacherName || ''}</td>
                <td>${c.prize || ''} BDT</td>
                <td>
                    <button onclick="playCourse('${encodeURIComponent(c.title)}')">Play</button>
                    <!-- <button onclick="editCourse('${encodeURIComponent(c.title)}')">Edit</button> -->
                </td>
            </tr>`
        ).join('');
    }

    // Play course handler
    window.playCourse = function(title) {
        window.location.href = `video.html?title=${title}&admin=1`;
    }

    // Optionally, implement editCourse if needed
    // window.editCourse = function(title) { ... }
});