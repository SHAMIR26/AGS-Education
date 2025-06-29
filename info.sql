-- Table for all users (students, teachers, admins)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'Student', 'Teacher', 'Admin'
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for student-specific info (purchased courses)
CREATE TABLE student_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table for courses (launched by teachers/admins)
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    teacher_name VARCHAR(100),
    launched_by VARCHAR(100), -- email of teacher/admin
    prize INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for course videos
CREATE TABLE course_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    video_url VARCHAR(300) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- View for admin to easily access all user info
CREATE VIEW admin_user_info AS
SELECT
    u.id,
    u.name,
    u.email,
    u.mobile,
    u.role,
    u.registered_at,
    GROUP_CONCAT(sc.course_title) AS purchased_courses
FROM users u
LEFT JOIN student_courses sc ON u.id = sc.user_id
GROUP BY u.id;

-- View for admin to see all courses and their videos
CREATE VIEW admin_course_info AS
SELECT
    c.id AS course_id,
    c.title,
    c.teacher_name,
    c.launched_by,
    c.prize,
    c.created_at,
    GROUP_CONCAT(cv.video_url) AS videos
FROM courses c
LEFT JOIN course_videos cv ON c.id = cv.course_id
GROUP BY c.id;