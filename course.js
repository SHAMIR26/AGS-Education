document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('launchForm');
    const successMsg = document.getElementById('successMsg');
    const user = JSON.parse(localStorage.getItem('ags_user') || 'null');

    // Auto-fill teacher name and launchedBy fields
    if (user) {
        document.getElementById('teacherName').value = user.name || '';
        document.getElementById('launchedBy').value = user.email || '';
        document.getElementById('teacherName').readOnly = true;
        document.getElementById('launchedBy').readOnly = true;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const files = document.getElementById('videos').files;
        if (!files.length) {
            successMsg.style.color = "red";
            successMsg.textContent = "Please select at least one video file.";
            return;
        }

        // Read all videos as Data URLs
        const readers = [];
        for (let i = 0; i < files.length; i++) {
            readers.push(new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    resolve(evt.target.result); // Data URL
                };
                reader.onerror = reject;
                reader.readAsDataURL(files[i]);
            }));
        }

        Promise.all(readers).then(videoDataUrls => {
            // Save course to localStorage
            const course = {
                title: document.getElementById('title').value,
                desc: document.getElementById('desc').value,
                teacherName: user.name || '',
                launchedBy: user.email || '',
                prize: document.getElementById('prize').value,
                playlist: videoDataUrls // Array of Data URLs
            };
            let courses = JSON.parse(localStorage.getItem('ags_courses') || '[]');
            courses.push(course);
            localStorage.setItem('ags_courses', JSON.stringify(courses));
            successMsg.style.color = "green";
            successMsg.textContent = "Course launched and videos uploaded!";
            form.reset();
            // Re-fill teacher info after reset
            document.getElementById('teacherName').value = user.name || '';
            document.getElementById('launchedBy').value = user.email || '';
        }).catch(() => {
            successMsg.style.color = "red";
            successMsg.textContent = "Error reading video files.";
        });
    });
});