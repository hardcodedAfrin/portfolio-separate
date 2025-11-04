// Fetch and populate portfolio data from database
async function loadPortfolioData() {
    try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();

        // Populate header
        if (data.header) {
            const header = document.querySelector('header');
            if (data.header.profile_image) {
                const profileImg = header.querySelector('.profile-img');
                if (profileImg) profileImg.src = data.header.profile_image;
            }
            const headerH1 = header.querySelector('h1');
            if (headerH1 && data.header.name) headerH1.textContent = data.header.name;
            
            const headerP = header.querySelector('p');
            if (headerP && data.header.title) headerP.textContent = data.header.title;

            const contactInfo = header.querySelector('.contact-info');
            if (contactInfo) {
                contactInfo.innerHTML = `
                    <p>📧 <a href="mailto:${data.header.email}">${data.header.email}</a> | 📞 ${data.header.phone || ''}</p>
                    <p>🔗 ${data.header.linkedin ? `<a href="${data.header.linkedin}" target="_blank">linkedin.com/in/afrin</a>` : ''} ${data.header.linkedin && data.header.github ? '|' : ''} ${data.header.github ? `<a href="${data.header.github}" target="_blank">github.com/hardcodedAfrin</a>` : ''}</p>
                `;
            }
        }

        // Populate About Me
        if (data.about) {
            const aboutSection = document.querySelector('.section h2');
            if (aboutSection && aboutSection.textContent === 'About Me') {
                const aboutSectionDiv = aboutSection.parentElement;
                const paragraphs = data.about.split('\n\n').filter(p => p.trim());
                aboutSectionDiv.innerHTML = '<h2>About Me</h2>' + paragraphs.map(p => `<p>${p}</p>`).join('');
            }
        }

        // Populate Education
        if (data.education && data.education.length > 0) {
            const educationSection = document.querySelector('.education-table tbody');
            if (educationSection) {
                educationSection.innerHTML = data.education.map(edu => `
                    <tr>
                        <td>${edu.degree}</td>
                        <td>${edu.institution}</td>
                        <td>${edu.year}</td>
                        <td>${edu.result}</td>
                    </tr>
                `).join('');
            }
        }

        // Populate Personal Information
        if (data.personalInfo && data.personalInfo.length > 0) {
            const personalInfoDiv = document.querySelector('.personal-info');
            if (personalInfoDiv) {
                personalInfoDiv.innerHTML = data.personalInfo.map(info => `
                    <div class="info-item"><strong>${info.field_name}</strong><span>${info.field_value}</span></div>
                `).join('');
            }
        }

        // Populate Skills
        if (data.skills && data.skills.length > 0) {
            const skillsDiv = document.querySelector('.skills');
            if (skillsDiv) {
                skillsDiv.innerHTML = data.skills.map(skill => `
                    <span class="skill">${skill}</span>
                `).join('');
            }
        }

        // Populate Projects
        if (data.projects && data.projects.length > 0) {
            const projectsSection = document.querySelector('.section h2');
            let projectsContainer = null;
            document.querySelectorAll('.section').forEach(section => {
                if (section.querySelector('h2')?.textContent === 'Projects') {
                    projectsContainer = section;
                }
            });
            if (projectsContainer) {
                projectsContainer.innerHTML = `
                    <h2>Projects</h2>
                    ${data.projects.map(project => `
                        <div class="project-item">
                            <h3>${project.title}</h3>
                            <p><span class="date">${project.year}</span></p>
                            <p>${project.description}</p>
                        </div>
                    `).join('')}
                `;
            }
        }

        // Populate Certifications
        if (data.certifications && data.certifications.length > 0) {
            const certificationsSection = document.querySelector('.section h2');
            let certificationsContainer = null;
            document.querySelectorAll('.section').forEach(section => {
                if (section.querySelector('h2')?.textContent === 'Certifications') {
                    certificationsContainer = section;
                }
            });
            if (certificationsContainer) {
                certificationsContainer.innerHTML = `
                    <h2>Certifications</h2>
                    <ul>
                        ${data.certifications.map(cert => `<li>${cert}</li>`).join('')}
                    </ul>
                `;
            }
        }

        // Populate Languages
        if (data.languages && data.languages.length > 0) {
            const languagesSection = document.querySelector('.section h2');
            let languagesContainer = null;
            document.querySelectorAll('.section').forEach(section => {
                if (section.querySelector('h2')?.textContent === 'Languages') {
                    languagesContainer = section;
                }
            });
            if (languagesContainer) {
                languagesContainer.innerHTML = `
                    <h2>Languages</h2>
                    <ul>
                        ${data.languages.map(lang => `<li>${lang.language_name}${lang.proficiency_level ? ` (${lang.proficiency_level})` : ''}</li>`).join('')}
                    </ul>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

// Toggle personal info section (needs to be global for onclick attribute)
function togglePersonalInfo() {
    const section = document.querySelector('.personal-info');
    if (section) {
        section.style.display = section.style.display === 'none' ? 'grid' : 'none';
    }
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load portfolio data first
    loadPortfolioData();

    // Dark mode toggle
    const toggleBtn = document.getElementById('toggle-theme');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Scroll to top button
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (scrollBtn) {
        window.onscroll = () => {
            scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
        };
        scrollBtn.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchText = this.value.toLowerCase();
            const sections = document.querySelectorAll('.section');

            sections.forEach(section => {
                const textContent = section.textContent.toLowerCase();
                section.style.display = textContent.includes(searchText) ? 'block' : 'none';
            });
        });
    }

    // Update footer dynamically
    const lastUpdated = document.getElementById("lastUpdated");
    if (lastUpdated) {
        const year = new Date().getFullYear();
        lastUpdated.textContent = `Last updated: July ${year}`;
    }

    // Handle contact form submission
    const contactForm = document.getElementById("contactForm");
    const responseMessage = document.getElementById("responseMessage");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            };

            try {
                const res = await fetch("/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const data = await res.json();
                if (responseMessage) {
                    responseMessage.textContent = data.message;
                    responseMessage.style.color = "green";
                }
                contactForm.reset();
            } catch (error) {
                if (responseMessage) {
                    responseMessage.textContent = "Error sending message!";
                    responseMessage.style.color = "red";
                }
            }
        });
    }
});
