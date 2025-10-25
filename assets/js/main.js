// ==========================================================================
// Main JavaScript - Abdullah Abdelhakeem Portfolio
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeContactForm();
    initializeSkillBars();
    initializeProjectFilters();
    initializeMobileMenu();
    initializeScrollIndicator();
});

// ==========================================================================
// Navigation
// ==========================================================================

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollTop = 0;

    // Navbar scroll behavior
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Active link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// Theme Toggle
// ==========================================================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon based on current theme
    updateThemeIcon(currentTheme, themeIcon);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcon(newTheme, themeIcon);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(theme, iconElement) {
    if (theme === 'dark') {
        iconElement.className = 'fas fa-sun';
    } else {
        iconElement.className = 'fas fa-moon';
    }
}

// ==========================================================================
// Smooth Scrolling
// ==========================================================================

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    
    [...navLinks, ...ctaButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('nav-menu');
                const mobileToggle = document.getElementById('mobile-menu-toggle');
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
}

// ==========================================================================
// Animations
// ==========================================================================

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skills-section')) {
                    animateSkillBars();
                }
                
                // Trigger counter animations
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .timeline-item, .skill-category, .hero-stats, .skills-section');
    animateElements.forEach(el => observer.observe(el));
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number appropriately
            let displayValue = Math.floor(current);
            if (counter.textContent.includes('K+')) {
                displayValue = Math.floor(current) + 'K+';
            } else if (counter.textContent.includes('+')) {
                displayValue = Math.floor(current) + '+';
            }
            
            counter.textContent = displayValue;
        }, 20);
    });
}

// ==========================================================================
// Skill Bars
// ==========================================================================

function initializeSkillBars() {
    // This will be triggered by the intersection observer
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 100);
    });
}

// ==========================================================================
// Project Filters
// ==========================================================================

function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.getElementById('projects-grid');
    
    // Load projects data
    loadProjects();
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

async function loadProjects() {
    try {
        const response = await fetch('./data/projects.json');
        const projects = await response.json();
        displayProjects(projects.featured || projects.slice(0, 6));
    } catch (error) {
        console.error('Error loading projects:', error);
        // Display fallback projects
        displayFallbackProjects();
    }
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}" data-technologies="${(project.technologies || []).join('|')}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" aria-label="View Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="View Code"><i class="fab fa-github"></i></a>` : ''}
                        ${project.youtube ? `<a href="${project.youtube}" target="_blank" rel="noopener noreferrer" aria-label="Watch Video"><i class="fab fa-youtube"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function displayFallbackProjects() {
    const fallbackProjects = [
        {
            title: 'AutoDash Pro',
            description: 'Real-time vehicle dashboard with CAN bus integration',
            category: 'automotive',
            technologies: ['Android Automotive', 'Kotlin', 'CAN Bus'],
            image: './assets/images/projects/autodash-pro.jpg',
            github: 'https://github.com/abdullah6484/Automotive_Android_Portfolio/tree/main/projects/autodash-pro'
        },
        {
            title: 'AutoIVI System',
            description: 'In-vehicle infotainment system with navigation',
            category: 'automotive',
            technologies: ['AAOS', 'Google Maps', 'ExoPlayer'],
            image: './assets/images/projects/autoivi-system.jpg',
            github: 'https://github.com/abdullah6484/Automotive_Android_Portfolio/tree/main/projects/automotive-ivi-system'
        },
        {
            title: 'CustomTabletOS',
            description: 'AOSP-based locked-down system for tablets',
            category: 'android',
            technologies: ['AOSP', 'Android 14', 'Custom ROM'],
            image: './assets/images/projects/custom-tabletos.jpg',
            github: 'https://github.com/abdullah6484/Automotive_Android_Portfolio/tree/main/projects/aosp-custom-rom'
        }
    ];
    
    displayProjects(fallbackProjects);
}

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const technologies = (card.getAttribute('data-technologies') || '').toLowerCase();
        let shouldShow = false;
        
        if (filter === 'all') {
            shouldShow = true;
        } else if (filter === 'android-automotive') {
            // Match Android Automotive OS, AOSP, or AAOS
            shouldShow = technologies.includes('android automotive') || 
                        technologies.includes('aosp') ||
                        technologies.includes('aaos') ||
                        category === 'android';
        } else if (filter === 'embedded-linux') {
            // Match Embedded Linux, Linux Kernel, Yocto, etc.
            shouldShow = technologies.includes('embedded linux') || 
                        technologies.includes('linux kernel') ||
                        technologies.includes('yocto') ||
                        technologies.includes('buildroot') ||
                        category === 'embedded';
        } else if (filter === 'cpp') {
            // Match C++, C/C++
            shouldShow = technologies.includes('c++') || 
                        technologies.includes('c/c++');
        } else if (filter === 'ai-ml') {
            // Match AI/ML related technologies
            shouldShow = technologies.includes('pytorch') ||
                        technologies.includes('tensorflow') ||
                        technologies.includes('llm') ||
                        technologies.includes('langchain') ||
                        technologies.includes('rag') ||
                        technologies.includes('machine learning') ||
                        technologies.includes('computer vision') ||
                        technologies.includes('opencv') ||
                        technologies.includes('yolo') ||
                        technologies.includes('gan') ||
                        technologies.includes('diffusion') ||
                        technologies.includes('huggingface') ||
                        category === 'ai';
        } else {
            // Fallback to category-based filtering
            shouldShow = category === filter;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================================================
// Mobile Menu
// ==========================================================================

function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('nav-menu');
    
    mobileToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==========================================================================
// Contact Form
// ==========================================================================

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
}

async function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        // Here you would typically send to a backend service
        // For now, we'll simulate the process
        await simulateFormSubmission(formData);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 2000);
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    });
}

// ==========================================================================
// Scroll Indicator
// ==========================================================================

function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled > heroHeight * 0.8) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// Performance Optimization
// ==========================================================================

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        './assets/css/main.css',
        './assets/css/responsive.css',
        './assets/js/projects.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    preloadCriticalResources();
});

// ==========================================================================
// Error Handling
// ==========================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// ==========================================================================
// Service Worker Registration (for PWA)
// ==========================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
} 