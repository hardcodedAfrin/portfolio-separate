// seed.js - Populate database with initial portfolio data
const { db, initializeDatabase } = require('./database');

function seedDatabase() {
    console.log('🌱 Seeding database with initial data...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    db.exec('DELETE FROM portfolio_header');
    db.exec('DELETE FROM about_me');
    db.exec('DELETE FROM education');
    db.exec('DELETE FROM personal_info');
    db.exec('DELETE FROM skills');
    db.exec('DELETE FROM projects');
    db.exec('DELETE FROM certifications');
    db.exec('DELETE FROM languages');

    // Insert Portfolio Header
    const headerStmt = db.prepare(`
        INSERT INTO portfolio_header (name, title, email, phone, linkedin, github, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    headerStmt.run(
        'Afrin Jahan',
        'Student & Junior Web Developer',
        'afrindreamy456@gmail.com',
        '+8801753251416',
        'https://linkedin.com/in/afrin',
        'https://github.com/hardcodedAfrin',
        'about.jpg'
    );

    // Insert About Me
    const aboutStmt = db.prepare('INSERT INTO about_me (content) VALUES (?)');
    aboutStmt.run(`I am a passionate Computer Science student at Gopalganj Science and Technology University with a strong academic background. Currently pursuing my BSc in CSE with a CGPA of 3.89, I have consistently demonstrated excellence in my studies. My journey in technology began with a perfect GPA in both SSC and HSC examinations, and I continue to expand my knowledge in web development and programming.

As an aspiring web developer, I enjoy creating responsive, user-friendly websites and applications. I'm particularly interested in front-end development and UI/UX design, and I'm constantly learning new technologies to enhance my skill set.`);

    // Insert Education
    const educationStmt = db.prepare(`
        INSERT INTO education (degree, institution, year, result, display_order)
        VALUES (?, ?, ?, ?, ?)
    `);
    educationStmt.run('BSc in Computer Science & Engineering', 'Gopalganj Science and Technology University (GSTU), Bangladesh', '2022 - Present', 'Current CGPA: 3.89 (Last Year)', 1);
    educationStmt.run('Higher Secondary Certificate (HSC)', 'Gopalganj Government College', '2020', 'GPA: 5.00/5.00', 2);
    educationStmt.run('Secondary School Certificate (SSC)', 'Binapani Government Girls High School', '2018', 'GPA: 5.00/5.00', 3);

    // Insert Personal Information
    const personalInfoStmt = db.prepare(`
        INSERT INTO personal_info (field_name, field_value, display_order)
        VALUES (?, ?, ?)
    `);
    personalInfoStmt.run('Full Name', 'Afrin Jahan', 1);
    personalInfoStmt.run('Date of Birth', '25 July, 2002', 2);
    personalInfoStmt.run('Blood Group', 'B+ (Positive)', 3);
    personalInfoStmt.run('Nationality', 'Bangladeshi', 4);
    personalInfoStmt.run('Religion', 'Islam', 5);
    personalInfoStmt.run('Marital Status', 'Single', 6);
    personalInfoStmt.run('Permanent Address', 'Madaripur, Dhaka, Bangladesh', 7);

    // Insert Skills
    const skillsStmt = db.prepare('INSERT INTO skills (skill_name, display_order) VALUES (?, ?)');
    const skills = [
        'HTML5', 'CSS3', 'JavaScript', 'React', 'Bootstrap', 'Git',
        'Responsive Design', 'UI/UX Principles', 'Python', 'C Programming',
        'Java', 'Problem Solving', 'Team Collaboration'
    ];
    skills.forEach((skill, index) => {
        skillsStmt.run(skill, index + 1);
    });

    // Insert Projects
    const projectsStmt = db.prepare(`
        INSERT INTO projects (title, year, description, display_order)
        VALUES (?, ?, ?, ?)
    `);
    projectsStmt.run('University Management System', '2023', 'Developed a web-based university management system using HTML, CSS, JavaScript and PHP. The system includes features for student registration, course management, and grade tracking.', 1);
    projectsStmt.run('E-commerce Website (Academic Project)', '2022', 'Created a responsive e-commerce platform with product listings, shopping cart functionality, and user authentication system.', 2);
    projectsStmt.run('Personal Portfolio Website', '2021', 'Designed and developed a personal portfolio website to showcase projects and skills using pure HTML, CSS, and JavaScript.', 3);

    // Insert Certifications
    const certificationsStmt = db.prepare('INSERT INTO certifications (certification_name, display_order) VALUES (?, ?)');
    certificationsStmt.run('Programming Fundamentals with Python - Coursera (2023)', 1);
    certificationsStmt.run('Web Development Bootcamp - Udemy (2022)', 2);
    certificationsStmt.run('Responsive Web Design - freeCodeCamp (2021)', 3);

    // Insert Languages
    const languagesStmt = db.prepare(`
        INSERT INTO languages (language_name, proficiency_level, display_order)
        VALUES (?, ?, ?)
    `);
    languagesStmt.run('Bengali', 'Native', 1);
    languagesStmt.run('English', 'Fluent', 2);
    languagesStmt.run('Hindi', 'Conversational', 3);

    console.log('✅ Database seeded successfully!');
}

// Run seed if this file is executed directly
if (require.main === module) {
    seedDatabase();
    db.close();
}

module.exports = { seedDatabase };

