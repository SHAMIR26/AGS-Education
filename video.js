// Example: manage playlist/videos for a course
function showPlaylist(course) {
    // course = { title: "...", playlist: [...] }
    let html = `<h3>${course.title} Playlist</h3><ul>`;
    course.playlist.forEach((video, idx) => {
        html += `<li>${video} <button onclick="deleteVideo(${idx})">Delete Video</button></li>`;
    });
    html += "</ul>";
    document.body.innerHTML += html;
}
window.deleteVideo = function(idx) {
    if (!isAdmin) return;
    if (!confirm('Delete this video?')) return;
    course.playlist.splice(idx, 1);
    localStorage.setItem('ags_courses', JSON.stringify(allCourses));
    location.reload();
}