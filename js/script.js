const terminalText = document.getElementById('terminal-text');
const terminalScreen = document.getElementById('terminal-screen');
const mainContent = document.getElementById('main-content');
const startBtn = document.getElementById('start-btn');
const bgMusic = document.getElementById('bg-music');

const messages = [
    "> Iniciando protocolo de conexión...",
    "> Enlazando servidor Chile - Brasil...",
    "> Objetivo localizado: Macaco.",
    "> Evaluando pasos geis...",
    "> Error: Fecha de aniversario esperada 6 de noviembre.",
    "> Shu...",
    "> Limpiando lagrimas de Zareks...",
    "> Recuperando archivos...",
    "> Todo listo, minha senhora."
];

let msgIndex = 0;

function typeMessage(text, callback) {
    let i = 0;
    const p = document.createElement('p');
    terminalText.appendChild(p);
    
    // TIEMPO SÚPER RÁPIDO PARA LA TERMINAL
    const interval = setInterval(() => {
        p.textContent += text.charAt(i);
        i++;
        if (i > text.length - 1) {
            clearInterval(interval);
            setTimeout(callback, 150); 
        }
    }, 10); 
}

function runTerminal() {
    if (msgIndex < messages.length) {
        typeMessage(messages[msgIndex], () => {
            msgIndex++;
            runTerminal();
        });
    } else {
        startBtn.classList.remove('hidden');
    }
}

window.onload = () => {
    runTerminal();
    updateCounter(); // Inicializamos el reloj interno
};

startBtn.addEventListener('click', () => {
    const flash = document.getElementById('flash-overlay');
    flash.classList.remove('hidden');
    flash.classList.add('flash-animation');
    
    bgMusic.play().catch(e => console.log("Error al reproducir audio:", e));
    
    setTimeout(() => {
        terminalScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        initCanvas();
        startPhotosLoop(); 
    }, 300);
    
    setTimeout(() => {
        flash.classList.add('hidden');
        flash.classList.remove('flash-animation');
    }, 2000);
});

// --- LÓGICA DEL CONTADOR DE TIEMPO ---
function updateCounter() {
    const startDate = new Date('2021-10-22T00:00:00');
    const now = new Date();
    
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
    }
    if (months < 0) { months += 12; years--; }

    let weeks = Math.floor(days / 7);
    let remainingDays = days % 7;

    const counterElement = document.getElementById('time-counter');
    if (counterElement) {
        counterElement.innerHTML = `${years} años, ${months} meses, ${weeks} semanas, <br> ${remainingDays} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos a tu lado.`;
    }
}
// Actualiza el contador cada segundo
setInterval(updateCounter, 1000);

// --- LÓGICA DE FOTOS FLOTANTES (UNA POR UNA, SÓLO BORDES) ---
function spawnPhoto() {
    const container = document.getElementById('floating-photos-container');
    const totalPhotos = 30; 
    const img = document.createElement('img');
    const randomId = Math.floor(Math.random() * totalPhotos) + 1;
    
    img.src = `assets/foto${randomId}.jpg`; 
    img.classList.add('floating-photo');
    
    const isLeft = Math.random() > 0.5;
    const posX = isLeft ? (Math.random() * 8 + 2) : (Math.random() * 8 + 80); 
    img.style.left = `${posX}vw`;
    
    const size = Math.random() * 60 + 100; 
    img.style.width = `${size}px`;
    img.style.height = `${size}px`; 
    
    const duration = Math.random() * 15 + 20; 
    img.style.animationDuration = `${duration}s`;
    
    container.appendChild(img);

    setTimeout(() => {
        img.remove();
    }, duration * 1000); 
}

function startPhotosLoop() {
    spawnPhoto();
    setInterval(spawnPhoto, 4000);
}

// --- LÓGICA DE CONSTELACIONES EN CANVAS ---
function initCanvas() {
    const canvas = document.getElementById('constellation-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 80;
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('touchmove', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        update() {
            this.x += this.speedX; this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }

    for (let i = 0; i < numParticles; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(136, 187, 255, ${1 - distance/120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            if (mouse.x != null) {
                const dxMouse = particles[i].x - mouse.x;
                const dyMouse = particles[i].y - mouse.y;
                const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distanceMouse < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distanceMouse/150})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}