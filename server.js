// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve HTML/CSS/JS

// Import database after express setup to catch any errors
let database;
try {
    database = require("./database");
} catch (error) {
    console.error("❌ Error loading database module:", error);
    process.exit(1);
}

const { 
    getPortfolioData, 
    saveContactSubmission, 
    getContactSubmissions,
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
} = database;

// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Admin route to view submissions
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

// GET route to fetch portfolio data
app.get("/api/portfolio", (req, res) => {
    try {
        const portfolioData = getPortfolioData();
        res.json(portfolioData);
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        res.status(500).json({ error: "Failed to fetch portfolio data" });
    }
});

// POST route to store form submissions
app.post("/submit", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        saveContactSubmission(name, email, message);
        res.json({ message: "Thank you! Your message has been received." });
    } catch (error) {
        console.error("Error saving submission:", error);
        res.status(500).json({ message: "Error saving your message. Please try again." });
    }
});

// GET route to fetch contact submissions (optional - for admin purposes)
app.get("/api/submissions", (req, res) => {
    try {
        const submissions = getContactSubmissions();
        res.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

// Admin route to edit portfolio
app.get("/edit", (req, res) => {
    res.sendFile(path.join(__dirname, "edit.html"));
});

// API Routes for updating portfolio data
// Update Portfolio Header
app.put("/api/portfolio/header", (req, res) => {
    try {
        updatePortfolioHeader(req.body);
        res.json({ success: true, message: "Portfolio header updated successfully" });
    } catch (error) {
        console.error("Error updating header:", error);
        res.status(500).json({ error: "Failed to update header" });
    }
});

// Update About Me
app.put("/api/portfolio/about", (req, res) => {
    try {
        updateAboutMe(req.body.content);
        res.json({ success: true, message: "About section updated successfully" });
    } catch (error) {
        console.error("Error updating about:", error);
        res.status(500).json({ error: "Failed to update about section" });
    }
});

// Education routes
app.post("/api/portfolio/education", (req, res) => {
    try {
        const { degree, institution, year, result, display_order } = req.body;
        const result_obj = addEducation(degree, institution, year, result, display_order || 0);
        res.json({ success: true, message: "Education added successfully", id: result_obj.id });
    } catch (error) {
        console.error("Error adding education:", error);
        res.status(500).json({ error: "Failed to add education" });
    }
});

app.put("/api/portfolio/education/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { degree, institution, year, result, display_order } = req.body;
        updateEducation(parseInt(id), degree, institution, year, result, display_order || 0);
        res.json({ success: true, message: "Education updated successfully" });
    } catch (error) {
        console.error("Error updating education:", error);
        res.status(500).json({ error: "Failed to update education" });
    }
});

app.delete("/api/portfolio/education/:id", (req, res) => {
    try {
        const { id } = req.params;
        deleteEducation(parseInt(id));
        res.json({ success: true, message: "Education deleted successfully" });
    } catch (error) {
        console.error("Error deleting education:", error);
        res.status(500).json({ error: "Failed to delete education" });
    }
});

// Personal Info routes
app.post("/api/portfolio/personal-info", (req, res) => {
    try {
        const { field_name, field_value, display_order } = req.body;
        const result_obj = addPersonalInfo(field_name, field_value, display_order || 0);
        res.json({ success: true, message: "Personal info added successfully", id: result_obj.id });
    } catch (error) {
        console.error("Error adding personal info:", error);
        res.status(500).json({ error: "Failed to add personal info" });
    }
});

app.put("/api/portfolio/personal-info/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { field_name, field_value, display_order } = req.body;
        updatePersonalInfo(parseInt(id), field_name, field_value, display_order || 0);
        res.json({ success: true, message: "Personal info updated successfully" });
    } catch (error) {
        console.error("Error updating personal info:", error);
        res.status(500).json({ error: "Failed to update personal info" });
    }
});

app.delete("/api/portfolio/personal-info/:id", (req, res) => {
    try {
        const { id } = req.params;
        deletePersonalInfo(parseInt(id));
        res.json({ success: true, message: "Personal info deleted successfully" });
    } catch (error) {
        console.error("Error deleting personal info:", error);
        res.status(500).json({ error: "Failed to delete personal info" });
    }
});

// Skills routes
app.post("/api/portfolio/skills", (req, res) => {
    try {
        const { skill_name, display_order } = req.body;
        addSkill(skill_name, display_order || 0);
        res.json({ success: true, message: "Skill added successfully" });
    } catch (error) {
        console.error("Error adding skill:", error);
        res.status(500).json({ error: "Failed to add skill" });
    }
});

app.delete("/api/portfolio/skills/:skill_name", (req, res) => {
    try {
        const { skill_name } = req.params;
        deleteSkill(skill_name);
        res.json({ success: true, message: "Skill deleted successfully" });
    } catch (error) {
        console.error("Error deleting skill:", error);
        res.status(500).json({ error: "Failed to delete skill" });
    }
});

// Projects routes
app.post("/api/portfolio/projects", (req, res) => {
    try {
        const { title, year, description, display_order } = req.body;
        const result_obj = addProject(title, year, description, display_order || 0);
        res.json({ success: true, message: "Project added successfully", id: result_obj.id });
    } catch (error) {
        console.error("Error adding project:", error);
        res.status(500).json({ error: "Failed to add project" });
    }
});

app.put("/api/portfolio/projects/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { title, year, description, display_order } = req.body;
        updateProject(parseInt(id), title, year, description, display_order || 0);
        res.json({ success: true, message: "Project updated successfully" });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
    }
});

app.delete("/api/portfolio/projects/:id", (req, res) => {
    try {
        const { id } = req.params;
        deleteProject(parseInt(id));
        res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

// Certifications routes
app.post("/api/portfolio/certifications", (req, res) => {
    try {
        const { certification_name, display_order } = req.body;
        const result_obj = addCertification(certification_name, display_order || 0);
        res.json({ success: true, message: "Certification added successfully", id: result_obj.id });
    } catch (error) {
        console.error("Error adding certification:", error);
        res.status(500).json({ error: "Failed to add certification" });
    }
});

app.delete("/api/portfolio/certifications/:id", (req, res) => {
    try {
        const { id } = req.params;
        deleteCertification(parseInt(id));
        res.json({ success: true, message: "Certification deleted successfully" });
    } catch (error) {
        console.error("Error deleting certification:", error);
        res.status(500).json({ error: "Failed to delete certification" });
    }
});

// Languages routes
app.post("/api/portfolio/languages", (req, res) => {
    try {
        const { language_name, proficiency_level, display_order } = req.body;
        const result_obj = addLanguage(language_name, proficiency_level, display_order || 0);
        res.json({ success: true, message: "Language added successfully", id: result_obj.id });
    } catch (error) {
        console.error("Error adding language:", error);
        res.status(500).json({ error: "Failed to add language" });
    }
});

app.put("/api/portfolio/languages/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { language_name, proficiency_level, display_order } = req.body;
        updateLanguage(parseInt(id), language_name, proficiency_level, display_order || 0);
        res.json({ success: true, message: "Language updated successfully" });
    } catch (error) {
        console.error("Error updating language:", error);
        res.status(500).json({ error: "Failed to update language" });
    }
});

app.delete("/api/portfolio/languages/:id", (req, res) => {
    try {
        const { id } = req.params;
        deleteLanguage(parseInt(id));
        res.json({ success: true, message: "Language deleted successfully" });
    } catch (error) {
        console.error("Error deleting language:", error);
        res.status(500).json({ error: "Failed to delete language" });
    }
});

// Start server
app.listen(PORT, (error) => {
    if (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📄 Open http://localhost:${PORT} in your browser`);
});
