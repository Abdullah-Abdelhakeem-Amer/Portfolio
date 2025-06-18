// ==========================================================================
// Projects JavaScript - Dynamic Project Loading and Filtering
// ==========================================================================

class ProjectManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.loadProjectsData();
        this.setupEventListeners();
        this.renderProjects();
    }

    async loadProjectsData() {
        this.isLoading = true;
        this.showLoadingState();

        try {
            const response = await fetch('./data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.projects = data.featured || [];
            this.filteredProjects = [...this.projects];
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.loadFallbackProjects();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    loadFallbackProjects() {
        this.projects = [
            {
                id: "autodash-pro",
                title: "AutoDash Pro",
                description: "Real-time vehicle dashboard with CAN bus integration",
                category: "automotive",
                technologies: ["Android Automotive", "Kotlin", "CAN Bus"],
                image: "./assets/images/projects/autodash-pro-placeholder.jpg",
                github: "https://github.com/abdullah6484/Automotive_Android_Portfolio/tree/main/projects/autodash-pro",
                status: "completed",
                year: "2024"
            },
            {
                id: "autoivi-system",
                title: "AutoIVI Pro",
                description: "In-vehicle infotainment system with navigation",
                category: "automotive",
                technologies: ["AAOS", "Google Maps", "ExoPlayer"],
                image: "./assets/images/projects/autoivi-placeholder.jpg",
                github: "https://github.com/abdullah6484/Automotive_Android_Portfolio/tree/main/projects/automotive-ivi-system",
                status: "completed",
                year: "2024"
            },
            {
                id: "custom-tabletos",
                title: "CustomTabletOS",
                description: "AOSP-based locked-down system for tablets",
                category: "android",
                technologies: ["AOSP", "Android 14", "Custom ROM"],
                image: "./assets/images/projects/tabletos-placeholder.jpg",
                github: "https://github.com/abdullah6484/Automotive_Android_Portfolio/tree/main/projects/aosp-custom-rom",
                status: "completed",
                year: "2024"
            }
        ];
        this.filteredProjects = [...this.projects];
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterChange(e.target);
            });
        });

        // Search functionality (if search input exists)
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    handleFilterChange(button) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Apply filter
        const filter = button.getAttribute('data-filter');
        this.currentFilter = filter;
        this.filterProjects(filter);
    }

    handleSearch(searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        
        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = 
                project.title.toLowerCase().includes(lowercaseSearch) ||
                project.description.toLowerCase().includes(lowercaseSearch) ||
                project.technologies.some(tech => tech.toLowerCase().includes(lowercaseSearch));
            
            const matchesFilter = this.currentFilter === 'all' || project.category === this.currentFilter;
            
            return matchesSearch && matchesFilter;
        });

        this.renderProjects();
    }

    filterProjects(filter) {
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.category === filter
            );
        }
        
        this.renderProjects();
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        if (this.filteredProjects.length === 0) {
            this.showEmptyState();
            return;
        }

        const projectsHTML = this.filteredProjects.map(project => 
            this.createProjectCard(project)
        ).join('');

        projectsGrid.innerHTML = projectsHTML;
        
        // Trigger animations
        this.animateProjectCards();
        
        // Setup lazy loading for images
        this.setupLazyLoading();
    }

    createProjectCard(project) {
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        const links = this.createProjectLinks(project);

        return `
            <div class="project-card" data-category="${project.category}" data-project-id="${project.id}">
                <div class="project-image">
                    <img src="${this.getProjectImage(project)}" 
                         alt="${project.title}" 
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center'">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${links}
                        </div>
                    </div>
                    <div class="project-status ${project.status}">
                        ${this.getStatusText(project.status)}
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-year">${project.year}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${techTags}
                    </div>
                    <div class="project-actions">
                        <button class="btn-learn-more" onclick="projectManager.showProjectDetails('${project.id}')">
                            <i class="fas fa-info-circle"></i>
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createProjectLinks(project) {
        let links = '';
        
        if (project.github) {
            links += `<a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="View Code" title="View Code">
                <i class="fab fa-github"></i>
            </a>`;
        }
        
        if (project.demo) {
            links += `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" aria-label="View Demo" title="View Demo">
                <i class="fas fa-external-link-alt"></i>
            </a>`;
        }
        
        if (project.youtube) {
            links += `<a href="${project.youtube}" target="_blank" rel="noopener noreferrer" aria-label="Watch Video" title="Watch Video">
                <i class="fab fa-youtube"></i>
            </a>`;
        }

        return links;
    }

    getProjectImage(project) {
        // Return project image or fallback to online placeholder
        return project.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center';
    }

    getStatusText(status) {
        const statusMap = {
            'completed': 'Completed',
            'in-progress': 'In Progress',
            'planning': 'Planning',
            'featured': 'Featured'
        };
        return statusMap[status] || 'Project';
    }

    showProjectDetails(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Create and show modal with project details
        this.createProjectModal(project);
    }

    createProjectModal(project) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="projectManager.closeModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <button class="modal-close" onclick="projectManager.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="project-details">
                        <div class="project-image-large">
                            <img src="${this.getProjectImage(project)}" alt="${project.title}">
                        </div>
                        <div class="project-info">
                            <p class="project-description-full">${project.description}</p>
                            
                            ${project.features ? `
                                <div class="project-section">
                                    <h4><i class="fas fa-star"></i> Key Features</h4>
                                    <ul>
                                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${project.challenges ? `
                                <div class="project-section">
                                    <h4><i class="fas fa-cog"></i> Technical Challenges</h4>
                                    <ul>
                                        ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            ${project.results ? `
                                <div class="project-section">
                                    <h4><i class="fas fa-trophy"></i> Results & Impact</h4>
                                    <ul>
                                        ${project.results.map(result => `<li>${result}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            
                            <div class="project-section">
                                <h4><i class="fas fa-code"></i> Technologies Used</h4>
                                <div class="tech-tags-list">
                                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="project-actions-modal">
                                ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary">
                                    <i class="fab fa-github"></i> View Code
                                </a>` : ''}
                                ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>` : ''}
                                ${project.youtube ? `<a href="${project.youtube}" target="_blank" class="btn btn-outline">
                                    <i class="fab fa-youtube"></i> Watch Demo
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.querySelector('.project-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        }
    }

    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('.project-card img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Image will load automatically due to loading="lazy"
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    showLoadingState() {
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading projects...</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // Loading state will be replaced by rendered projects
    }

    showEmptyState() {
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search criteria or filter selection.</p>
                </div>
            `;
        }
    }

    sortProjects(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredProjects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
                break;
            case 'oldest':
                this.filteredProjects.sort((a, b) => parseInt(a.year) - parseInt(b.year));
                break;
            case 'name':
                this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'category':
                this.filteredProjects.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                // Default to newest
                this.filteredProjects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        }
        
        this.renderProjects();
    }
}

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('projects-grid')) {
        window.projectManager = new ProjectManager();
    }
});

// Handle escape key for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.querySelector('.project-modal')) {
        window.projectManager.closeModal();
    }
}); 