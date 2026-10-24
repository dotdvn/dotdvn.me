document.addEventListener('DOMContentLoaded', () => {

    const parallaxSection = document.querySelector('.parallax-section');
    const parallaxText = document.querySelector('.parallax-text');

    if (parallaxSection && parallaxText) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const sectionTop = parallaxSection.offsetTop;
            const sectionHeight = parallaxSection.offsetHeight;
            const windowHeight = window.innerHeight;

            if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                const relativeScroll = scrollY - sectionTop + (windowHeight / 2);

                const yPos = relativeScroll * 0.15;
                parallaxText.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
});
