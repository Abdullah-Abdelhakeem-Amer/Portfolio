/**
 * Resume Management System
 * Handles resume data loading, display, and PDF generation
 */

class ResumeManager {
    constructor() {
        this.resumeData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadResumeData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize resume manager:', error);
        }
    }

    async loadResumeData() {
        try {
            const response = await fetch('../data/resume.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.resumeData = await response.json();
            console.log('Resume data loaded successfully');
        } catch (error) {
            console.error('Error loading resume data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Download resume button
        const downloadBtn = document.getElementById('download-resume');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResume());
        }

        // View resume button
        const viewBtn = document.getElementById('view-resume');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => this.viewResume());
        }

        // Print resume button
        const printBtn = document.getElementById('print-resume');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printResume());
        }
    }

    generateResumeHTML() {
        if (!this.resumeData) {
            console.error('Resume data not loaded');
            return '';
        }

        const data = this.resumeData;
        
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.personalInfo.name} - Resume</title>
                <style>
                    ${this.getResumeCSS()}
                </style>
            </head>
            <body>
                <div class="resume-container">
                    ${this.generateHeader(data.personalInfo)}
                    ${this.generateSummary(data.summary)}
                    ${this.generateExperience(data.experience)}
                    ${this.generateEducation(data.education)}
                    ${this.generateSkills(data.skills)}
                    ${this.generateCertifications(data.certifications)}
                    ${this.generateProjects(data.projects)}
                    ${this.generateAchievements(data.achievements)}
                </div>
            </body>
            </html>
        `;
    }

    generateHeader(personalInfo) {
        return `
            <header class="resume-header">
                <h1>${personalInfo.name}</h1>
                <h2>${personalInfo.title}</h2>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${personalInfo.email}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${personalInfo.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${personalInfo.location}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-linkedin"></i>
                        <span>${personalInfo.linkedin}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-github"></i>
                        <span>${personalInfo.github}</span>
                    </div>
                </div>
            </header>
        `;
    }

    generateSummary(summary) {
        return `
            <section class="resume-section">
                <h3>Professional Summary</h3>
                <p>${summary}</p>
            </section>
        `;
    }

    generateExperience(experience) {
        const experienceHTML = experience.map(exp => `
            <div class="experience-item">
                <div class="experience-header">
                    <h4>${exp.position}</h4>
                    <div class="company-info">
                        <span class="company">${exp.company}</span>
                        <span class="location">${exp.location}</span>
                        <span class="duration">${exp.duration}</span>
                    </div>
                </div>
                <p class="experience-description">${exp.description}</p>
                <ul class="achievements">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
                <div class="technologies">
                    <strong>Technologies:</strong> ${exp.technologies.join(', ')}
                </div>
            </div>
        `).join('');

        return `
            <section class="resume-section">
                <h3>Professional Experience</h3>
                ${experienceHTML}
            </section>
        `;
    }

    generateEducation(education) {
        const educationHTML = education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <h4>${edu.degree} in ${edu.field}</h4>
                    <div class="institution-info">
                        <span class="institution">${edu.institution}</span>
                        <span class="location">${edu.location}</span>
                        <span class="gpa">GPA: ${edu.gpa}</span>
                    </div>
                </div>
                <div class="education-details">
                    <p><strong>Honors:</strong> ${edu.honors}</p>
                    <p><strong>Relevant Courses:</strong> ${edu.relevantCourses.join(', ')}</p>
                </div>
            </div>
        `).join('');

        return `
            <section class="resume-section">
                <h3>Education</h3>
                ${educationHTML}
            </section>
        `;
    }

    generateSkills(skills) {
        const programmingSkills = skills.programming.map(category => `
            <div class="skill-category">
                <h5>${category.category}</h5>
                <div class="skills-list">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <span class="skill-name">${skill.name}</span>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        return `
            <section class="resume-section">
                <h3>Technical Skills</h3>
                ${programmingSkills}
                <div class="skill-category">
                    <h5>Tools & Technologies</h5>
                    <p>${skills.tools.join(', ')}</p>
                </div>
                <div class="skill-category">
                    <h5>Soft Skills</h5>
                    <p>${skills.soft.join(', ')}</p>
                </div>
            </section>
        `;
    }

    generateCertifications(certifications) {
        const certificationsHTML = certifications.map(cert => `
            <div class="certification-item">
                <h4>${cert.name}</h4>
                <div class="certification-details">
                    <span class="issuer">${cert.issuer}</span>
                    <span class="date">${cert.date}</span>
                    <span class="credential">${cert.credentialId}</span>
                </div>
                <p>${cert.description}</p>
            </div>
        `).join('');

        return `
            <section class="resume-section">
                <h3>Certifications</h3>
                ${certificationsHTML}
            </section>
        `;
    }

    generateProjects(projects) {
        const projectsHTML = projects.map(project => `
            <div class="project-item">
                <h4>${project.name}</h4>
                <div class="project-meta">
                    <span class="project-type">${project.type}</span>
                    <span class="project-duration">${project.duration}</span>
                    <span class="project-team">${project.team}</span>
                </div>
                <p>${project.description}</p>
                <div class="project-technologies">
                    <strong>Technologies:</strong> ${project.technologies.join(', ')}
                </div>
                <ul class="project-achievements">
                    ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        return `
            <section class="resume-section">
                <h3>Key Projects</h3>
                ${projectsHTML}
            </section>
        `;
    }

    generateAchievements(achievements) {
        const achievementsHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <h4>${achievement.title}</h4>
                <div class="achievement-year">${achievement.year}</div>
                <p>${achievement.description}</p>
            </div>
        `).join('');

        return `
            <section class="resume-section">
                <h3>Key Achievements</h3>
                ${achievementsHTML}
            </section>
        `;
    }

    getResumeCSS() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
            }

            .resume-container {
                max-width: 8.5in;
                margin: 0 auto;
                padding: 0.5in;
                background: white;
            }

            .resume-header {
                text-align: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #2563eb;
            }

            .resume-header h1 {
                font-size: 2.5rem;
                font-weight: 700;
                color: #1e40af;
                margin-bottom: 0.5rem;
            }

            .resume-header h2 {
                font-size: 1.25rem;
                font-weight: 500;
                color: #64748b;
                margin-bottom: 1rem;
            }

            .contact-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.875rem;
            }

            .contact-item i {
                color: #2563eb;
                width: 16px;
            }

            .resume-section {
                margin-bottom: 2rem;
            }

            .resume-section h3 {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #e2e8f0;
            }

            .experience-item,
            .education-item,
            .project-item,
            .certification-item,
            .achievement-item {
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #f1f5f9;
            }

            .experience-header,
            .education-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;
            }

            .experience-header h4,
            .education-header h4,
            .project-item h4,
            .certification-item h4,
            .achievement-item h4 {
                font-size: 1.125rem;
                font-weight: 600;
                color: #1e40af;
            }

            .company-info,
            .institution-info,
            .project-meta {
                text-align: right;
                font-size: 0.875rem;
                color: #64748b;
            }

            .achievements,
            .project-achievements {
                margin: 0.5rem 0;
                padding-left: 1.25rem;
            }

            .achievements li,
            .project-achievements li {
                margin-bottom: 0.25rem;
            }

            .technologies,
            .project-technologies {
                font-size: 0.875rem;
                color: #64748b;
                margin-top: 0.5rem;
            }

            .skill-category {
                margin-bottom: 1rem;
            }

            .skill-category h5 {
                font-size: 1rem;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            .skill-item {
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .skill-name {
                width: 150px;
                font-size: 0.875rem;
            }

            .skill-bar {
                flex: 1;
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
            }

            .skill-progress {
                height: 100%;
                background: #2563eb;
                border-radius: 4px;
            }

            @media print {
                body {
                    font-size: 12px;
                }
                
                .resume-container {
                    padding: 0.25in;
                }
                
                .resume-section {
                    break-inside: avoid;
                }
                
                .experience-item,
                .project-item {
                    break-inside: avoid;
                }
            }
        `;
    }

    async downloadResume() {
        try {
            const resumeHTML = this.generateResumeHTML();
            const blob = new Blob([resumeHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Resume downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading resume:', error);
            this.showNotification('Failed to download resume. Please try again.', 'error');
        }
    }

    viewResume() {
        try {
            const resumeHTML = this.generateResumeHTML();
            const newWindow = window.open('', '_blank');
            newWindow.document.write(resumeHTML);
            newWindow.document.close();
        } catch (error) {
            console.error('Error viewing resume:', error);
            this.showNotification('Failed to open resume. Please try again.', 'error');
        }
    }

    printResume() {
        try {
            const resumeHTML = this.generateResumeHTML();
            const printWindow = window.open('', '_blank');
            printWindow.document.write(resumeHTML);
            printWindow.document.close();
            
            printWindow.onload = function() {
                printWindow.print();
                printWindow.close();
            };
        } catch (error) {
            console.error('Error printing resume:', error);
            this.showNotification('Failed to print resume. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Public API
    getResumeData() {
        return this.resumeData;
    }

    updateResumeData(newData) {
        this.resumeData = { ...this.resumeData, ...newData };
    }
}

// Initialize resume manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.resumeManager = new ResumeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeManager;
} 