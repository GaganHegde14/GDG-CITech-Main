// Get canvas and set context
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// Define a range of colors that work on light and dark backgrounds
const particleColors = [
    'rgba(255, 255, 255, 0.7)',  // Light white
    'rgba(200, 200, 200, 0.5)',  // Light gray
    'rgba(173, 216, 230, 0.5)',  // Light blue
    'rgba(255, 223, 186, 0.5)',  // Light peach
    'rgba(204, 255, 144, 0.5)'   // Light green
];


// Particle Class
class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    // Draw particle
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    // Update particle position
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Respawn particles at opposite edge
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
}

// Initialize Particles
function initParticles() {
    particlesArray = [];
    const numParticles = 50; // Reduced number of particles
    for (let i = 0; i < numParticles; i++) {
        let size = Math.random() * 3 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let color = particleColors[Math.floor(Math.random() * particleColors.length)];
        let speedX = (Math.random() - 0.5) * 1.5;
        let speedY = (Math.random() - 0.5) * 1.5;
        particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

// Animate Particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particlesArray) {
        particle.draw();
        particle.update();
    }
    requestAnimationFrame(animateParticles);
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Initialize and animate particles
initParticles();
animateParticles();

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const preloaderVideo = document.getElementById('preloader-video');
    const body = document.body;

    // Add preload class to body
    body.classList.add('preload');

    // Start playing the video
    preloaderVideo.play();

    // Listen for video end
    preloaderVideo.addEventListener('ended', () => {
        // Add fade-out class
        preloader.classList.add('fade-out');
        
        // Remove preloader and preload class after animation
        setTimeout(() => {
            preloader.style.display = 'none';
            body.classList.remove('preload');
        }, 500); // Match this with CSS transition duration
    });

    // Fallback in case video fails to load
    preloaderVideo.addEventListener('error', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            body.classList.remove('preload');
        }, 500);
    });

    // Fallback timeout (in case video takes too long)
    const fallbackTimeout = setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                body.classList.remove('preload');
            }, 500);
        }
    }, 5000); // 5 seconds fallback

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Prevent menu from staying open on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    const teamContainer = document.querySelector('.team-container');
    const cardTrack = document.querySelector('.card-track');
    const cards = document.querySelectorAll('.card');
    let scrollInterval;
    let isCardHovered = false;
    let manualScrolling = false;
    let scrollPosition = 0;

    // Clone cards for seamless loop
    function setupInfiniteScroll() {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            addCardListeners(card);
            addCardListeners(clone);
            cardTrack.appendChild(clone);
        });
        startScrolling();
    }

    // Add hover listeners to individual cards and track
    function addCardListeners(card) {
        card.addEventListener('mouseenter', () => {
            isCardHovered = true;
        });

        card.addEventListener('mouseleave', () => {
            // Only reset if not hovering over the track
            if (!teamContainer.matches(':hover')) {
                isCardHovered = false;
                manualScrolling = false;
            }
        });
    }

    // Add track hover listeners
    teamContainer.addEventListener('mouseenter', () => {
        isCardHovered = true;
    });

    teamContainer.addEventListener('mouseleave', () => {
        isCardHovered = false;
        manualScrolling = false;
    });

    // Handle wheel event on the container
    teamContainer.addEventListener('wheel', handleWheel);

    function startScrolling() {
        const scrollSpeed = 1.8;
        const totalWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        const resetPosition = totalWidth * cards.length;

        scrollInterval = setInterval(() => {
            if (!isCardHovered && !manualScrolling) {
                scrollPosition += scrollSpeed;

                if (scrollPosition >= resetPosition) {
                    scrollPosition = 0;
                }

                cardTrack.style.transform = `translateX(-${scrollPosition}px)`;
            }
        }, 20);
    }

    function handleWheel(e) {
        if (isCardHovered) {
            e.preventDefault();
            manualScrolling = true;
            clearTimeout(window.scrollTimeout);

            const totalWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
            const maxScroll = totalWidth * cards.length;
            
            scrollPosition += e.deltaY * 2;

            if (scrollPosition >= maxScroll) {
                scrollPosition = 0;
            } else if (scrollPosition < 0) {
                scrollPosition = maxScroll - 1;
            }

            cardTrack.style.transform = `translateX(-${scrollPosition}px)`;

            window.scrollTimeout = setTimeout(() => {
                manualScrolling = false;
            }, 150);
        }
    }

    // Touch support
    let touchStart = 0;
    let touchScrollStart = 0;

    teamContainer.addEventListener('touchstart', (e) => {
        touchStart = e.touches[0].clientX;
        touchScrollStart = scrollPosition;
        manualScrolling = true;
        isCardHovered = true;
    });

    teamContainer.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const diff = touchStart - touch.clientX;
        scrollPosition = touchScrollStart + diff;
        
        const totalWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        const maxScroll = totalWidth * cards.length;

        if (scrollPosition >= maxScroll) {
            scrollPosition = 0;
            touchScrollStart = 0;
            touchStart = touch.clientX;
        } else if (scrollPosition < 0) {
            scrollPosition = maxScroll - 1;
            touchScrollStart = maxScroll - 1;
            touchStart = touch.clientX;
        }

        cardTrack.style.transform = `translateX(-${scrollPosition}px)`;
    });

    teamContainer.addEventListener('touchend', () => {
        setTimeout(() => {
            isCardHovered = false;
            manualScrolling = false;
        }, 150);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(scrollInterval);
        } else {
            startScrolling();
        }
    });

    // Initialize
    setupInfiniteScroll();

    // Clean up
    window.addEventListener('beforeunload', () => {
        clearInterval(scrollInterval);
    });

    // Intersection Observer for events and projects sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reveal title
                const title = entry.target.querySelector('.events-title');
                if (title) title.classList.add('reveal');

                // Reveal cards with stagger effect
                const cards = entry.target.querySelectorAll('.event-card, .project-card');
                cards.forEach(card => {
                    card.classList.add('reveal');
                });

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe events and projects sections
    const sections = document.querySelectorAll('#events, #Projects');
    sections.forEach(section => observer.observe(section));

    // Optional: Reset animations when scrolling back to top
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop < 100 && lastScrollTop > scrollTop) {
            // Reset animations only for events and projects
            document.querySelectorAll('#events .reveal, #Projects .reveal')
                .forEach(element => {
                    element.classList.remove('reveal');
                });
            
            // Re-observe sections
            sections.forEach(section => observer.observe(section));
        }
        
        lastScrollTop = scrollTop;
    });

    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you can add your form submission logic
        // For example, sending to a server or API
        console.log('Form submitted:', { firstName, lastName, email, message });
        
        // Optional: Show success message
        alert('Thank you for your message. We will get back to you soon!');
        
        // Reset form
        contactForm.reset();
    });

    // Only apply desktop scroll behavior if not on mobile
    if (window.innerWidth > 768) {
        // Your existing desktop scroll code remains unchanged
        let isDown = false;
        let startX;
        let scrollLeft;

        cardTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            cardTrack.classList.add('active');
            startX = e.pageX - cardTrack.offsetLeft;
            scrollLeft = cardTrack.scrollLeft;
        });

        cardTrack.addEventListener('mouseleave', () => {
            isDown = false;
            cardTrack.classList.remove('active');
        });

        cardTrack.addEventListener('mouseup', () => {
            isDown = false;
            cardTrack.classList.remove('active');
        });

        cardTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - cardTrack.offsetLeft;
            const walk = (x - startX) * 2;
            cardTrack.scrollLeft = scrollLeft - walk;
        });
    }
});

function showText(card) {
    const textElement = card.querySelector('.text');
    const hoverText = textElement.getAttribute('data-hover-text');
    textElement.textContent = hoverText;
  }
  
  function hideText(card) {
    const textElement = card.querySelector('.text');
    if (card.classList.contains('error')) {
      textElement.textContent = 'Know more about us?';
    } else if (card.classList.contains('info')) {
      textElement.textContent = 'What do we do?';
    } else if (card.classList.contains('success')) {
      textElement.textContent = 'Why Join Us??';
    } else if (card.classList.contains('warning')) {
      textElement.textContent = 'Our Vison..';
    }
  }
  