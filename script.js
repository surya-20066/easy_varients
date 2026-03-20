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
      title: "Explainer Video",
      desc: "See how EasyVariants works end-to-end",
      link: "https://easyvariants.com/explainer_variants.html",
      embed: "https://www.youtube.com/embed/ETiWWJaoaZM?autoplay=1&mute=1&loop=1&playlist=ETiWWJaoaZM",
      icon: "play_circle"
    },
    {
      title: "Cap Variants Demo",
      desc: "Automatic cap colorway generation",
      link: "https://easyvariants.com/cap_variants.html",
      embed: "https://www.youtube.com/embed/2Zl_BkN9L6w?autoplay=1&mute=1&loop=1&playlist=2Zl_BkN9L6w",
      icon: "checkroom"
    },
    {
      title: "Sweatshirt Variants Demo",
      desc: "Full apparel variant automation",
      link: "https://easyvariants.com/sweatshirt_variants.html",
      embed: "https://www.youtube.com/embed/Kd0Olg1cE-s?autoplay=1&mute=1&loop=1&playlist=Kd0Olg1cE-s",
      icon: "styler"
    },
    {
      title: "Shoe Variants Demo",
      desc: "Footwear design multiplied instantly",
      link: "https://easyvariants.com/shoe_variants.html",
      embed: "https://www.youtube.com/embed/2Zl_BkN9L6w?autoplay=1&mute=1&loop=1&playlist=2Zl_BkN9L6w",
      icon: "steps"
    },
    {
      title: "Color Transition Generator",
      desc: "Explore infinite gradient transitions",
      link: "https://easyvariants.com/color_transition_generator.html",
      embed: "https://www.youtube.com/embed/ETiWWJaoaZM?autoplay=1&mute=1&loop=1&playlist=ETiWWJaoaZM",
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
      
      el.style.background = `rgba(12, 18, 40, 0.8)`;
      el.style.overflow = `hidden`;
      
      el.innerHTML = `
        <iframe width="100%" height="100%" src="${data.embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none; opacity: 0.6;"></iframe>
        <a href="${data.embed.split('?')[0].replace('/embed/', '/watch?v=')}" target="_blank" class="fc-badge" style="z-index: 10; position: relative;">&#9654; Watch Now</a>
        <div class="fc-overlay" style="z-index: 10; position: relative;">
          <div class="fc-title">${data.title}</div>
          <div class="fc-desc">${data.desc}</div>
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

      // Threshold to throw away: 100px
      const distance = Math.sqrt(currentX*currentX + currentY*currentY);
      
      if (distance > 100) {
        // User dragged far enough: Throw it away and cycle
        const throwX = currentX * 3;
        const throwY = currentY * 3;
        
        topCard.style.transform = `translate(${throwX}px, ${throwY}px) rotate(${currentX * 0.1}deg)`;
        topCard.style.opacity = 0;

        setTimeout(() => {
          // Move from end of array to start of array
          const thrown = cardsArray.pop();
          cardsArray.unshift(thrown);
          // Restore transition and redraw
          updateStackVisuals();
        }, 300); // match transition speed theoretically
      } else {
        // Snap back
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
        if(stepIndex === 1) height = 0;
        if(stepIndex === 2) height = 50;
        if(stepIndex === 3) height = 100;
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
  const dcTrack = document.getElementById("dc-track");
  if (dcTrack) {
    const dcData = [
      { title: "Explainer Video", desc: "See how EasyVariants works end-to-end", link: "https://easyvariants.com/explainer_variants.html", yt: "https://www.youtube.com/watch?v=ETiWWJaoaZM" },
      { title: "Cap Variants", desc: "Automatic cap colorway generation", link: "https://easyvariants.com/cap_variants.html", yt: "https://www.youtube.com/watch?v=2Zl_BkN9L6w" },
      { title: "Sweatshirt Variants", desc: "Full apparel variant automation", link: "https://easyvariants.com/sweatshirt_variants.html", yt: "https://www.youtube.com/watch?v=Kd0Olg1cE-s" },
      { title: "Shoe Variants", desc: "Footwear design multiplied instantly", link: "https://easyvariants.com/shoe_variants.html", yt: "https://www.youtube.com/watch?v=2Zl_BkN9L6w" },
      { title: "Color Generator", desc: "Explore infinite gradient transitions", link: "https://easyvariants.com/color_transition_generator.html", yt: "https://www.youtube.com/watch?v=ETiWWJaoaZM" }
    ];

    dcData.forEach((data, i) => {
      const card = document.createElement("div");
      card.className = "dc-card";
      card.innerHTML = `
        <div class="dc-preview" id="dc-prev-${i}">
          <a class="dc-play dc-watch-btn" href="${data.yt}" target="_blank" style="text-decoration:none;">&#9654; Watch Now</a>
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
        </div>
      `;
      dcTrack.appendChild(card);
    });

    const dcCards = document.querySelectorAll(".dc-card");

    let dcIsDown = false;
    let dcStartX = 0;
    let dcTranslate = 0;
    let dcAnimID;

    const snapDcNearest = () => {
      const dcContainerWidth = document.querySelector('.dc-container').offsetWidth;
      const centerLook = dcContainerWidth / 2 - dcTranslate;
      
      let minDiff = Infinity;
      let activeIdx = 0;

      dcCards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const diff = Math.abs(cardCenter - centerLook);
        if(diff < minDiff) { minDiff = diff; activeIdx = i; }
        card.classList.remove('active-center');
      });

      if (activeIdx < 0) activeIdx = 0;
      if (activeIdx > dcCards.length - 1) activeIdx = dcCards.length - 1;

      dcCards[activeIdx].classList.add('active-center');
      
      const targetCenter = dcCards[activeIdx].offsetLeft + (dcCards[activeIdx].offsetWidth / 2);
      dcTranslate = (dcContainerWidth / 2) - targetCenter;
      dcTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      dcTrack.style.transform = `translateX(${dcTranslate}px)`;
    };

    const dcAnimation = () => {
      dcTrack.style.transform = `translateX(${dcTranslate}px)`;
      if(dcIsDown) requestAnimationFrame(dcAnimation);
    };

    dcTrack.addEventListener('mousedown', (e) => {
      dcIsDown = true;
      dcStartX = e.pageX - dcTranslate;
      dcTrack.style.transition = 'none';
      dcAnimID = requestAnimationFrame(dcAnimation);
    });
    dcTrack.addEventListener('mousemove', (e) => {
      if(!dcIsDown) return;
      dcTranslate = e.pageX - dcStartX;
    });
    const dcEndDrag = () => {
      if(!dcIsDown) return;
      dcIsDown = false;
      cancelAnimationFrame(dcAnimID);
      snapDcNearest();
    };
    dcTrack.addEventListener('mouseup', dcEndDrag);
    dcTrack.addEventListener('mouseleave', dcEndDrag);

    dcTrack.addEventListener('touchstart', (e) => {
      dcIsDown = true;
      dcStartX = e.touches[0].clientX - dcTranslate;
      dcTrack.style.transition = 'none';
      dcAnimID = requestAnimationFrame(dcAnimation);
    }, {passive:true});
    dcTrack.addEventListener('touchmove', (e) => {
      if(!dcIsDown) return;
      dcTranslate = e.touches[0].clientX - dcStartX;
    }, {passive:true});
    dcTrack.addEventListener('touchend', dcEndDrag);

    setTimeout(() => {
      if(dcCards.length > 0) snapDcNearest();
    }, 100);
    window.addEventListener('resize', snapDcNearest);
  }

});
