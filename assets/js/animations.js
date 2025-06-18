// ==========================================================================
// Animations JavaScript - Smooth animations and transitions
// ==========================================================================

class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupTypingAnimation();
    }

    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe elements that should animate on scroll
        const animatedElements = document.querySelectorAll([
            '.section',
            '.project-card',
            '.service-card',
            '.timeline-item',
            '.skill-item',
            '.contact-item'
        ].join(','));

        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    animateElement(element) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        
        // Add specific animations based on element type
        if (element.classList.contains('project-card')) {
            this.animateProjectCard(element);
        } else if (element.classList.contains('service-card')) {
            this.animateServiceCard(element);
        } else if (element.classList.contains('section')) {
            this.animateSection(element);
        }
    }

    animateProjectCard(card) {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        
        requestAnimationFrame(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        });
    }

    animateServiceCard(card) {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        
        requestAnimationFrame(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        });
    }

    animateSection(section) {
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        
        if (title) {
            title.style.transform = 'translateY(20px)';
            title.style.opacity = '0';
            
            setTimeout(() => {
                title.style.transition = 'all 0.6s ease-out';
                title.style.transform = 'translateY(0)';
                title.style.opacity = '1';
            }, 100);
        }
        
        if (subtitle) {
            subtitle.style.transform = 'translateY(20px)';
            subtitle.style.opacity = '0';
            
            setTimeout(() => {
                subtitle.style.transition = 'all 0.6s ease-out';
                subtitle.style.transform = 'translateY(0)';
                subtitle.style.opacity = '1';
            }, 200);
        }
    }

    setupScrollAnimations() {
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                const heroImage = hero.querySelector('.hero-image');
                if (heroImage) {
                    heroImage.style.transform = `translateY(${rate}px)`;
                }
            });
        }
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    setupHoverEffects() {
        // Project cards hover effects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });

        // Service cards hover effects
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    setupTypingAnimation() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid';
            element.style.animation = 'blink 1s infinite';
            
            let i = 0;
            const typeTimer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeTimer);
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                        element.style.animation = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    // Utility functions
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    static smoothScrollTo(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.offsetTop - 80; // Account for navbar
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = AnimationManager.easeInOutCubic(timeElapsed / duration);
            
            window.scrollTo(0, startPosition + (distance * run));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationManager();
});

// Add CSS for blink animation
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: currentColor; }
    }
    
    .animate-on-scroll {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .project-card,
    .service-card {
        transition: all 0.3s ease;
    }
    
    .btn {
        transition: all 0.3s ease;
    }
    
    .service-icon {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style); 