/**
 * Creative Thoughts Informatics
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const header = document.querySelector('.ct_header');
    const menuToggle = document.querySelector('.ct_menu_toggle');
    const navMenu = document.querySelector('.ct_nav_menu');
    const drawerClose = document.querySelector('.ct_drawer_close');
    const navBackdrop = document.querySelector('.ct_nav_backdrop');
    const navLinks = document.querySelectorAll('.ct_nav_link');

    // 1. Sticky Header on Scroll
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header?.classList.add('ct_sticky');
        } else {
            header?.classList.remove('ct_sticky');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. Open & Close Mobile Right-Side Drawer
    const openMenu = () => {
        menuToggle?.classList.add('active');
        navMenu?.classList.add('ct_menu_open');
        navBackdrop?.classList.add('ct_show');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        menuToggle?.classList.remove('active');
        navMenu?.classList.remove('ct_menu_open');
        navBackdrop?.classList.remove('ct_show');
        document.body.style.overflow = '';
    };

    menuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu?.classList.contains('ct_menu_open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    drawerClose?.addEventListener('click', closeMenu);
    navBackdrop?.addEventListener('click', closeMenu);

    // Close menu when clicking any nav link on mobile (<= 1199px)
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1199) {
                closeMenu();
            }
        });
    });

    // Close menu if window is resized above 1199px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1199 && navMenu?.classList.contains('ct_menu_open')) {
            closeMenu();
        }
    });

    // ESC key closes mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('ct_menu_open')) {
            closeMenu();
        }
    });

    // 3. Smooth Number Counter Animation on Scroll (Per Section)
    const initCounters = () => {
        const counterSections = document.querySelectorAll('.ct_hero_section, .ct_clients_say_section, [data-counter-section]');
        const allCounters = document.querySelectorAll('.ct_counter');
        if (!allCounters.length) return;

        const animateSingleCounter = (counter) => {
            if (counter.dataset.animated === 'true') return;
            counter.dataset.animated = 'true';

            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            const isComma = counter.getAttribute('data-format') === 'comma';
            const duration = target > 2000 ? 1800 : 1200; // smooth timing
            let startTimestamp = null;

            const formatValue = (val) => {
                return isComma ? val.toLocaleString('en-US') : val.toString();
            };

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const elapsed = timestamp - startTimestamp;
                const progress = Math.min(elapsed / duration, 1);

                // easeOutCubic curve for smooth slowing down at end
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeProgress * target);

                counter.textContent = formatValue(currentVal);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.textContent = formatValue(target);
                }
            };

            window.requestAnimationFrame(step);
        };

        if ('IntersectionObserver' in window && counterSections.length) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.ct_counter');
                        counters.forEach((c) => animateSingleCounter(c));
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

            counterSections.forEach((section) => observer.observe(section));
        } else {
            // Fallback: animate all counters directly
            allCounters.forEach((c) => animateSingleCounter(c));
        }
    };

    initCounters();

    // 4. Infinite Smooth Brand Logos Swiper Slider
    const initBrandSlider = () => {
        if (typeof Swiper === 'undefined') return;

        const sliderElement = document.querySelector('.ct_brand_slider');
        if (!sliderElement) return;

        if (window.ctBrandSwiper && typeof window.ctBrandSwiper.destroy === 'function') {
            window.ctBrandSwiper.destroy(true, true);
        }

        window.ctBrandSwiper = new Swiper('.ct_brand_slider', {
            slidesPerView: 'auto',
            spaceBetween: 55,
            loop: true,
            loopAdditionalSlides: 8,
            speed: 5000,
            allowTouchMove: false,
            observer: true,
            observeParents: true,
            resizeObserver: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
            },
            breakpoints: {
                320: {
                    spaceBetween: 30,
                    speed: 4000,
                },
                768: {
                    spaceBetween: 45,
                    speed: 4500,
                },
                1200: {
                    spaceBetween: 60,
                    speed: 5000,
                }
            }
        });
    };

    initBrandSlider();

    // 5. Stacking Cards Overlay Animation with GSAP & ScrollTrigger
    let updateStickyTopFn = null;

    const initStackingCards = () => {
        const cards = document.querySelectorAll('.ct_stack_card');
        const section = document.querySelector('.ct_solve_problems_section');
        if (!cards.length || !section) return;

        let isTicking = false;
        let stickyTop = 115;

        updateStickyTopFn = () => {
            stickyTop = parseFloat(window.getComputedStyle(cards[0]).top) || 115;
        };
        updateStickyTopFn();

        // Only add active overlay class when a card actually overlays the previous card
        const updateCardBackgrounds = () => {
            let isSecondOverlayingFirst = false;

            for (let i = 1; i < cards.length; i++) {
                const prevCard = cards[i - 1];
                const currentCard = cards[i];

                const prevRect = prevCard.getBoundingClientRect();
                const currentRect = currentCard.getBoundingClientRect();

                // Current card is overlaying previous card if previous card has reached sticky top
                // and current card's top edge has scrolled above previous card's bottom edge
                const isOverlaying = (prevRect.top <= stickyTop + 2) && (currentRect.top < prevRect.bottom - 2);

                if (i === 1 && isOverlaying) {
                    isSecondOverlayingFirst = true;
                }

                if (isOverlaying) {
                    currentCard.classList.add('ct_card_scrolled');
                } else {
                    currentCard.classList.remove('ct_card_scrolled');
                }
            }

            // First card (01) only gets the active class when second card begins overlaying it
            if (isSecondOverlayingFirst) {
                cards[0].classList.add('ct_card_scrolled');
            } else {
                cards[0].classList.remove('ct_card_scrolled');
            }
        };

        const onScroll = () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    updateCardBackgrounds();
                    isTicking = false;
                });
                isTicking = true;
            }
        };

        const onResize = () => {
            if (updateStickyTopFn) updateStickyTopFn();
            onScroll();
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        updateCardBackgrounds(); // Initial check

        // Ensure all cards keep the same uniform 100% width and do not scale down on scroll
        if (typeof gsap !== 'undefined') {
            gsap.set('.ct_stack_card', { clearProps: 'transform,scale' });
        }
    };

    initStackingCards();

    // 6. Continuous Silky-Smooth Horizontal Scroll Services Section with GSAP & ScrollTrigger
    let horizTween = null;

    const initHorizontalServices = () => {
        const section = document.querySelector('.ct_horizontal_services_section');
        const track = document.querySelector('.ct_horiz_track');
        if (!section || !track) return;

        const cards = track.querySelectorAll('.ct_horiz_card');
        if (!cards.length) return;

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Clean up previous instance if re-initializing
        if (horizTween) {
            if (horizTween.scrollTrigger) horizTween.scrollTrigger.kill();
            horizTween.kill();
            gsap.set(track, { clearProps: 'transform,x' });
        }

        const totalCards = cards.length;
        const currentCounter = document.querySelector('.ct_horiz_counter_current');
        const progressFill = document.querySelector('.ct_horiz_progress_fill');
        const prevBtn = document.querySelector('.ct_horiz_prev');
        const nextBtn = document.querySelector('.ct_horiz_next');

        // Function to update active card states and counter
        const updateActiveCard = (stepIndex) => {
            const idx = Math.min(Math.max(0, stepIndex), totalCards - 1);

            cards.forEach((card, i) => {
                if (i === idx) {
                    card.classList.add('ct_card_active');
                } else {
                    card.classList.remove('ct_card_active');
                }
            });

            if (currentCounter) {
                currentCounter.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1);
            }
            if (progressFill) {
                progressFill.style.width = (((idx + 1) / totalCards) * 100) + '%';
            }
        };

        // Calculate maximum scrollable distance based on the actual position of the last card
        const getMaxScroll = () => {
            const wrap = track.parentElement;
            const wrapWidth = wrap ? wrap.clientWidth : window.innerWidth;
            const lastCard = cards[cards.length - 1];
            if (lastCard) {
                const totalCardsWidth = lastCard.offsetLeft + lastCard.offsetWidth;
                return Math.max(0, totalCardsWidth - wrapWidth);
            }
            return Math.max(0, track.scrollWidth - wrapWidth);
        };

        // Continuous, linear, silky-smooth tween with zero pauses on ALL viewports (including 767px mobile/tablet)
        horizTween = gsap.to(track, {
            x: () => -getMaxScroll(),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${Math.max(window.innerHeight * 1.3, getMaxScroll() * 1.05)}`,
                pin: true,
                pinSpacing: true,
                scrub: 0.5,
                anticipatePin: 0,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const step = Math.min(totalCards - 1, Math.round(self.progress * (totalCards - 1)));
                    updateActiveCard(step);
                }
            }
        });

        // Initial active state
        updateActiveCard(0);

        // Arrow buttons navigation (if buttons exist)
        if (nextBtn) {
            nextBtn.onclick = () => {
                const st = horizTween?.scrollTrigger;
                if (!st) return;
                const currentStep = Math.min(totalCards - 1, Math.floor(st.progress * (totalCards - 1) + 0.05) + 1);
                const targetScroll = st.start + (currentStep / (totalCards - 1)) * (st.end - st.start) + 2;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            };
        }

        if (prevBtn) {
            prevBtn.onclick = () => {
                const st = horizTween?.scrollTrigger;
                if (!st) return;
                const currentStep = Math.max(0, Math.ceil(st.progress * (totalCards - 1) - 0.05) - 1);
                const targetScroll = st.start + (currentStep / (totalCards - 1)) * (st.end - st.start) + 2;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            };
        }
    };

    initHorizontalServices();



    // 8. Clear Process From Idea To Launch - Interactive Scroll Timeline
    const initProcessTimelineAnimation = () => {
        const section = document.querySelector('.ct_process_section');
        if (!section || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const imgs = section.querySelectorAll('.ct_process_img');
        const icons = section.querySelectorAll('.ct_step_icon');
        const infos = section.querySelectorAll('.ct_process_info');
        const progress = section.querySelector('.ct_process_timeline_progress');
        const activeNode = section.querySelector('.ct_process_node_active');
        const dots = section.querySelectorAll('.ct_milestone_dot');

        const totalSteps = infos.length;
        if (totalSteps === 0) return;

        let currentActive = -1;

        const goToStep = (stepIdx) => {
            if (stepIdx === currentActive) return;
            currentActive = stepIdx;

            // 1. Image fade & zoom transition
            imgs.forEach((img, i) => {
                img.classList.toggle('active', i === stepIdx);
            });

            // 2. Icon transition in badge
            icons.forEach((icon, i) => {
                icon.classList.toggle('active', i === stepIdx);
            });

            // 3. Step Title & Description transition
            infos.forEach((info, i) => {
                info.classList.toggle('active', i === stepIdx);
            });

            // 4. Milestone dots active state
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i <= stepIdx);
            });

            // 5. Timeline bar progress width & gliding active number node position
            const nodePct = (stepIdx / (totalSteps - 1)) * 100;
            const progressPct = stepIdx === 0 ? 50 : Math.max(50, nodePct);
            if (progress) progress.style.width = progressPct + '%';
            if (activeNode) {
                activeNode.style.left = nodePct + '%';
                activeNode.textContent = (stepIdx + 1).toString().padStart(2, '0');
            }
        };

        // Initialize at step 0
        goToStep(0);

        // Pin the section and scrub through the timeline
        const scrollDistance = Math.max(window.innerHeight * 2, 1400);

        const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const step = Math.min(totalSteps - 1, Math.floor(self.progress * totalSteps));
                goToStep(step);
            }
        });

        // Clickable timeline milestones
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                if (!st) return;
                const targetProgress = idx / (totalSteps - 1);
                const targetScroll = st.start + targetProgress * (st.end - st.start) + 2;
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            });
        });
    };

    initProcessTimelineAnimation();

    // =========================================================================
    // Technology That Fits The Job Section Animation & Interaction
    // =========================================================================
    const initTechFitsAnimation = () => {
        const section = document.querySelector('#tech-stack');
        if (!section) return;

        // Interactive hover linkage between SVG stack layers & tech cards
        const stackLayers = section.querySelectorAll('.ct_fits_stack_layer[data-category]');
        const techCards = section.querySelectorAll('.ct_fits_card[data-category]');

        stackLayers.forEach(layer => {
            const cat = layer.getAttribute('data-category');
            if (!cat) return;
            const targetCard = section.querySelector(`.ct_fits_card[data-category="${cat}"]`);

            layer.addEventListener('mouseenter', () => {
                if (targetCard) targetCard.classList.add('ct_fits_highlight');
            });
            layer.addEventListener('mouseleave', () => {
                if (targetCard) targetCard.classList.remove('ct_fits_highlight');
            });
            layer.addEventListener('click', () => {
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    targetCard.classList.add('ct_fits_highlight');
                    setTimeout(() => targetCard.classList.remove('ct_fits_highlight'), 1500);
                }
            });
        });

        techCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            if (!cat) return;
            const targetLayer = section.querySelector(`.ct_fits_stack_layer[data-category="${cat}"]`);

            card.addEventListener('mouseenter', () => {
                if (targetLayer) targetLayer.classList.add('ct_fits_highlight');
            });
            card.addEventListener('mouseleave', () => {
                if (targetLayer) targetLayer.classList.remove('ct_fits_highlight');
            });
        });

        // GSAP Scroll Entrance Animation
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const cards = section.querySelectorAll('.ct_fits_card');
            if (cards.length > 0) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 78%',
                        once: true
                    },
                    y: 35,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }

            const leftContent = section.querySelector('.ct_fits_left');
            if (leftContent) {
                gsap.from(leftContent, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        once: true
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }
    };

    initTechFitsAnimation();

    // =========================================================================
    // Industry Swiper & Interactive Tabs (Bidirectional Synchronization)
    // =========================================================================
    const initIndustrySwiper = () => {
        const swiperContainer = document.querySelector('.ct_industry_swiper');
        const tabItems = document.querySelectorAll('.ct_industry_tab_item');
        if (!swiperContainer || !tabItems.length) return;

        // Function to update active tab state
        const updateActiveTab = (index) => {
            tabItems.forEach((tab, i) => {
                if (i === index) {
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                    // On mobile/tablet horizontal scroll, keep active tab centered in view
                    if (window.innerWidth <= 991) {
                        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                } else {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                }
            });
        };

        // Initialize Swiper
        const industrySwiper = new Swiper('.ct_industry_swiper', {
            slidesPerView: 1,
            spaceBetween: 24,
            speed: 550,
            grabCursor: true,
            autoHeight: false,
            navigation: {
                nextEl: '.ct_industry_next',
                prevEl: '.ct_industry_prev',
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            on: {
                init: function () {
                    const currentIdx = typeof this.realIndex !== 'undefined' ? this.realIndex : this.activeIndex;
                    updateActiveTab(currentIdx || 0);
                },
                slideChange: function () {
                    const currentIdx = typeof this.realIndex !== 'undefined' ? this.realIndex : this.activeIndex;
                    updateActiveTab(currentIdx);
                }
            }
        });

        // Tab Click Listeners (Click tab -> changes slide & activates tab)
        tabItems.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                updateActiveTab(index);
                industrySwiper.slideTo(index);
            });

            // Keyboard navigation (Enter / Space)
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateActiveTab(index);
                    industrySwiper.slideTo(index);
                }
            });
        });

        window.ctIndustrySwiper = industrySwiper;
    };

    initIndustrySwiper();

    // =========================================================================
    // Solutions Showcase Infinite Swiper Slider (Instant Freeze on Hover)
    // =========================================================================
    const initSolutionsSwiper = () => {
        const swiperContainer = document.querySelector('.ct_solutions_swiper');
        if (!swiperContainer) return;

        const BASE_SPEED = 4500;
        let isHovered = false;
        let resumeTimeout = null;

        const solutionsSwiper = new Swiper('.ct_solutions_swiper', {
            slidesPerView: 1.15,
            spaceBetween: 18,
            loop: true,
            speed: BASE_SPEED,
            allowTouchMove: true,
            grabCursor: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: false, // We handle instantaneous freeze manually
            },
            breakpoints: {
                576: {
                    slidesPerView: 1.8,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2.4,
                    spaceBetween: 22,
                },
                992: {
                    slidesPerView: 3.1,
                    spaceBetween: 24,
                },
                1200: {
                    slidesPerView: 3.6,
                    spaceBetween: 26,
                },
                1400: {
                    slidesPerView: 4.2,
                    spaceBetween: 28,
                }
            }
        });

        const wrapper = swiperContainer.querySelector('.swiper-wrapper');

        // Instantly freeze motion at the current pixel without waiting for the transition to finish
        const freezeMotion = () => {
            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
                resumeTimeout = null;
            }

            if (isHovered) return;
            isHovered = true;

            // 1. Immediately stop Swiper autoplay timer
            if (solutionsSwiper.autoplay && solutionsSwiper.autoplay.running) {
                solutionsSwiper.autoplay.stop();
            }

            // Remove any pending catch-up listener
            solutionsSwiper.off('slideChangeTransitionEnd');

            // 2. Capture exact current translateX and freeze CSS transition immediately
            if (wrapper) {
                const style = window.getComputedStyle(wrapper);
                const transform = style.transform || style.webkitTransform;
                if (transform && transform !== 'none') {
                    let currentX = 0;
                    try {
                        const matrix = new DOMMatrixReadOnly(transform);
                        currentX = matrix.m41;
                    } catch (e) {
                        const match = transform.match(/matrix(?:3d)?\((.+)\)/);
                        if (match) {
                            const vals = match[1].split(',').map(s => parseFloat(s.trim()));
                            currentX = vals.length === 16 ? vals[12] : vals[4];
                        }
                    }
                    wrapper.style.setProperty('transition', 'none', 'important');
                    wrapper.style.transform = `translate3d(${currentX}px, 0px, 0px)`;
                    solutionsSwiper.setTranslate(currentX);
                }
            }
        };

        // Resume motion smoothly to the LEFT when mouse leaves
        const resumeMotion = () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);

            resumeTimeout = setTimeout(() => {
                // Ensure mouse is not still hovering anywhere on the slider or cards
                if (swiperContainer.matches(':hover')) {
                    return;
                }

                isHovered = false;

                if (wrapper) {
                    wrapper.style.removeProperty('transition');
                }

                // Calculate next snap strictly to the LEFT (forward in carousel)
                const currentTranslate = solutionsSwiper.getTranslate();
                const pos = -currentTranslate;
                const snaps = solutionsSwiper.slidesGrid;
                let nextSnap = null;
                let nextIndex = -1;

                // Look for the next snap ahead in the leftward direction
                for (let i = 0; i < snaps.length; i++) {
                    if (snaps[i] > pos + 5) {
                        nextSnap = snaps[i];
                        nextIndex = i;
                        break;
                    }
                }

                const firstSlide = solutionsSwiper.slides[0];
                const slideWidth = firstSlide ? (firstSlide.offsetWidth + solutionsSwiper.params.spaceBetween) : 350;

                if (nextIndex !== -1 && nextSnap !== null) {
                    const remainingDistance = Math.abs(nextSnap - pos);
                    const resumeDuration = Math.max(250, Math.round((remainingDistance / slideWidth) * BASE_SPEED));

                    // Smoothly finish moving forward to the LEFT
                    solutionsSwiper.slideTo(nextIndex, resumeDuration);

                    const onFinishCatchUp = () => {
                        solutionsSwiper.off('slideChangeTransitionEnd', onFinishCatchUp);
                        if (!isHovered) {
                            solutionsSwiper.params.speed = BASE_SPEED;
                            if (solutionsSwiper.autoplay && !solutionsSwiper.autoplay.running) {
                                solutionsSwiper.autoplay.start();
                            }
                        }
                    };
                    solutionsSwiper.once('slideChangeTransitionEnd', onFinishCatchUp);
                } else {
                    // If near or at the end of snap grid, fix loop and slide forward to the left
                    if (typeof solutionsSwiper.loopFix === 'function') {
                        solutionsSwiper.loopFix();
                    }
                    solutionsSwiper.params.speed = BASE_SPEED;
                    solutionsSwiper.slideNext(BASE_SPEED);
                    if (solutionsSwiper.autoplay && !solutionsSwiper.autoplay.running) {
                        solutionsSwiper.autoplay.start();
                    }
                }
            }, 60);
        };


        // Listen for hover events on container and individual project cards
        swiperContainer.addEventListener('mouseenter', freezeMotion);
        swiperContainer.addEventListener('mouseleave', resumeMotion);

        const projectCards = swiperContainer.querySelectorAll('.ct_project_card');
        projectCards.forEach((card) => {
            card.addEventListener('mouseenter', freezeMotion);
            card.addEventListener('mouseleave', resumeMotion);
        });

        // Touch support
        solutionsSwiper.on('touchStart', () => {
            freezeMotion();
        });
        solutionsSwiper.on('touchEnd', () => {
            resumeMotion();
        });

        window.ctSolutionsSwiper = solutionsSwiper;
    };


    initSolutionsSwiper();

    // Global debounced resize handler: ensures Swiper, Stacking Cards, and ScrollTrigger update reliably
    let globalResizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(globalResizeTimer);
        globalResizeTimer = setTimeout(() => {
            if (updateStickyTopFn) updateStickyTopFn();
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
            if (window.ctBrandSwiper && typeof window.ctBrandSwiper.update === 'function') {
                window.ctBrandSwiper.update();
                if (window.ctBrandSwiper.autoplay && !window.ctBrandSwiper.autoplay.running) {
                    window.ctBrandSwiper.autoplay.start();
                }
            }
            if (window.ctIndustrySwiper && typeof window.ctIndustrySwiper.update === 'function') {
                window.ctIndustrySwiper.update();
            }
            if (window.ctSolutionsSwiper && typeof window.ctSolutionsSwiper.update === 'function') {
                window.ctSolutionsSwiper.update();
                if (window.ctSolutionsSwiper.autoplay && !window.ctSolutionsSwiper.autoplay.running) {
                    window.ctSolutionsSwiper.autoplay.start();
                }
            }
        }, 150);
    });

    // 10. FAQ Accordion Interaction
    const faqItems = document.querySelectorAll('.ct_faq_item');
    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.ct_faq_question');
        questionBtn?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Close all
            faqItems.forEach((other) => {
                other.classList.remove('active');
                const btn = other.querySelector('.ct_faq_question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 11. Contact Form File Upload Label Update
    const projectFileInput = document.getElementById('ctProjectFile');
    const filePlaceholder = document.querySelector('.ct_file_placeholder');
    if (projectFileInput && filePlaceholder) {
        projectFileInput.addEventListener('change', () => {
            if (projectFileInput.files && projectFileInput.files[0]) {
                filePlaceholder.textContent = projectFileInput.files[0].name;
                filePlaceholder.style.color = '#111111';
            }
        });
    }
});



