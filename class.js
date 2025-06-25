document.addEventListener('DOMContentLoaded', function() {
    const myCourses = document.getElementById('myCourses');
    const user = JSON.parse(localStorage.getItem('ags_user') || 'null');
    const allCourses = JSON.parse(localStorage.getItem('ags_courses') || '[]');

    if (!user || !user.role) {
        myCourses.innerHTML = `<li style="color:#888;text-align:center;">Please log in to see your courses.</li>`;
        return;
    }

    if (user.role === 'Student') {
        const purchased = user.purchasedCourses || [];
        if (purchased.length === 0) {
            myCourses.innerHTML = `<li style="color:#888;text-align:center;">No courses purchased.</li>`;
            return;
        }
        myCourses.innerHTML = purchased.map(title => {
            return `<li class="course-item">
                <a href="video.html?title=${encodeURIComponent(title)}" style="color:#2d3e50;text-decoration:underline;cursor:pointer;">${title}</a>
                <button onclick="joinCourse('${encodeURIComponent(title)}')">Join</button>
            </li>`;
        }).join('');
    } else if (user.role === 'Teacher' || user.role === 'Admin') {
        const launched = allCourses.filter(c => c.launchedBy === user.email);
        if (launched.length === 0) {
            myCourses.innerHTML = `<li style="color:#888;text-align:center;">No courses launched.</li>`;
            return;
        }
        myCourses.innerHTML = launched.map(c => {
            return `<li class="course-item">
                ${c.title}
                <button onclick="viewPlaylist('${encodeURIComponent(c.title)}')">View Playlist</button>
                <button onclick="addVideosToCourse('${encodeURIComponent(c.title)}')">Add Videos</button>
            </li>`;
        }).join('');
    }
});

// For teachers/admins: view playlist
function viewPlaylist(title) {
    window.location.href = `video.html?title=${title}`;
}

// For students: join course
function joinCourse(title) {
    window.location.href = `video.html?title=${title}`;
}