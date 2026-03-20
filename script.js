document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. SCROLL ANIMATIONS
     ========================================= */
  const scrollElements = document.querySelectorAll(".section-scroll");

  const elementInView = (el, offset = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset);
  };

  const displayScrollElement = (el) => {
    el.classList.add("scrolled-in");
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 50)) {
        displayScrollElement(el);
      }
    });
  };

  /* =========================================
     2. NAVBAR LOGIC
     ========================================= */
  const navbar = document.querySelector(".navbar");
  const handleNavbar = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  /* Initial calls & listeners */
  window.addEventListener("scroll", () => {
    handleScrollAnimation();
    handleNavbar();
  });
  handleScrollAnimation();
  handleNavbar();

  /* =========================================
     3. MOBILE MENU
     ========================================= */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  /* =========================================
     4. FLIPCARD COMPONENT
     ========================================= */
  const flipCardsData = [
    {
      title: "Explainer Masterclass",
      desc: "Discover the core orchestration of design variants.",
      link: "https://easyvariants.com/explainer_variants.html",
      embed: "https://easyvariants.com/explainer_variants.html",
      icon: "play_circle"
    },
    {
      title: "Apparel Suite: Caps",
      desc: "Instant colorway generation for headwear collections.",
      link: "https://easyvariants.com/cap_variants.html",
      embed: "https://easyvariants.com/cap_variants.html",
      icon: "checkroom"
    },
    {
      title: "Apparel Suite: Sweatshirts",
      desc: "Multi-layer automation for hoodies and leisurewear.",
      link: "https://easyvariants.com/sweatshirt_variants.html",
      embed: "https://easyvariants.com/sweatshirt_variants.html",
      icon: "styler"
    },
    {
      title: "Footwear Variants: Shoes",
      desc: "Dynamic texture and color remapping for footwear.",
      link: "https://easyvariants.com/shoe_variants.html",
      embed: "https://easyvariants.com/shoe_variants.html",
      icon: "steps"
    },
    {
      title: "Color Science: Gradients",
      desc: "Automating complex brand color transitions.",
      link: "https://easyvariants.com/color_transition_generator.html",
      embed: "https://easyvariants.com/color_transition_generator.html",
      icon: "palette"
    }
  ];

  const stackContainer = document.getElementById("flip-stack");

  // Only run if stack container exists
  if (stackContainer) {
    // We'll reverse the array visually so index 0 is at back, index 4 is up front.
    let cardsArray = flipCardsData.reverse().map((data, index) => {
      const el = document.createElement("div");
      el.className = "flip-card";
      el.style.background = `rgba(12, 18, 40, 0.95)`;
      el.style.overflow = `hidden`;
      el.style.borderRadius = `24px`;

      el.innerHTML = `
        <div class="drag-handle" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 30; cursor: grab;"></div>
        
        <!-- Cropping Wrapper -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;">
          <iframe width="100%" height="100%" src="${data.embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            style="position: absolute; top: -75px; left: 0; width: 100%; height: calc(100% + 150px); z-index: 1; border: none; opacity: 1; pointer-events: auto; transform: scale(1.15);">
          </iframe>
        </div>

        <!-- Sleek Watch Now Button -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 35; pointer-events: none;">
          <a href="${data.embed}" target="_blank" class="fc-badge" 
            style="pointer-events: auto; background: rgba(121, 82, 246, 0.9); padding: 12px 28px; border-radius: 50px; font-weight: 800; font-size: 14px; box-shadow: 0 8px 24px rgba(121, 82, 246, 0.4); text-transform: uppercase; letter-spacing: 1px; backdrop-filter: blur(4px);">
            Watch Now
          </a>
        </div>

        <div class="fc-overlay" style="z-index: 20; position: absolute; bottom: 0; left: 0; width: 100%; pointer-events: none; padding: 40px 24px; background: rgba(5, 5, 15, 0.5); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.08);">
          <div class="fc-title" style="font-weight: 800; font-size: 24px; color: #fff; margin-bottom: 8px;">${data.title}</div>
          <div class="fc-desc" style="font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.5; font-weight: 400;">${data.desc}</div>
        </div>
      `;
      stackContainer.appendChild(el);
      return el;
    });

    const stackOffset = 10; // px
    const stackRotation = -8; // degrees (applied fully on background cards)

    const updateStackVisuals = () => {
      const len = cardsArray.length;
      cardsArray.forEach((el, index) => {
        // index 0 = bottom of stack, index len-1 = top of stack
        const visualPos = len - 1 - index; // 0 for top card

        el.style.zIndex = index;

        if (visualPos === 0) {
          // Top Card is normal, no rotation but ready to drag
          el.style.transform = `translateY(0px) scale(1) rotate(0deg)`;
          el.style.opacity = 1;
        } else {
          // Background cards are offset, scaled, and tilted
          // stackRotation causes them all to sit tilted
          const pY = visualPos * stackOffset;
          const s = 1 - (visualPos * 0.05); // shrink by 5% each level
          const rot = stackRotation * Math.min(visualPos, 2); // max 2x rotation base

          el.style.transform = `translateY(${pY}px) scale(${s}) rotate(${rot}deg)`;
          el.style.opacity = Math.max(0, 1 - (visualPos * 0.15));
        }

        // Enable touch dragging only on top card
        if (visualPos === 0) {
          el.style.pointerEvents = "auto";
        } else {
          el.style.pointerEvents = "none";
        }
      });
    };

    updateStackVisuals();

    // Drag Logic
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let topCard = null;

    const onPointerDown = (e) => {
      // Get the current top card from the array (last element)
      topCard = cardsArray[cardsArray.length - 1];
      if (e.target.closest('.fc-badge')) return; // let users click link
      if (!topCard.contains(e.target)) return;

      isDragging = true;
      topCard.classList.add("dragging");

      startX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      startY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    };

    const onPointerMove = (e) => {
      if (!isDragging || !topCard) return;
      // prevent scrolling while dragging card loosely
      e.preventDefault();

      const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

      currentX = clientX - startX;
      currentY = clientY - startY;

      // Apply drag transform (adding slight rotation based on X movement)
      const moveRot = currentX * 0.05;
      topCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${moveRot}deg)`;
    };

    const onPointerUp = (e) => {
      if (!isDragging || !topCard) return;
      isDragging = false;
      topCard.classList.remove("dragging");

      // Threshold to throw away: 120px
      const distanceX = Math.abs(currentX);
      const distanceY = Math.abs(currentY);

      if (distanceX > 120 || distanceY > 120) {
        // Throw away
        const winW = window.innerWidth;
        const throwDirection = currentX > 0 ? 1 : -1;
        
        topCard.style.transition = 'transform 0.5s ease-out, opacity 0.5s';
        topCard.style.transform = `translate(${throwDirection * winW}px, ${currentY}px) rotate(${throwDirection * 45}deg)`;
        topCard.style.opacity = 0;

        setTimeout(() => {
          // Reset style for reuse
          topCard.style.transition = 'none';
          topCard.style.opacity = 1;
          
          const thrown = cardsArray.pop();
          cardsArray.unshift(thrown);
          updateStackVisuals();
        }, 500);
      } else {
        // Snap back
        topCard.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        topCard.style.transform = `translateY(0px) scale(1) rotate(0deg)`;
      }

      currentX = 0; currentY = 0;
    };

    // Events
    stackContainer.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);

    stackContainer.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  }

  /* =========================================
     5. CONTACT FORM HANDLER
     ========================================= */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.submit-btn');
      const sMsg = contactForm.querySelector('.success-msg');
      const eMsg = contactForm.querySelector('.error-msg');

      submitBtn.textContent = 'Sending...';
      submitBtn.style.opacity = 0.7;
      sMsg.style.display = 'none';
      eMsg.style.display = 'none';

      // Simulate API Call
      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.style.opacity = 1;
        // Assuming success
        sMsg.style.display = 'block';
        contactForm.reset();

        setTimeout(() => {
          sMsg.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  /* =========================================
     6. HOW IT WORKS TIMELINE V2
     ========================================= */
  const tlSteps = document.querySelectorAll(".tl-step");
  const vidScreens = document.querySelectorAll(".vid-screen");
  const vidDots = document.querySelectorAll(".vid-dot");
  const tlProgress = document.querySelector(".timeline-progress");

  const activateStep = (stepIndex) => { // 1-indexed
    // Remove active from all steps first 
    tlSteps.forEach((st) => st.classList.remove("active"));

    // Add active to current step and previous steps (or just current depending on preference)
    // The prompt says "Each circle glows when active". Let's glow only the active one,
    // but advance the line up to the active one.
    tlSteps.forEach((st) => {
      if (parseInt(st.dataset.step) === stepIndex) {
        st.classList.add("active");
      }
    });

    vidDots.forEach(d => d.classList.remove("active"));
    const activeDot = document.querySelector(`.vid-dot[data-target="${stepIndex}"]`);
    if (activeDot) activeDot.classList.add("active");

    vidScreens.forEach(vs => {
      vs.style.opacity = "0";
      vs.style.zIndex = "1";
    });
    const activeScreen = document.getElementById(`vid-${stepIndex}`);
    if (activeScreen) {
      activeScreen.style.opacity = "1";
      activeScreen.style.zIndex = "2";
    }

    // Progress bar height (0% -> 50% -> 100%)
    if (tlProgress) {
      let height = 0;
      if (stepIndex === 1) height = 0;
      if (stepIndex === 2) height = 50;
      if (stepIndex === 3) height = 100;
      tlProgress.style.height = `${height}%`;
    }
  };

  if (tlSteps.length > 0) {
    tlSteps.forEach(st => {
      st.addEventListener("mouseenter", () => {
        const idx = parseInt(st.dataset.step);
        activateStep(idx);
      });
      st.addEventListener("click", () => {
        const idx = parseInt(st.dataset.step);
        activateStep(idx);
      });
    });

    vidDots.forEach(dot => {
      dot.addEventListener("click", () => {
        const target = parseInt(dot.dataset.target);
        activateStep(target);
      });
    });
  }

  /* =========================================
     6. MEET SECTION DRAGGABLE CAROUSEL
     ========================================= */
  /* =========================================
     6. MEET SECTION CAROUSEL (IMAGE STYLE)
     ========================================= */
  const meetMainVid = document.getElementById('meet-main-vid');
  const meetDots = document.querySelectorAll('.m-dot');
  const meetBadge = document.getElementById('meet-badge');
  const meetPPBtn = document.getElementById('meet-pause-play');
  const ppIcon = document.getElementById('pp-icon');

  if (meetMainVid && meetDots.length > 0) {
    const meetData = [
      { src: 'sweatshirt_v.mp4', badge: 'Sweatshirt Patterns' },
      { src: 'cap_v.mp4', badge: 'Cap Variations' },
      { src: 'color_v.mp4', badge: 'Color Transition Generator' }
    ];
    let currentIdx = 0;
    let isPaused = false;

    const setMeetSlide = (idx) => {
      meetMainVid.style.opacity = '0';
      setTimeout(() => {
        meetMainVid.src = meetData[idx].src;
        meetBadge.textContent = meetData[idx].badge;

        meetMainVid.play();
        meetMainVid.style.opacity = '1';

        meetDots.forEach(d => d.classList.remove('active'));
        meetDots[idx].classList.add('active');
        currentIdx = idx;

        // Reset pause icon if it was changed
        ppIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
        isPaused = false;
      }, 300);
    };

    meetDots.forEach((dot, i) => {
      dot.addEventListener('click', () => setMeetSlide(i));
    });

    if (meetPPBtn) {
      meetPPBtn.addEventListener('click', () => {
        if (meetMainVid.paused) {
          meetMainVid.play();
          ppIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
          isPaused = false;
        } else {
          meetMainVid.pause();
          ppIcon.innerHTML = `<path d="M8 5v14l11-7z"></path>`;
          isPaused = true;
        }
      });
    }

    // Auto cycle
    setInterval(() => {
      if (!isPaused) {
        let next = (currentIdx + 1) % meetData.length;
        setMeetSlide(next);
      }
    }, 6000);
  }

});
