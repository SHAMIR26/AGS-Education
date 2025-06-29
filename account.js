document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('userInfo');
    const user = JSON.parse(localStorage.getItem('ags_user') || 'null');
    if (!user) {
        infoDiv.innerHTML = `<div style="color:#888;text-align:center;">No user information available. Please log in.</div>`;
        return;
    }
    let html = `<label>Name:</label> ${user.name || ''}<br>`;
    html += `<label>Email:</label> ${user.email || ''}<br>`;
    html += `<label>Mobile:</label> ${user.mobile || ''}<br>`;
    html += `<label>Role:</label> ${user.role || ''}<br>`;
    infoDiv.innerHTML = html;

    const courseTitle = document.getElementById('courseTitle');
    const courseList = document.getElementById('courseList');
    const BASE_URL = window.location.origin.includes('localhost')
        ? 'http://localhost:3000'
        : window.location.origin;
    if (user.role === 'Student') {
        courseTitle.textContent = "Purchased Courses";
        // Fetch from backend
        fetch(`${BASE_URL}/api/mycourses?email=${encodeURIComponent(user.email)}&role=Student`)
            .then(res => res.json())
            .then(purchased => {
                if (!purchased.length) {
                    courseList.innerHTML = "<li>No courses purchased.</li>";
                } else {
                    courseList.innerHTML = purchased.map(c =>
                        `<li><a href="video.html?title=${encodeURIComponent(c)}" style="color:#2d3e50;text-decoration:underline;cursor:pointer;">${c}</a></li>`
                    ).join('');
                }
            });
    } else if (user.role === 'Teacher' || user.role === 'Admin') {
        courseTitle.textContent = "Launched Courses";
        fetch(`${BASE_URL}/api/mycourses?email=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role)}`)
            .then(res => res.json())
            .then(launched => {
                if (!launched.length) {
                    courseList.innerHTML = "<li>No courses launched.</li>";
                } else {
                    courseList.innerHTML = launched.map(c => `<li>${c.title}</li>`).join('');
                }
            });
    } else {
        courseTitle.textContent = "";
        courseList.innerHTML = "";
    }
});