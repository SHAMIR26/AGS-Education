const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files (HTML, JS, CSS) from project root
app.use(express.static(__dirname));

// In-memory data (replace with DB in production)
let students = []; // {name, email, mobile, password, role, purchasedCourses: []}
let teachers = []; // {name, email, mobile, password, role}
let courses = [];  // {title, desc, teacherName, launchedBy, prize, videos: [], students: []}

// Storage for uploaded videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use 'title' instead of 'courseTitle'
        const courseTitle = req.body.title;
        if (!courseTitle) return cb(new Error('Missing course title'), null);
        const courseDir = path.join(__dirname, 'uploads', courseTitle);
        fs.mkdirSync(courseDir, { recursive: true });
        cb(null, courseDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Registration endpoints
app.post('/api/register/student', (req, res) => {
    const { name, email, mobile, password } = req.body;
    if (students.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
    students.push({ name, email, mobile, password, role: 'Student', purchasedCourses: [] });
    res.json({ success: true });
});
app.post('/api/register/teacher', (req, res) => {
    const { name, email, mobile, password, role } = req.body;
    if (teachers.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
    teachers.push({ name, email, mobile, password, role });
    res.json({ success: true });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    let user = students.find(u => u.email === email && u.password === password);
    if (!user) user = teachers.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ ...user });
});

// Launch course (teacher/admin)
app.post('/api/course', upload.array('videos'), (req, res) => {
    const { title, desc, teacherName, launchedBy, prize } = req.body;
    if (courses.find(c => c.title === title)) return res.status(400).json({ error: 'Course already exists' });
    const videos = req.files.map(file => `/uploads/${title}/${file.filename}`);
    courses.push({ title, desc, teacherName, launchedBy, prize, videos, students: [] });
    res.json({ success: true });
});

// Add videos to existing course
app.post('/api/course/:title/videos', upload.array('videos'), (req, res) => {
    const { title } = req.params;
    const course = courses.find(c => c.title === title);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const videos = req.files.map(file => `/uploads/${title}/${file.filename}`);
    course.videos.push(...videos);
    res.json({ success: true, videos: course.videos });
});

// List all courses
app.get('/api/courses', (req, res) => {
    res.json(courses.map(c => ({
        title: c.title,
        desc: c.desc,
        teacherName: c.teacherName,
        launchedBy: c.launchedBy,
        prize: c.prize,
        videoCount: c.videos.length
    })));
});

// Get launched/purchased courses for a user
app.get('/api/mycourses', (req, res) => {
    const { email, role } = req.query;
    if (role === 'Student') {
        const student = students.find(u => u.email === email);
        if (!student) return res.json([]);
        res.json(student.purchasedCourses || []);
    } else if (role === 'Teacher' || role === 'Admin') {
        res.json(courses.filter(c => c.launchedBy === email));
    } else {
        res.json([]);
    }
});

// Purchase a course
app.post('/api/purchase', (req, res) => {
    const { courseTitle, email } = req.body;
    const course = courses.find(c => c.title === courseTitle);
    const student = students.find(u => u.email === email);
    if (!course || !student) return res.status(404).json({ error: 'Course or student not found' });
    if (!course.students.includes(email)) course.students.push(email);
    if (!student.purchasedCourses.includes(courseTitle)) student.purchasedCourses.push(courseTitle);
    res.json({ success: true });
});

// Get playlist for a course (only for purchased students or course owner)
app.get('/api/playlist/:courseTitle', (req, res) => {
    const { courseTitle } = req.params;
    const { email, role } = req.query;
    const course = courses.find(c => c.title === courseTitle);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (role === 'Teacher' || role === 'Admin') {
        if (course.launchedBy !== email) return res.status(403).json({ error: 'Not your course' });
        return res.json({ videos: course.videos });
    }
    if (!course.students.includes(email)) return res.status(403).json({ error: 'Not purchased' });
    res.json({ videos: course.videos });
});

// Delete a video from a course (teacher/admin only)
app.delete('/api/playlist/:courseTitle/:videoIdx', (req, res) => {
    const { courseTitle, videoIdx } = req.params;
    const { email } = req.body;
    const course = courses.find(c => c.title === courseTitle);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.launchedBy !== email) return res.status(403).json({ error: 'Not your course' });
    const idx = parseInt(videoIdx);
    if (isNaN(idx) || idx < 0 || idx >= course.videos.length) return res.status(400).json({ error: 'Invalid index' });
    // Optionally delete file from disk
    const filePath = path.join(__dirname, course.videos[idx]);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    course.videos.splice(idx, 1);
    res.json({ success: true, videos: course.videos });
});

// Get all users (for admin panel)
app.get('/api/users', (req, res) => {
    res.json([...students, ...teachers]);
});

// Serve uploaded videos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use process.env.PORT for Render, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});
