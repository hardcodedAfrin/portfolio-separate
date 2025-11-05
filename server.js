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

const { getPortfolioData, saveContactSubmission, getContactSubmissions } = database;

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

// Start server
app.listen(PORT, (error) => {
    if (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📄 Open http://localhost:${PORT} in your browser`);
});
