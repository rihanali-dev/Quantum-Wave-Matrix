const canvas = document.getElementById('hypnoCanvas');
const ctx = canvas.getContext('2d');

const cols = 22;
const rows = 12;
const spacingX = canvas.width / (cols - 1);
const spacingY = canvas.height / (rows - 1);

let angle = 0;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Track mouse interaction over the card canvas
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
});

function renderWave() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let baseX = c * spacingX;
            let baseY = r * spacingY;

            // Distance from mouse for interactive ripple effect
            let distX = baseX - mouseX;
            let distY = baseY - mouseY;
            let distance = Math.sqrt(distX * distX + distY * distY);

            // Wave math equation combining time and mouse distance
            let waveOffset = Math.sin(distance * 0.05 - angle * 3) * 8;
            
            let x = baseX;
            let y = baseY + waveOffset;

            // Dynamic size and glow based on wave height
            let size = 2 + Math.sin(angle + c * 0.3) * 2;
            let alpha = 0.3 + (waveOffset + 8) / 16 * 0.7;

            // Draw glowing connecting lines to neighbors
            if (c < cols - 1) {
                let nextX = (c + 1) * spacingX;
                let nextY = baseY + Math.sin(Math.sqrt(Math.pow((c + 1) * spacingX - mouseX, 2) + Math.pow(baseY - mouseY, 2)) * 0.05 - angle * 3) * 8;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, nextY);
                ctx.strokeStyle = `rgba(255, 202, 123, ${alpha * 0.25})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw Particle Nodes
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1, size), 0, Math.PI * 2);
            ctx.fillStyle = alpha > 0.6 ? '#ffffff' : '#ffca7b';
            ctx.shadowColor = '#ff9900';
            ctx.shadowBlur = alpha > 0.6 ? 12 : 4;
            ctx.fill();
        }
    }

    angle += 0.04;
    requestAnimationFrame(renderWave);
}

requestAnimationFrame(renderWave);