document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll(
        '.hero-content, .hero-image, .section-header, .service-card, .project-card, .process-step, .timeline-item, .skill-category, .learning-card, .contact-content'
    );

    animateElements.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // --- Scroll-based Frame Animation ---
    const canvas = document.getElementById('scroll-animation');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 192;
        
        // Set fixed canvas size based on frame dimensions (1280x720)
        // CSS object-fit: cover will handle scaling it to the screen
        canvas.width = 1280;
        canvas.height = 720;

        const currentFrame = index => (
            `frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
        );

        const images = [];
        let framesLoaded = 0;

        // Preload frames
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                framesLoaded++;
                // Draw the initial frame once it's loaded if we're at the top
                if (i === frameIndex && lastDrawnFrameIndex !== frameIndex) {
                    context.drawImage(img, 0, 0);
                    lastDrawnFrameIndex = frameIndex;
                }
            };
            img.onerror = () => {
                console.error(`Failed to load frame: ${img.src}`);
            };
            images.push(img);
        }

        // Scroll Logic
        let scrollFraction = 0;
        let frameIndex = 0;

        const updateScroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            const maxScrollTop = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            
            // Calculate progress (from 0 to 1)
            scrollFraction = scrollTop / maxScrollTop;
            
            if (isNaN(scrollFraction)) scrollFraction = 0;

            // Map progress to frame index
            frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );
        };

        window.addEventListener('scroll', updateScroll);
        window.addEventListener('resize', updateScroll);
        updateScroll(); // Initialize on load

        // Animation Loop using requestAnimationFrame
        // We track the last drawn frame so we don't redraw unnecessarily
        let lastDrawnFrameIndex = -1;
        
        const updateImage = () => {
            if (frameIndex !== lastDrawnFrameIndex) {
                const img = images[frameIndex];
                if (img && img.complete && img.naturalWidth > 0) { 
                    context.drawImage(img, 0, 0);
                    lastDrawnFrameIndex = frameIndex;
                }
            }
            requestAnimationFrame(updateImage);
        };

        // Start drawing loop
        requestAnimationFrame(updateImage);
    }
});
