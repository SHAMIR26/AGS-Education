const BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : window.location.origin;

document.addEventListener('DOMContentLoaded', async function() {
    // Fetch students and teachers from backend
    let users = [];
    try {
        const res = await fetch(`${BASE_URL}/api/users`);
        users = await res.json();
    } catch {
        // handle error
    }
    // Separate students and teachers
    const students = users.filter(u => u.role === 'Student');
    const teachers = users.filter(u => u.role === 'Teacher' || u.role === 'Admin');

    // Students
    const sTbody = document.querySelector('#studentsTable tbody');
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
    if (teachers.length === 0) {
        tTbody.innerHTML = `<tr><td colspan="5" style="color:#888;text-align:center;">No teachers found.</td></tr>`;
    } else {
        tTbody.innerHTML = teachers.map(t =>
            `<tr>
                <td>${t.name || ''}</td>
                <td>${t.email || ''}</td>
                <td>${t.mobile || ''}</td>
                <td>${t.password || ''}</td>
                <td></td>
            </tr>`
        ).join('');
    }

    // All Launched Courses
    const cTbody = document.querySelector('#coursesTable tbody');
    let courses = [];
    try {
        const res = await fetch(`${BASE_URL}/api/courses`);
        courses = await res.json();
    } catch {}
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
                </td>
            </tr>`
        ).join('');
    }

    window.playCourse = function(title) {
        window.location.href = `video.html?title=${title}&admin=1`;
    }
});