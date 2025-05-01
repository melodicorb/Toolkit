// Ultimate Student Toolkit - 3D Animation

let scene, camera, renderer;
let particles = [];
let logo, logoScene, logoCamera, logoRenderer;

// Initialize the 3D scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to DOM
    document.getElementById('animation-container').appendChild(renderer.domElement);
    
    // Create particles
    createParticles();
    
    // Create 3D logo
    createLogo();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

// Create floating particles
function createParticles() {
    const particleCount = 50;
    const colors = [
        new THREE.Color(0x9c27b0), // Purple
        new THREE.Color(0x3f51b5), // Indigo
        new THREE.Color(0xe91e63), // Pink
        new THREE.Color(0x2196f3)  // Blue
    ];
    
    for (let i = 0; i < particleCount; i++) {
        // Random size between 0.5 and 2
        const size = Math.random() * 1.5 + 0.5;
        
        // Create geometry and material
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.7
        });
        
        // Create mesh
        const particle = new THREE.Mesh(geometry, material);
        
        // Random position
        particle.position.x = Math.random() * 60 - 30;
        particle.position.y = Math.random() * 60 - 30;
        particle.position.z = Math.random() * 30 - 15;
        
        // Random movement speed
        particle.userData = {
            speedX: Math.random() * 0.05 - 0.025,
            speedY: Math.random() * 0.05 - 0.025,
            speedZ: Math.random() * 0.05 - 0.025
        };
        
        // Add to scene and particles array
        scene.add(particle);
        particles.push(particle);
    }
}

// Create 3D logo
function createLogo() {
    // Check if logo container exists
    const logoContainer = document.getElementById('logo-container');
    if (!logoContainer) return;
    
    // Create logo scene
    logoScene = new THREE.Scene();
    
    // Create logo camera
    logoCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    logoCamera.position.z = 5;
    
    // Create logo renderer
    logoRenderer = new THREE.WebGLRenderer({ alpha: true });
    logoRenderer.setSize(64, 64); // Size of the logo
    logoRenderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add logo renderer to DOM
    logoContainer.appendChild(logoRenderer.domElement);
    
    // Create logo geometry - a combination of shapes representing a student toolkit
    const baseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
    const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x3f51b5 }); // Indigo base
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.25;
    logoScene.add(base);
    
    // Book shape
    const bookGeometry = new THREE.BoxGeometry(1.5, 0.2, 1.5);
    const bookMaterial = new THREE.MeshBasicMaterial({ color: 0xe91e63 }); // Pink
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.y = -0.9;
    logoScene.add(book);
    
    // Pencil shape
    const pencilGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
    const pencilMaterial = new THREE.MeshBasicMaterial({ color: 0xffc107 }); // Amber
    const pencil = new THREE.Mesh(pencilGeometry, pencilMaterial);
    pencil.position.y = 0;
    pencil.position.x = 0.5;
    pencil.rotation.z = Math.PI / 4;
    logoScene.add(pencil);
    
    // Pencil tip
    const tipGeometry = new THREE.ConeGeometry(0.1, 0.3, 32);
    const tipMaterial = new THREE.MeshBasicMaterial({ color: 0x4caf50 }); // Green
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.y = 0.7;
    tip.position.x = 1.2;
    tip.rotation.z = Math.PI / 4;
    logoScene.add(tip);
    
    // Sphere representing a globe or atom
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x9c27b0, transparent: true, opacity: 0.8 }); // Purple
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 0;
    sphere.position.x = -0.7;
    logoScene.add(sphere);
    
    // Ring around sphere
    const ringGeometry = new THREE.TorusGeometry(0.7, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x2196f3 }); // Blue
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 0;
    ring.position.x = -0.7;
    ring.rotation.x = Math.PI / 3;
    logoScene.add(ring);
    
    // Group all logo elements
    logo = new THREE.Group();
    logoScene.add(logo);
    
    // Start logo animation
    animateLogo();
}

// Animate the 3D logo
function animateLogo() {
    requestAnimationFrame(animateLogo);
    
    // Rotate the logo
    if (logoScene) {
        logoScene.rotation.y += 0.01;
        logoScene.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
        
        // Render logo
        if (logoRenderer) logoRenderer.render(logoScene, logoCamera);
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update particle positions
    particles.forEach(particle => {
        particle.position.x += particle.userData.speedX;
        particle.position.y += particle.userData.speedY;
        particle.position.z += particle.userData.speedZ;
        
        // Rotate particle
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
        
        // Wrap around if out of bounds
        if (Math.abs(particle.position.x) > 30) particle.userData.speedX *= -1;
        if (Math.abs(particle.position.y) > 30) particle.userData.speedY *= -1;
        if (Math.abs(particle.position.z) > 15) particle.userData.speedZ *= -1;
    });
    
    // Render scene
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', init);