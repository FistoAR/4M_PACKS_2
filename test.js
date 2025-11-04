// ============================================
// PRELOADER CONTROL - SINGLE JS FILE
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("✓ DOM Loaded");

    const preloader = document.getElementById("preloader");
    const mainContent = document.querySelector('.main-content');
    const homeSection = document.querySelector('.home');

    if (!preloader) return;

    // Check if preloader has already been shown
    const preloaderShown = sessionStorage.getItem('preloaderShown');

    if (preloaderShown === 'true') {
        // Skip preloader, show content immediately
        console.log("✓ Preloader already shown - Skipping");
        preloader.style.display = "none";
        document.body.style.overflow = 'auto';
        
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.pointerEvents = 'auto';
        }
        
        triggerHomeAnimations();
        return;
    }

    // Hide main content initially
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.pointerEvents = 'none';
    }

    // Disable scroll during preloader
    document.body.style.overflow = 'hidden';

    // STEP 1: Preloader display (3 seconds)
    setTimeout(() => {
        console.log("✓ 3 seconds complete - Starting fade out");
        preloader.classList.add("fade-out");

        // STEP 2: Preloader fade (1 second)
        setTimeout(() => {
            console.log("✓ Preloader fade complete - Removing from DOM");
            preloader.style.display = "none";
            document.body.style.overflow = 'auto';

            // Mark preloader as shown
            sessionStorage.setItem('preloaderShown', 'true');

            // STEP 3: Show main content
            if (mainContent) {
                mainContent.style.opacity = '1';
                mainContent.style.pointerEvents = 'auto';
                mainContent.style.transition = 'opacity 0.5s ease-in';
            }

            // STEP 4: Reset and trigger home animations
            setTimeout(() => {
                console.log("✓ Resetting animations...");
                resetHomeAnimations();
                
                // Force browser reflow - CRITICAL!
                void document.body.offsetWidth;
                
                // Small delay then trigger animations
                setTimeout(() => {
                    console.log("✓ Starting HOME ANIMATIONS");
                    triggerHomeAnimations();
                }, 100);
                
            }, 500);

        }, 1000); // Preloader fade duration
    }, 3000); // Preloader display duration

    // ============================================
    // RESET HOME ANIMATIONS FUNCTION
    // ============================================
    function resetHomeAnimations() {
        console.log("🔄 RESETTING HOME ANIMATIONS\n");
        
        // Remove home-active class from all main elements
        const elementsToReset = [
            '.header',
            '.logo-image',
            '.background_img_home_page',
            '.home-img',
            '.circle-img'
        ];
        
        elementsToReset.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.remove('home-active');
            }
        });
        
        // Reset nav links
        const navLinks = document.querySelectorAll('.nav-links div');
        navLinks.forEach(link => link.classList.remove('home-active'));
        
        // Reset social icons
        const socialIcons = document.querySelectorAll('.socialIcons a');
        socialIcons.forEach(icon => icon.classList.remove('home-active'));
        
        // Reset text elements opacity
        const textElements = [
            '.home-img h1 .smart_poly',
            '.home-img h1 .partner_text',
            '.home-img h1 .excellence',
            '.home-img p'
        ];
        
        textElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
            }
        });
    }

    // ============================================
    // HOME ANIMATIONS FUNCTION
    // ============================================
    function triggerHomeAnimations() {
        console.log("🎬 HOME PAGE ANIMATIONS STARTED\n");

        // Main elements animation
        const mainElements = [
            { selector: '.header', delay: 0 },
            { selector: '.logo-image', delay: 200 },
            { selector: '.background_img_home_page', delay: 400 },
            { selector: '.home-img', delay: 500 },
            { selector: '.circle-img', delay: 700 }
        ];

        mainElements.forEach(elem => {
            setTimeout(() => {
                const el = document.querySelector(elem.selector);
                if (el) el.classList.add('home-active');
            }, elem.delay);
        });

        // Nav links staggered
        const navLinks = document.querySelectorAll('.nav-links div');
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('home-active');
            }, 600 + (index * 100));
        });

        // Social icons staggered
        const socialIcons = document.querySelectorAll('.socialIcons a');
        socialIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.classList.add('home-active');
            }, 1100 + (index * 100));
        });

        // Text elements
        const textElements = [
            { selector: '.home-img h1 .smart_poly', delay: 800 },
            { selector: '.home-img h1 .partner_text', delay: 1000 },
            { selector: '.home-img h1 .excellence', delay: 1200 },
            { selector: '.home-img p', delay: 1500 }
        ];

        textElements.forEach(text => {
            setTimeout(() => {
                const el = document.querySelector(text.selector);
                if (el) el.style.opacity = '1';
            }, text.delay);
        });

        console.log("✓ ALL HOME ANIMATIONS TRIGGERED");
    }

    // ============================================
    // VISIBILITY CHANGE HANDLER
    // ============================================
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log("✓ Page visible - Animations maintained");
        }
    });
});

// ============================================
// MENU, SCROLL, AND OTHER FEATURES
// ============================================
document.addEventListener("DOMContentLoaded", function(){
    const menuBar = document.querySelector('.Menu_Bar');
    const menuBarIcon = document.querySelector('.Menu_Bar i');
    const getNavLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (menuBar) {
        menuBar.addEventListener('click', function(){
            getNavLinks.classList.toggle('activeNav');
            
            navItems.forEach(e => {
                e.addEventListener('click', function(){
                    if (getNavLinks.classList.contains('activeNav')) {
                        getNavLinks.classList.remove('activeNav');
                        menuBarIcon.className = 'fa-solid fa-bars';
                    }
                });
            });

            if (getNavLinks.classList.contains('activeNav')){
                menuBarIcon.className = "fa-solid fa-x";
            } else {
                menuBarIcon.className = 'fa-solid fa-bars';
            }
        });
    }

    const headerNav = document.querySelector('.header');
    document.addEventListener('scroll', function(){
        // Sticky header code (commented out)
        // if (window.scrollY > 50){
        //     headerNav.classList.add('sticky');
        // } else {
        //     headerNav.classList.remove('sticky');
        // }
    });

    // ============================================
    // SCROLL ANIMATIONS WITH DATA ATTRIBUTE
    // ============================================
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight &&
            rect.bottom >= 0 &&
            rect.left <= windowWidth &&
            rect.right >= 0
        );
    }

    const elements = document.querySelectorAll('[data-animation]');
    elements.forEach(element => {
        element.classList.add('opacity0');
    });

    let flag = 1;
    if (flag === 1) {
        elements.forEach(element => {
            if (element.classList.contains('opacity0')) {
                flag++;
            }
        });
    }

    function handleScroll() {
        elements.forEach(element => {
            const animationClass = element.getAttribute('data-animation');
            if (isInViewport(element) && !element.classList.contains(animationClass)) {
                element.classList.add(animationClass);
                void element.offsetWidth;
                if (element.classList.contains('opacity0')) {
                    element.classList.remove('opacity0');
                }
            }
        });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // ============================================
    // SWIPER INITIALIZATION
    // ============================================
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.swiper', {
            autoplay: {
                delay: 3000,
            },
            speed: 1200,
            direction: 'horizontal',
            loop: true,
        });
    }

    // ============================================
    // SCROLL DISABLE/ENABLE FUNCTIONS
    // ============================================
    function preventDefault(e) {
        e.preventDefault();
    }

    function disableScroll() {
        const scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        window.addEventListener('wheel', preventDefault, { passive: false });
    }

    function enableScroll() {
        const scrollY = parseInt(document.body.style.top || '0', 10);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY * -1);
        window.removeEventListener('wheel', preventDefault);
    }

    // ============================================
    // CONTACT FORM INPUT LABELS
    // ============================================
    const contactInput = document.querySelectorAll('.contactInput');
    
    contactInput.forEach(function(e) {
        e.addEventListener('focus', function(){
            const label = this.previousElementSibling;
            label.style.transform = 'translate(-5%, -120%) scale(0.9)';
            
            if (this.id === 'address') {
                this.style.height = '70px';
            }
        });

        e.addEventListener('blur', function() {
            const label = this.previousElementSibling;
            
            if (this.value.trim()){
                label.style.transform = 'translate(-5%, -120%) scale(0.9)';
            } else {
                label.style.transform = 'none';
            }

            if (this.id === 'address') {
                if (this.value.trim()){
                    this.style.height = '70px';
                } else {
                    this.style.height = '';
                }
            }
        });
    });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTopBtn = document.querySelector('.backToTop');
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function(){
            window.scrollTo(0, 0);
        });

        function showBackBtn(){
            if (window.scrollY > 100) {
                backToTopBtn.classList.add('show');
            } else {
                if (backToTopBtn.classList.contains('show')){
                    backToTopBtn.classList.remove('show');
                }
            }
        }

        showBackBtn();
        document.addEventListener('scroll', showBackBtn);
    }

    // ============================================
    // ABOUT SECTION RESPONSIVE CLEANUP
    // ============================================
    var aboutHeading = document.querySelector('.centerHeading-about');
    if (window.innerWidth <= 500 && aboutHeading) {
        var brElements = aboutHeading.querySelectorAll('br');
        brElements.forEach(function(brElement) {
            aboutHeading.removeChild(brElement);
        });
    }
});

// ============================================
// WHATSAPP SHARE BUTTON
// ============================================
const whatsappBtn = document.getElementById("whatsappShareBtn");
if (whatsappBtn) {
    whatsappBtn.addEventListener("click", function () {
        const phoneNumber = "9003883411";
        const message = "Hello! 👋";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    });
}
