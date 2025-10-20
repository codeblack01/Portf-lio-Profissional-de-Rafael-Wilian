// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    particles: {
        density: 80,
        color: "#6C63FF",
        opacity: 0.5,
        speed: 2
    },
    typing: {
        texts: [
            'ideias em resultados digitais.',
            'visitas em vendas.',
            'seguidores em clientes.',
            'tráfego em conversão.',
            'conteúdo em engajamento.',
            'projetos em sucesso.'
        ],
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000
    },
    scroll: {
        autoScrollSpeed: 50,
        headerScrollThreshold: 100
    }
};

// ===== SISTEMA DE GERENCIAMENTO DE ESTADO =====
class AppState {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.scrollPosition = 0;
        this.activeSection = 'home';
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleResize();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleResize() {
        this.isMobile = window.innerWidth <= 768;
        this.updateMobileFeatures();
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        this.updateActiveSection();
        this.updateHeaderState();
    }

    updateMobileFeatures() {
        // Evitar manipular display inline para não esconder conteúdos por engano
        document.body.classList.toggle('mobile-optimized', this.isMobile);
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section');
        let newActiveSection = this.activeSection;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                newActiveSection = section.id;
            }
        });

        if (newActiveSection !== this.activeSection) {
            this.activeSection = newActiveSection;
            this.onSectionChange(newActiveSection);
        }
    }

    updateHeaderState() {
        const header = document.getElementById('header');
        if (!header) return;
        if (this.scrollPosition > CONFIG.scroll.headerScrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    onSectionChange(sectionId) {
        // Disparar eventos personalizados quando a seção muda
        const event = new CustomEvent('sectionChange', { 
            detail: { section: sectionId } 
        });
        document.dispatchEvent(event);
        
        // Atualizar navegação
        this.updateNavigation(sectionId);
    }

    updateNavigation(sectionId) {
        // Atualizar links da navegação desktop
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Atualizar navegação mobile
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
            }
        });
    }
}

// ===== SISTEMA DE PARTICULAS AVANÇADO =====
class ParticlesManager {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (typeof particlesJS !== 'undefined') {
            this.setupParticles();
        } else {
            // Carregar particles.js dinamicamente se não estiver disponível
            this.loadParticlesJS();
        }
    }

    setupParticles() {
        const isMobile = window.innerWidth <= 768;

        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: isMobile ? Math.round(CONFIG.particles.density * 0.5) : CONFIG.particles.density, 
                    density: { enable: true, value_area: 800 } 
                },
                color: { value: CONFIG.particles.color },
                shape: { type: "circle" },
                opacity: { 
                    value: CONFIG.particles.opacity, 
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: { 
                    value: 3, 
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                line_linked: {
                    enable: !isMobile,
                    distance: 150,
                    color: CONFIG.particles.color,
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: isMobile ? Math.max(1, CONFIG.particles.speed * 0.6) : CONFIG.particles.speed,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: true, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { 
                        enable: true, 
                        mode: "repulse" 
                    },
                    onclick: { 
                        enable: true, 
                        mode: "push" 
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });

        this.isInitialized = true;

        // Ajustar densidade em resize
        window.addEventListener('resize', () => {
            const density = window.innerWidth <= 768
                ? Math.round(CONFIG.particles.density * 0.5)
                : CONFIG.particles.density;
            this.updateDensity(density);
        });
    }

    loadParticlesJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = () => this.setupParticles();
        document.head.appendChild(script);
    }

    updateDensity(density) {
        if (this.isInitialized) {
            pJS.particles.number.value = density;
            pJS.fn.particlesRefresh();
        }
    }
}

// ===== SISTEMA DE CURSOR AVANÇADO =====
class AdvancedCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.interactiveElements = document.querySelectorAll('a, button, .service-card, .dashboard-card, .portfolio-item, .manychat-card, .manychat-feature, .btn, [data-cursor]');
        this.isHidden = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupInteractiveElements();
        this.hideOnMobile();
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', () => this.show());
        document.addEventListener('mouseleave', () => this.hide());
        
        // Eventos de toque para mobile
        document.addEventListener('touchstart', () => this.hide());
        document.addEventListener('touchend', () => this.show());
    }

    onMouseMove(e) {
        if (this.isHidden) return;

        const { clientX: x, clientY: y } = e;
        
        // Cursor principal (instantâneo)
        this.cursor.style.left = x + 'px';
        this.cursor.style.top = y + 'px';
        
        // Cursor follower (com delay suave)
        requestAnimationFrame(() => {
            this.follower.style.left = x + 'px';
            this.follower.style.top = y + 'px';
        });
    }

    setupInteractiveElements() {
        this.interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.onElementHover(element));
            element.addEventListener('mouseleave', () => this.onElementLeave());
            
            // Adicionar atributo para estilização CSS
            element.setAttribute('data-cursor-interactive', 'true');
        });
    }

    onElementHover(element) {
        if (this.isHidden) return;

        const cursorType = element.getAttribute('data-cursor') || 'default';
        
        this.cursor.style.transform = 'scale(1.5)';
        this.follower.style.transform = 'scale(1.2)';
        this.follower.style.borderColor = 'var(--primary)';
        
        // Efeitos específicos baseados no tipo de elemento
        switch(cursorType) {
            case 'link':
                this.follower.style.transform = 'scale(1.3)';
                break;
            case 'button':
                this.follower.style.transform = 'scale(1.4)';
                break;
            case 'image':
                this.follower.style.transform = 'scale(2)';
                this.follower.style.opacity = '0.5';
                break;
        }
    }

    onElementLeave() {
        if (this.isHidden) return;

        this.cursor.style.transform = 'scale(1)';
        this.follower.style.transform = 'scale(1)';
        this.follower.style.borderColor = 'rgba(108, 99, 255, 0.3)';
        this.follower.style.opacity = '1';
    }

    show() {
        this.isHidden = false;
        this.cursor.style.opacity = '1';
        this.follower.style.opacity = '1';
    }

    hide() {
        this.isHidden = true;
        this.cursor.style.opacity = '0';
        this.follower.style.opacity = '0';
    }

    hideOnMobile() {
        if (window.innerWidth <= 768) {
            this.hide();
        }
    }
}

// ===== SISTEMA DE ANIMAÇÕES E EFEITOS =====
class AnimationManager {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupAOS();
    }

    setupAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                mirror: false,
                disable: window.innerWidth <= 768
            });
        }
    }

    setupScrollAnimations() {
        // Observer para elementos que entram na viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateOnScroll(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observar elementos com data-animate
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    animateOnScroll(element) {
        const animationType = element.getAttribute('data-animate');
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        switch(animationType) {
            case 'fade-up':
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-down':
                element.style.transform = 'translateY(0)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(0)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(0)';
                break;
            case 'scale':
                element.style.transform = 'scale(1)';
                break;
        }
    }

    setupHoverEffects() {
        // Efeito de brilho pulsante em elementos importantes
        const importantElements = document.querySelectorAll('.btn-primary, .service-tag.experience-tag, .whatsapp-float');
        importantElements.forEach(element => {
            element.classList.add('pulse-glow');
        });

        // Efeito de brilho em textos importantes
        const textGlowElements = document.querySelectorAll('h1, h2, .typing-text');
        textGlowElements.forEach(element => {
            element.classList.add('text-glow');
        });

        // Elementos de motion design
        const motionElements = document.querySelectorAll('.service-icon, .dashboard-icon, .manychat-feature i');
        motionElements.forEach(element => {
            element.classList.add('motion-element');
        });

        // Efeito de brilho nos cards
        const glowCards = document.querySelectorAll('.service-card, .dashboard-card, .portfolio-item, .manychat-card, .manychat-feature');
        glowCards.forEach(card => {
            card.classList.add('glow-effect');
        });
    }

    addParallaxEffect(element, speed = 0.5) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * speed;
            element.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ===== SISTEMA DE TYPING EFFECT AVANÇADO =====
class AdvancedTypingEffect {
    constructor() {
        this.typingText = document.querySelector('.typing-text');
        this.textArray = CONFIG.typing.texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.init();
    }

    init() {
        if (this.typingText) {
            // Iniciar com delay
            setTimeout(() => this.type(), 1000);
            
            // Pausar quando não estiver visível
            this.setupVisibilityHandler();
        }
    }

    type() {
        if (this.isPaused) {
            setTimeout(() => this.type(), 100);
            return;
        }

        const currentText = this.textArray[this.textIndex];
        
        if (this.isDeleting) {
            this.typingText.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.typingText.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = CONFIG.typing.typeSpeed;

        if (this.isDeleting) {
            typeSpeed = CONFIG.typing.deleteSpeed;
        }

        // Velocidade variável baseada na posição do caractere
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.typing.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.textArray.length;
            typeSpeed = 500; // Pausa antes de começar novo texto
        }

        // Efeito de cursor piscando
        this.updateCursor();

        setTimeout(() => this.type(), typeSpeed);
    }

    updateCursor() {
        const cursorVisible = !this.isDeleting || this.charIndex > 0;
        this.typingText.style.borderRight = cursorVisible ? '3px solid var(--accent)' : '3px solid transparent';
    }

    setupVisibilityHandler() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isPaused = !entry.isIntersecting;
                if (!this.isPaused && this.charIndex === 0) {
                    this.updateCursor();
                }
            });
        });

        observer.observe(this.typingText);
    }

    addText(newText) {
        this.textArray.push(newText);
    }

    clearTexts() {
        this.textArray = [];
    }
}

// ===== SISTEMA DE NAVEGAÇÃO AVANÇADO =====
class NavigationManager {
    constructor() {
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelector('.nav-links');
        this.mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupNavigationEvents();
    }

    setupMobileMenu() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Fechar menu ao clicar em links
        document.querySelectorAll('.nav-links a, .mobile-nav-item').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.navLinks || !this.mobileMenu) return;
            if (this.isMenuOpen && !this.navLinks.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.navLinks.classList.toggle('active');
        this.mobileMenu.querySelector('i').className = 
            this.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        
        // Prevenir scroll do body quando menu está aberto
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navLinks.classList.remove('active');
        this.mobileMenu.querySelector('i').className = 'fas fa-bars';
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const header = document.getElementById('header');
                    const offsetTop = targetElement.getBoundingClientRect().top
                        + window.pageYOffset
                        - (header ? header.offsetHeight : 0);

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    anchor.classList.add('loading');
                    setTimeout(() => anchor.classList.remove('loading'), 1000);
                }
            });
        });
    }

    setupNavigationEvents() {
        // Atualizar navegação baseada no scroll
        document.addEventListener('sectionChange', (e) => {
            this.updateActiveNavigation(e.detail.section);
        });
    }

    updateActiveNavigation(sectionId) {
        // Atualizar todos os itens de navegação
        const allNavItems = document.querySelectorAll('.nav-links a, .mobile-nav-item');
        
        allNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
            }
        });
    }
}

// ===== SISTEMA DE FORMULÁRIO AVANÇADO =====
class FormManager {
    constructor() {
        // Formulário removido - stub sem lógica
        this.contactForm = null;
    }

    validateForm() {
        if (!this.contactForm) return;
        const inputs = this.contactForm.querySelectorAll('input, textarea');
    }
}

// ===== SISTEMA DE PORTFÓLIO INTERATIVO =====
class PortfolioManager {
    constructor() {
        this.filters = document.querySelectorAll('.portfolio-filter');
        this.items = document.querySelectorAll('.portfolio-item');
        this.modal = document.getElementById('projectModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalClose = document.getElementById('modalClose');
        this.init();
    }

    init() {
        this.setupFiltering();
        this.setupModal();
        this.setupHoverEffects();
    }

    setupFiltering() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Animação de clique
                filter.style.transform = 'scale(0.95)';
                setTimeout(() => filter.style.transform = 'scale(1)', 150);
                
                this.handleFilterClick(filter);
            });
        });
    }

    handleFilterClick(clickedFilter) {
        // Atualizar filtros ativos
        this.filters.forEach(f => f.classList.remove('active'));
        clickedFilter.classList.add('active');
        
        const filterValue = clickedFilter.getAttribute('data-filter');
        
        // Animação de filtragem
        this.filterItems(filterValue);
    }

    filterItems(filterValue) {
        this.items.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filterValue === 'all' || category === filterValue;
            
            if (shouldShow) {
                // Animação de entrada
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                }, index * 100);
            } else {
                // Animação de saída
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    setupModal() {
        // Abrir modal
        this.items.forEach(item => {
            item.addEventListener('click', () => {
                const imageSrc = item.querySelector('.portfolio-image').getAttribute('src');
                const projectTitle = item.querySelector('h3').textContent;
                const projectDesc = item.querySelector('p').textContent;
                
                this.openModal(imageSrc, projectTitle, projectDesc);
            });
        });

        // Fechar modal
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(imageSrc, title, description) {
        this.modalImage.setAttribute('src', imageSrc);
        this.modalImage.setAttribute('alt', title);
        
        // Adicionar informações do projeto se não existirem
        let infoDiv = this.modal.querySelector('.modal-info');
        if (!infoDiv) {
            infoDiv = document.createElement('div');
            infoDiv.className = 'modal-info';
            this.modal.querySelector('.modal-content').appendChild(infoDiv);
        }
        
        infoDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
        `;
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animação de entrada
        setTimeout(() => {
            this.modal.querySelector('.modal-content').style.transform = 'scale(1)';
            this.modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }

    closeModal() {
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    setupHoverEffects() {
        this.items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// ===== SISTEMA DE SLIDER AUTOMÁTICO =====
class AutoSlider {
    constructor() {
        this.slider = document.querySelector('.projects-slider');
        this.scrollAmount = 0;
        this.isPaused = false;
        this.init();
    }

    init() {
        if (this.slider) {
            // Evita auto-scroll em mobile
            if (window.innerWidth <= 768) {
                return;
            }
            this.setupAutoScroll();
            this.setupPauseOnHover();
            this.setupTouchSupport();
        }
    }

    setupAutoScroll() {
        // Iniciar auto-scroll após carregamento
        setTimeout(() => {
            this.startAutoScroll();
        }, 3000);
    }

    startAutoScroll() {
        const scroll = () => {
            if (this.isPaused) {
                requestAnimationFrame(scroll);
                return;
            }

            if (this.scrollAmount >= this.slider.scrollWidth - this.slider.clientWidth) {
                this.scrollAmount = 0;
                // Transição suave para o início
                this.slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                this.scrollAmount += 0.5;
                this.slider.scrollLeft = this.scrollAmount;
            }

            requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);
    }

    setupPauseOnHover() {
        this.slider.addEventListener('mouseenter', () => {
            this.isPaused = true;
        });

        this.slider.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });
    }

    setupTouchSupport() {
        let isDragging = false;
        let startX;
        let scrollLeft;

        this.slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - this.slider.offsetLeft;
            scrollLeft = this.slider.scrollLeft;
            this.slider.style.cursor = 'grabbing';
        });

        this.slider.addEventListener('mouseleave', () => {
            isDragging = false;
            this.slider.style.cursor = 'grab';
        });

        this.slider.addEventListener('mouseup', () => {
            isDragging = false;
            this.slider.style.cursor = 'grab';
        });

        this.slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.slider.offsetLeft;
            const walk = (x - startX) * 2;
            this.slider.scrollLeft = scrollLeft - walk;
        });

        // Suporte para touch
        this.slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - this.slider.offsetLeft;
            scrollLeft = this.slider.scrollLeft;
        });

        this.slider.addEventListener('touchend', () => {
            isDragging = false;
        });

        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - this.slider.offsetLeft;
            const walk = (x - startX) * 2;
            this.slider.scrollLeft = scrollLeft - walk;
        });
    }
}

// ===== SISTEMA DE VÍDEO OTIMIZADO =====
class VideoManager {
    constructor() {
        this.videos = document.querySelectorAll('video');
        this.init();
    }

    init() {
        this.setupVideoOptimizations();
        this.setupLazyLoading();
    }

    setupVideoOptimizations() {
        this.videos.forEach(video => {
            // Configurações para performance
            video.preload = 'metadata';
            video.playsInline = true;
            
            // Controles para vídeos não autoplay
            if (!video.hasAttribute('autoplay')) {
                video.setAttribute('controls', 'true');
            }

            // Event listeners para melhor UX
            video.addEventListener('click', () => this.togglePlay(video));
            video.addEventListener('loadeddata', () => this.onVideoLoaded(video));
        });

        // Configurar vídeos de autoplay
        const autoplayVideos = document.querySelectorAll('.manychat-media video, .videos-grid video');
        autoplayVideos.forEach(video => {
            this.setupAutoplayVideo(video);
        });
    }

    setupAutoplayVideo(video) {
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('loop', 'true');
        video.setAttribute('playsinline', 'true');
        video.removeAttribute('controls');

        // Tentar reproduzir e tratar erros
        video.play().catch(function(error) {
            console.log('Autoplay prevented:', error);
            // Fallback: mostrar controles se autoplay falhar
            video.setAttribute('controls', 'true');
        });
    }

    togglePlay(video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    onVideoLoaded(video) {
        // Adicionar classe quando o vídeo estiver carregado
        video.classList.add('video-loaded');
        
        // Mostrar thumbnail personalizada se disponível
        const poster = video.getAttribute('poster');
        if (poster) {
            video.style.backgroundImage = `url(${poster})`;
            video.style.backgroundSize = 'cover';
            video.style.backgroundPosition = 'center';
        }
    }

    setupLazyLoading() {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    videoObserver.unobserve(video);
                }
            });
        }, { threshold: 0.1 });

        // Observar vídeos fora da viewport inicial
        this.videos.forEach(video => {
            if (!this.isInViewport(video)) {
                videoObserver.observe(video);
            }
        });
    }

    loadVideo(video) {
        const sources = video.querySelectorAll('source');
        sources.forEach(source => {
            const src = source.getAttribute('data-src');
            if (src) {
                source.setAttribute('src', src);
            }
        });
        
        video.load();
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// ===== SISTEMA DE PERFORMANCE E OTIMIZAÇÃO =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.optimizeAnimations();
        this.setupResourceManagement();
        this.optimizeImages();
    }

    optimizeImages() {
        const imgs = document.querySelectorAll('img');
        imgs.forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        });
    }

    setupPerformanceMonitoring() {
        // Monitorar FPS
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Reduzir animações se FPS estiver baixo
                if (fps < 30) {
                    this.reduceAnimations();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        checkFPS();
    }

    reduceAnimations() {
        document.body.classList.add('reduced-motion');

        // Reduz partículas ao detectar FPS baixo
        if (typeof pJS !== 'undefined') {
            try {
                pJS.particles.move.speed = 0.5;
                pJS.particles.line_linked.enable = false;
                pJS.fn.particlesRefresh();
            } catch (e) {
                // silencioso
            }
        }
    }

    optimizeAnimations() {
        // Usar transform e opacity para animações mais suaves
        const style = document.createElement('style');
        style.textContent = `
            .service-card, .dashboard-card, .portfolio-item {
                will-change: transform, opacity;
            }
            
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupResourceManagement() {
        // Limpar event listeners quando não forem mais necessários
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    cleanup() {
        // Limpar timeouts e intervals
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    }
}

// ===== SISTEMA DE NOTIFICAÇÃO =====
class Notifier {
    constructor() {
        this.el = document.getElementById('toast-notification');
        if (!this.el) {
            this.el = document.createElement('div');
            this.el.id = 'toast-notification';
            this.el.className = 'toast';
            this.el.setAttribute('role', 'status');
            this.el.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.el);
        }
        this.hideTimer = null;
    }

    show(message, type = 'success', duration = 2500) {
        this.el.textContent = message;
        this.el.classList.remove('toast--success', 'toast--error');
        this.el.classList.add(type === 'error' ? 'toast--error' : 'toast--success');
        this.el.classList.add('toast--show');
        clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(() => {
            this.el.classList.remove('toast--show');
        }, duration);
    }
}

// ===== SISTEMA DE CTA DO WHATSAPP =====
class WhatsAppCTA {
    constructor() {
        this.notifier = new Notifier();
        this.selectors = ['a.js-whatsapp', 'button.js-whatsapp', 'a[href*="wa.me"]'];
        this.links = document.querySelectorAll(this.selectors.join(','));
        this.bindEvents();
    }

    bindEvents() {
        this.links.forEach((el) => {
            el.addEventListener('click', (e) => {
                const href = el.getAttribute('href') || el.dataset.whatsapp || el.dataset.href;
                if (!href) return;

                const win = window.open(href, '_blank', 'noopener');

                e.preventDefault();
                this.notifier.show('Tudo certo! Abrimos o WhatsApp para você.', 'success');

                if (!win) {
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            }, { passive: false });
        });
    }
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            // Essenciais
            this.modules.state = new AppState();
            this.modules.performance = new PerformanceOptimizer();
            this.modules.navigation = new NavigationManager();
            this.modules.whatsapp = new WhatsAppCTA();

            const isMobile = this.modules.state?.isMobile ?? (window.innerWidth <= 768);

            // Mobile: inicia já, sem esperar ocioso
            if (isMobile) {
                document.body.classList.add('mobile-optimized');

                // Módulos essenciais no mobile
                this.modules.portfolio = new PortfolioManager();
                this.modules.video = new VideoManager();

                // Otimizações leves
                this.modules.performance.reduceAnimations?.();
                this.modules.performance.optimizeImages?.();

                console.log('📱 Mobile pronto com módulos essenciais!');
                document.dispatchEvent(new CustomEvent('appReady'));
                return;
            }

            // Desktop: adiar módulos pesados para ocioso
            const initHeavy = () => {
                this.modules.particles = new ParticlesManager();
                this.modules.cursor = new AdvancedCursor();
                this.modules.animations = new AnimationManager();
                this.modules.typing = new AdvancedTypingEffect();
                this.modules.portfolio = new PortfolioManager();
                this.modules.slider = new AutoSlider();
                this.modules.video = new VideoManager();

                console.log('💻 Desktop pronto com módulos visuais!');
                document.dispatchEvent(new CustomEvent('appReady'));
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(initHeavy, { timeout: 1500 });
            } else {
                setTimeout(initHeavy, 0);
            }
        } catch (error) {
            console.error('❌ Erro na inicialização da aplicação:', error);
        }
    }

    // Método para acessar módulos externamente
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    // Método para adicionar novos módulos
    addModule(name, moduleClass) {
        this.modules[name] = new moduleClass();
    }
}

// ===== INICIALIZAR APLICAÇÃO =====
// Criar instância global da aplicação
window.TimeUpApp = new App();

// Exportar para uso em outros arquivos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        AppState,
        ParticlesManager,
        AdvancedCursor,
        AnimationManager,
        AdvancedTypingEffect,
        NavigationManager,
        FormManager,
        PortfolioManager,
        AutoSlider,
        VideoManager,
        PerformanceOptimizer
    };
}