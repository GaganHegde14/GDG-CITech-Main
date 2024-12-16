document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get("event"); // Get event name from URL query parameter

    // Fetch the corresponding event data from the hidden section
    const eventDataDiv = document.getElementById(`event-${eventName}`);
    if (eventDataDiv) {
        // Populate Event Title
        const eventTitle = eventDataDiv.querySelector("h1").innerText;
        document.getElementById("event-title").innerText = eventTitle;

        // Populate Event Description
        const eventDescriptionContainer = document.getElementById("event-description");
        const descriptionElements = eventDataDiv.querySelectorAll("p, ul");
        descriptionElements.forEach((element) => {
            eventDescriptionContainer.appendChild(element.cloneNode(true));
        });

        // Populate Event Images
        const imageContainer = document.querySelector(".image-gallery");
        const images = eventDataDiv.querySelectorAll(".event-images img");
        images.forEach((img) => {
            const clonedImage = img.cloneNode(true);
            imageContainer.appendChild(clonedImage);
        });

        // Set the Button Action
        const downloadButton = document.querySelector(".download-button");
        const eventButton = eventDataDiv.querySelector("button.download-button");
        if (eventButton) {
            downloadButton.setAttribute("onclick", eventButton.getAttribute("onclick"));
        }
    } else {
        // Handle case where event is not found
        document.getElementById("event-title").innerText = "Event Not Found";
        document.getElementById("event-description").innerText = "Sorry, this event does not exist.";
    }
});


// particles
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