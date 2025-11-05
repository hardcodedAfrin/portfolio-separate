// database.js - Database initialization and operations
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');
let db;

try {
    db = new Database(dbPath);
    console.log('📦 Database connection established');
} catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
}

// Initialize database tables
function initializeDatabase() {
    // Portfolio Header Information
    db.exec(`
        CREATE TABLE IF NOT EXISTS portfolio_header (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            linkedin TEXT,
            github TEXT,
            profile_image TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // About Me Section
    db.exec(`
        CREATE TABLE IF NOT EXISTS about_me (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Education
    db.exec(`
        CREATE TABLE IF NOT EXISTS education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            degree TEXT NOT NULL,
            institution TEXT NOT NULL,
            year TEXT NOT NULL,
            result TEXT NOT NULL,
            display_order INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Personal Information
    db.exec(`
        CREATE TABLE IF NOT EXISTS personal_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            field_name TEXT NOT NULL,
            field_value TEXT NOT NULL,
            display_order INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Skills
    db.exec(`
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            skill_name TEXT NOT NULL UNIQUE,
            display_order INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Projects
    db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            year TEXT NOT NULL,
            description TEXT NOT NULL,
            display_order INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Certifications
    db.exec(`
        CREATE TABLE IF NOT EXISTS certifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            certification_name TEXT NOT NULL,
            display_order INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Languages
    db.exec(`
        CREATE TABLE IF NOT EXISTS languages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            language_name TEXT NOT NULL,
            proficiency_level TEXT,
            display_order INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Contact Form Submissions
    db.exec(`
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Database initialized successfully
}

// Get all portfolio data
function getPortfolioData() {
    const header = db.prepare('SELECT * FROM portfolio_header ORDER BY id DESC LIMIT 1').get();
    const about = db.prepare('SELECT content FROM about_me ORDER BY id DESC LIMIT 1').get();
    const education = db.prepare('SELECT * FROM education ORDER BY display_order, id').all();
    const personalInfo = db.prepare('SELECT * FROM personal_info ORDER BY display_order, id').all();
    const skills = db.prepare('SELECT skill_name FROM skills ORDER BY display_order, id').all();
    const projects = db.prepare('SELECT * FROM projects ORDER BY display_order, id').all();
    const certifications = db.prepare('SELECT * FROM certifications ORDER BY display_order, id').all();
    const languages = db.prepare('SELECT * FROM languages ORDER BY display_order, id').all();

    return {
        header: header || null,
        about: about?.content || '',
        education: education || [],
        personalInfo: personalInfo || [],
        skills: skills.map(s => s.skill_name) || [],
        projects: projects || [],
        certifications: certifications.map(c => ({ id: c.id, certification_name: c.certification_name })) || [],
        languages: languages || []
    };
}

// Save contact form submission
function saveContactSubmission(name, email, message) {
    const stmt = db.prepare('INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, message);
    return result.lastInsertRowid;
}

// Get all contact submissions (for admin purposes)
function getContactSubmissions() {
    return db.prepare('SELECT * FROM contact_submissions ORDER BY timestamp DESC').all();
}

// Update Portfolio Header
function updatePortfolioHeader(data) {
    const stmt = db.prepare(`
        UPDATE portfolio_header 
        SET name = ?, title = ?, email = ?, phone = ?, linkedin = ?, github = ?, profile_image = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = (SELECT id FROM portfolio_header ORDER BY id DESC LIMIT 1)
    `);
    stmt.run(data.name, data.title, data.email, data.phone, data.linkedin || null, data.github || null, data.profile_image || null);
    return { success: true };
}

// Update About Me
function updateAboutMe(content) {
    const stmt = db.prepare('UPDATE about_me SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM about_me ORDER BY id DESC LIMIT 1)');
    stmt.run(content);
    return { success: true };
}

// Update Education - Add new
function addEducation(degree, institution, year, result, display_order) {
    const stmt = db.prepare('INSERT INTO education (degree, institution, year, result, display_order) VALUES (?, ?, ?, ?, ?)');
    const result_obj = stmt.run(degree, institution, year, result, display_order);
    return { success: true, id: result_obj.lastInsertRowid };
}

// Update Education - Update existing
function updateEducation(id, degree, institution, year, result, display_order) {
    const stmt = db.prepare('UPDATE education SET degree = ?, institution = ?, year = ?, result = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(degree, institution, year, result, display_order, id);
    return { success: true };
}

// Delete Education
function deleteEducation(id) {
    const stmt = db.prepare('DELETE FROM education WHERE id = ?');
    stmt.run(id);
    return { success: true };
}

// Update Personal Info - Add new
function addPersonalInfo(field_name, field_value, display_order) {
    const stmt = db.prepare('INSERT INTO personal_info (field_name, field_value, display_order) VALUES (?, ?, ?)');
    const result_obj = stmt.run(field_name, field_value, display_order);
    return { success: true, id: result_obj.lastInsertRowid };
}

// Update Personal Info - Update existing
function updatePersonalInfo(id, field_name, field_value, display_order) {
    const stmt = db.prepare('UPDATE personal_info SET field_name = ?, field_value = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(field_name, field_value, display_order, id);
    return { success: true };
}

// Delete Personal Info
function deletePersonalInfo(id) {
    const stmt = db.prepare('DELETE FROM personal_info WHERE id = ?');
    stmt.run(id);
    return { success: true };
}

// Add Skill
function addSkill(skill_name, display_order) {
    const stmt = db.prepare('INSERT OR REPLACE INTO skills (skill_name, display_order) VALUES (?, ?)');
    const result_obj = stmt.run(skill_name, display_order);
    return { success: true, id: result_obj.lastInsertRowid };
}

// Delete Skill
function deleteSkill(skill_name) {
    const stmt = db.prepare('DELETE FROM skills WHERE skill_name = ?');
    stmt.run(skill_name);
    return { success: true };
}

// Add Project
function addProject(title, year, description, display_order) {
    const stmt = db.prepare('INSERT INTO projects (title, year, description, display_order) VALUES (?, ?, ?, ?)');
    const result_obj = stmt.run(title, year, description, display_order);
    return { success: true, id: result_obj.lastInsertRowid };
}

// Update Project
function updateProject(id, title, year, description, display_order) {
    const stmt = db.prepare('UPDATE projects SET title = ?, year = ?, description = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(title, year, description, display_order, id);
    return { success: true };
}

// Delete Project
function deleteProject(id) {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
    return { success: true };
}

// Add Certification
function addCertification(certification_name, display_order) {
    const stmt = db.prepare('INSERT INTO certifications (certification_name, display_order) VALUES (?, ?)');
    const result_obj = stmt.run(certification_name, display_order);
    return { success: true, id: result_obj.lastInsertRowid };
}

// Delete Certification
function deleteCertification(id) {
    const stmt = db.prepare('DELETE FROM certifications WHERE id = ?');
    stmt.run(id);
    return { success: true };
}

// Add Language
function addLanguage(language_name, proficiency_level, display_order) {
    const stmt = db.prepare('INSERT INTO languages (language_name, proficiency_level, display_order) VALUES (?, ?, ?)');
    const result_obj = stmt.run(language_name, proficiency_level, display_order);
    return { success: true, id: result_obj.lastInsertRowid };
}

// Update Language
function updateLanguage(id, language_name, proficiency_level, display_order) {
    const stmt = db.prepare('UPDATE languages SET language_name = ?, proficiency_level = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(language_name, proficiency_level, display_order, id);
    return { success: true };
}

// Delete Language
function deleteLanguage(id) {
    const stmt = db.prepare('DELETE FROM languages WHERE id = ?');
    stmt.run(id);
    return { success: true };
}

// Initialize database on module load
initializeDatabase();

module.exports = {
    db,
    getPortfolioData,
    saveContactSubmission,
    getContactSubmissions,
    initializeDatabase,
    updatePortfolioHeader,
    updateAboutMe,
    addEducation,
    updateEducation,
    deleteEducation,
    addPersonalInfo,
    updatePersonalInfo,
    deletePersonalInfo,
    addSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage
};

