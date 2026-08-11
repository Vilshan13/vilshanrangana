const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

const frameCount = 192; // We extracted 192 frames
const currentFrame = index => (
  `frames/frame_${index.toString().padStart(4, '0')}.jpg`
);

const images = [];

// Preload all images for smooth animation
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Preload first image and set canvas dimensions when it's loaded
images[0].onload = () => {
    canvas.width = images[0].width;
    canvas.height = images[0].height;
    context.drawImage(images[0], 0, 0);
};

// Use requestAnimationFrame for smooth scrolling
let tick = false;

window.addEventListener('scroll', () => {
    if (!tick) {
        window.requestAnimationFrame(() => {
            const scrollTop = document.documentElement.scrollTop;
            const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
            
            // Calculate progress (0 to 1)
            const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
            
            // Map progress to frame index (0 to 191)
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );
            
            // Draw the current frame if it has finished loading
            if (images[frameIndex] && images[frameIndex].complete) {
                context.drawImage(images[frameIndex], 0, 0);
            }
            
            tick = false;
        });
        tick = true;
    }
});
