/**
 * MCP Shrimp Task Manager Website Main Script
 */

// Execute after page loading is complete
document.addEventListener("DOMContentLoaded", function () {
  // Initialize scroll animations
  initAOS();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize code highlighting and copy functionality
  initCodeBlocks();

  // Smooth scrolling functionality
  initSmoothScroll();

  // Hero section effects
  initHeroEffects();

  // Pain points and solutions section effects
  initPainPointsEffects();

  // Core features display section effects
  initFeaturesEffects();

  // Workflow display section effects
  initWorkflowEffects();

  // Initialize installation and configuration section functionality
  initInstallationSection();

  // Detect page scroll position to display back-to-top button
  initScrollToTopButton();

  // Initialize responsive image lazy loading
  initLazyLoading();

  // Initialize page entrance animation
  initPageEntranceAnimation();

  // Multi-language functionality
  initMultiLanguage();
});

/**
 * Initialize AOS scroll animation library
 */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: true,
    disable: function () {
      // Only disable animations on low-performance devices, based on user preference settings
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  });

  // Reinitialize AOS when window is resized to ensure correct trigger positions
  window.addEventListener("resize", function () {
    AOS.refresh();
  });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();

      // To support transition effects, first remove the hidden class
      if (mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.remove("hidden");

        // Wait for DOM update, then add visible class to trigger transition effect
        setTimeout(() => {
          mobileMenu.classList.add("visible");
        }, 10);
      } else {
        // First remove visible class to trigger transition effect
        mobileMenu.classList.remove("visible");

        // Wait for transition to complete, then hide menu
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300); // 300ms matches CSS transition time
      }
    });

    // Close menu after clicking menu items
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("visible");

        // Wait for transition to complete, then hide menu
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      });
    });

    // Close menu when clicking outside menu area
    document.addEventListener("click", function (e) {
      if (
        !menuToggle.contains(e.target) &&
        !mobileMenu.contains(e.target) &&
        !mobileMenu.classList.contains("hidden")
      ) {
        mobileMenu.classList.remove("visible");

        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      }
    });
  }
}

/**
 * Hero section effects initialization
 */
function initHeroEffects() {
  // Get hero section
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  // Add animation sequence for floating decorative elements
  const decorElements = heroSection.querySelectorAll(".absolute");
  decorElements.forEach((elem, index) => {
    elem.style.setProperty("--animation-order", index + 1);

    // Use fade-in animation to gradually display elements after page load
    setTimeout(() => {
      elem.style.opacity = "0.8";
    }, (index + 1) * 200);
  });

  // Add parallax scrolling effect
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Apply effects when user scrolls through hero section
    if (scrollTop <= heroHeight) {
      const scrollPercentage = scrollTop / heroHeight;

      // Hero section fade-out effect
      heroSection.style.opacity = 1 - scrollPercentage * 0.8;

      // Title upward movement effect
      const heroTitle = heroSection.querySelector("h1");
      if (heroTitle) {
        heroTitle.style.transform = `translateY(${scrollPercentage * 50}px)`;
      }
    }
  });

  // Add mouse movement parallax effect
  heroSection.addEventListener("mousemove", function (e) {
    // Only enable this effect on larger screens
    if (window.innerWidth >= 768) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

      // Get image elements within the hero section
      const heroImage = heroSection.querySelector("img");
      if (heroImage) {
        heroImage.style.transform = `translate(${moveX * 2}px, ${
          moveY * 2
        }px) scale(1.02)`;
      }

      // Get decorative elements within the hero section
      decorElements.forEach((elem, index) => {
        // Use different movement ratios to create a sense of depth
        const factorX = (index + 1) * 0.03;
        const factorY = (index + 1) * 0.02;
        elem.style.transform = `translate(${moveX * factorX}px, ${
          moveY * factorY
        }px)`;
      });
    }
  });

  // Reset element positions when mouse leaves
  heroSection.addEventListener("mouseleave", function () {
    const heroImage = heroSection.querySelector("img");
    if (heroImage) {
      heroImage.style.transform = "";
    }

    decorElements.forEach((elem) => {
      elem.style.transform = "";
    });
  });

  // Logo animation effect
  const logo = document.querySelector("header nav img");
  if (logo) {
    // Slight rotation animation for navigation bar logo when page loads
    logo.style.transition = "transform 1s ease-out";
    logo.style.transform = "rotate(0deg)";

    setTimeout(() => {
      logo.style.transform = "rotate(5deg)";
      setTimeout(() => {
        logo.style.transform = "rotate(0deg)";
      }, 500);
    }, 1500);
  }
}

/**
 * Pain points and solutions section effects initialization
 */
function initPainPointsEffects() {
  const painPointsSection = document.getElementById("pain-points");
  if (!painPointsSection) return;

  // Get all cards
  const cards = painPointsSection.querySelectorAll(
    ".rounded-lg.overflow-hidden"
  );

  // Add delayed appearance animation for each card
  cards.forEach((card, index) => {
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", (index * 150).toString());
  });

  // Add mouse enter and leave effects for each card
  cards.forEach((card, index) => {
    // Get pain points and solution blocks
    const painIcon = card.querySelector(".p-6 img");
    const solutionIcon = card.querySelector(".p-4 img");
    const arrowIcon = card.querySelector(".h-8.w-8.text-green-500");

    // 鼠標進入效果
    card.addEventListener("mouseenter", function () {
      // Delay animation execution to create sequential animation effect
      if (painIcon) {
        setTimeout(() => {
          painIcon.style.transform = "scale(1.1) rotate(5deg)";
        }, 100);
      }

      if (arrowIcon) {
        setTimeout(() => {
          arrowIcon.style.transform = "translateY(8px)";
        }, 200);
      }

      if (solutionIcon) {
        setTimeout(() => {
          solutionIcon.style.transform = "scale(1.1) rotate(-5deg)";
        }, 300);
      }

      // Add glow effect
      card.style.boxShadow =
        "0 20px 30px rgba(0, 0, 0, 0.15), 0 0 15px rgba(59, 130, 246, 0.3)";
    });

    // Mouse leave effect
    card.addEventListener("mouseleave", function () {
      if (painIcon) painIcon.style.transform = "";
      if (arrowIcon) arrowIcon.style.transform = "";
      if (solutionIcon) solutionIcon.style.transform = "";

      // Remove glow effect
      card.style.boxShadow = "";
    });
  });

  // Add parallax scrolling effect
  window.addEventListener("scroll", function () {
    // Only enable this effect on larger screens
    if (window.innerWidth >= 768) {
      const scrollPosition = window.scrollY;
      const sectionTop = painPointsSection.offsetTop;
      const sectionHeight = painPointsSection.offsetHeight;

      // Apply effect when user scrolls to the section
      if (
        scrollPosition > sectionTop - window.innerHeight &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        cards.forEach((card, index) => {
          // Calculate relative scroll position
          const relativeScroll =
            (scrollPosition - (sectionTop - window.innerHeight)) /
            (sectionHeight + window.innerHeight);
          // Calculate offset based on card position
          const offset = Math.sin(relativeScroll * Math.PI + index * 0.5) * 15;

          // Set different offset direction based on index
          if (index % 2 === 0) {
            card.style.transform = `translateY(${offset}px)`;
          } else {
            card.style.transform = `translateY(${-offset}px)`;
          }
        });
      }
    }
  });
}

/**
 * Initialize code block functionality
 */
function initCodeBlocks() {
  // Ensure Prism.js is loaded
  if (typeof Prism !== "undefined") {
    // Apply code highlighting
    Prism.highlightAll();
  }

  // Initialize code example switching functionality
  initCodeTabSwitcher();

  // Optional: Add typewriter effect
  initTypingEffect();
}

/**
 * Initialize code example tab switching functionality
 */
function initCodeTabSwitcher() {
  const tabButtons = document.querySelectorAll(".code-tab-btn");
  const contentSections = document.querySelectorAll(".code-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Get target content ID
      const targetId = btn.getAttribute("data-target");

      // Cancel all button active states
      tabButtons.forEach((b) => {
        b.classList.remove("active", "bg-blue-50", "text-blue-600");
        b.classList.add("hover:bg-blue-50");
      });

      // Activate current button
      btn.classList.add("active", "bg-blue-50", "text-blue-600");

      // Hide all content
      contentSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // Show target content
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");

        // Ensure code highlighting in the activated content area
        const codeBlocks = targetSection.querySelectorAll("code");
        if (typeof Prism !== "undefined" && codeBlocks.length) {
          codeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }
      }
    });
  });
}

/**
 * Initialize typewriter effect (optional feature)
 */
function initTypingEffect() {
  // Check if typewriter effect is enabled (can be controlled via URL parameters)
  const urlParams = new URLSearchParams(window.location.search);
  const enableTyping = urlParams.get("typing") === "true";

  if (!enableTyping) return;

  const codeBlocks = document.querySelectorAll("#examples code");
  if (!codeBlocks.length) return;

  codeBlocks.forEach((codeBlock) => {
    const originalText = codeBlock.textContent;
    codeBlock.textContent = "";

    let charIndex = 0;
    const typingSpeed = 30; // Milliseconds interval per character

    // First hide the original code, then apply the typing effect
    codeBlock.parentElement.classList.add("typing-in-progress");

    // Start typing effect when the window enters the visible area
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(codeBlock.parentElement);

    function startTyping() {
      const typingInterval = setInterval(() => {
        if (charIndex < originalText.length) {
          codeBlock.textContent += originalText.charAt(charIndex);
          charIndex++;

          // Auto-scroll code block to track cursor
          codeBlock.parentElement.scrollTop =
            codeBlock.parentElement.scrollHeight;

          // Dynamically apply syntax highlighting
          if (typeof Prism !== "undefined") {
            Prism.highlightElement(codeBlock);
          }
        } else {
          clearInterval(typingInterval);
          codeBlock.parentElement.classList.remove("typing-in-progress");
        }
      }, typingSpeed);
    }
  });
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Ensure it's not just a "#" link
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          // Calculate target element position considering fixed navigation bar height
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/**
 * Core features display section effects initialization
 */
function initFeaturesEffects() {
  const featuresSection = document.getElementById("features");
  if (!featuresSection) return;

  // Get all feature cards
  const featureCards = featuresSection.querySelectorAll(".rounded-lg");

  // Add hover effect for each card
  featureCards.forEach((card, index) => {
    // Get icons and titles in the card
    const featureIcon = card.querySelector(".p-6 img");
    const featureTitle = card.querySelector("h3");

    // Mouse enter effect
    card.addEventListener("mouseenter", function () {
      if (featureIcon) {
        featureIcon.style.transform = "scale(1.2) rotate(5deg)";
        featureIcon.style.transition = "transform 0.5s ease";
      }

      if (featureTitle) {
        featureTitle.style.transform = "translateY(-5px)";
        featureTitle.style.transition = "transform 0.3s ease";
      }
    });

    // Mouse leave effect
    card.addEventListener("mouseleave", function () {
      if (featureIcon) {
        featureIcon.style.transform = "";
      }

      if (featureTitle) {
        featureTitle.style.transform = "";
      }
    });

    // Click effect - Add slight bounce effect
    card.addEventListener("click", function () {
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  // Add scrolling parallax effect
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate effect trigger range
    const sectionTop = featuresSection.offsetTop;
    const sectionHeight = featuresSection.offsetHeight;
    const triggerStart = sectionTop - windowHeight;
    const triggerEnd = sectionTop + sectionHeight;

    // Only calculate parallax within effect range
    if (scrollPosition > triggerStart && scrollPosition < triggerEnd) {
      const scrollProgress =
        (scrollPosition - triggerStart) / (triggerEnd - triggerStart);

      // Apply various parallax effects
      featureCards.forEach((card, index) => {
        const delayFactor = (index % 3) * 0.1;
        const moveY = Math.sin((scrollProgress + delayFactor) * Math.PI) * 15;

        // Apply parallax effect
        card.style.transform = `translateY(${moveY}px)`;
      });
    }
  });
}

/**
 * Workflow display section effects initialization
 */
function initWorkflowEffects() {
  // Initialize step detail modal functionality
  initWorkflowModal();

  // Add connection line animation for desktop timeline
  animateWorkflowConnections();

  // Add interaction effects for step icons
  addWorkflowIconInteractions();
}

/**
 * Initialize workflow detail modal
 */
function initWorkflowModal() {
  const modal = document.getElementById("workflow-detail-modal");
  const closeBtn = document.getElementById("close-modal");
  const closeBtnAlt = document.getElementById("close-modal-btn");
  const detailLinks = document.querySelectorAll(
    ".workflow-detail-link, .workflow-step"
  );
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  if (!modal || !closeBtn || !detailLinks.length) return;

  // Workflow step detail data
  const workflowDetails = {
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
    "zh-TW": {
      1: {
        title: "任務規劃",
        content: `
          <p>任務規劃階段是初始階段，AI助手定義項目範圍、設定目標，並建立成功標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>釐清項目需求和約束條件</li>
            <li>設定明確目標和定義可衡量的成功標準</li>
            <li>確立項目界限和識別相關利益方</li>
            <li>創建高級計劃及時間估算</li>
            <li>可選擇參考現有任務進行持續規劃</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>全面的任務描述</li>
            <li>明確的成功標準</li>
            <li>技術需求和約束條件</li>
          </ul>
          <p class="mt-4">此階段為所有後續工作奠定基礎，確保AI助手和用戶對需要完成的工作有共同理解。</p>
        `,
      },
      2: {
        title: "深入分析",
        content: `
          <p>深入分析階段涉及對需求和技術環境的徹底檢查，以制定可行的實施策略。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>分析需求並識別技術挑戰</li>
            <li>評估技術可行性和潛在風險</li>
            <li>研究最佳實踐和可用解決方案</li>
            <li>系統性地審查現有代碼庫（如適用）</li>
            <li>開發初步實施概念</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>技術可行性評估</li>
            <li>風險識別和緩解策略</li>
            <li>初步實施方法</li>
            <li>適當的偽代碼或架構圖</li>
          </ul>
          <p class="mt-4">此階段確保在進行實施前，提出的解決方案在技術上是合理的，並能處理所有需求。</p>
        `,
      },
      3: {
        title: "方案反思",
        content: `
          <p>方案反思階段涉及在實施前對提出的方法進行批判性審查和優化。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>批判性審查分析結果和提出的解決方案</li>
            <li>識別潛在差距、邊緣情況或低效問題</li>
            <li>考慮替代方法及其權衡</li>
            <li>根據最佳實踐和設計原則評估解決方案</li>
            <li>根據洞察優化實施策略</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>優化後的解決方案設計</li>
            <li>記錄的考慮事項和權衡</li>
            <li>改進的實施策略</li>
          </ul>
          <p class="mt-4">這種反思過程有助於及早發現潛在問題，並確保在投入實施前所選方法是最佳選擇。</p>
        `,
      },
      4: {
        title: "任務分解",
        content: `
          <p>任務分解階段將複雜任務分解為可管理的原子子任務，並建立明確的依賴關係和執行順序。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>將複雜任務分解為更小、可管理的單元</li>
            <li>建立子任務之間的明確依賴關係</li>
            <li>為每個子任務定義範圍和驗收標準</li>
            <li>分配優先級別並評估複雜度</li>
            <li>創建邏輯執行順序</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">支持的更新模式：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>追加(append)：</strong>保留所有現有任務並添加新任務</li>
            <li><strong>覆蓋(overwrite)：</strong>清除所有未完成的任務並完全替換，同時保留已完成的任務</li>
            <li><strong>選擇性更新(selective)：</strong>根據任務名稱智能匹配更新現有任務，同時保留其他任務</li>
            <li><strong>清除所有任務(clearAllTasks)：</strong>移除所有任務並創建備份</li>
          </ul>
          <p class="mt-4">這種結構化方法通過創建由小型、可實現步驟組成的清晰路線圖，使複雜項目變得可管理。</p>
        `,
      },
      5: {
        title: "任務執行",
        content: `
          <p>任務執行階段涉及按照預定計劃實施特定任務，重點關注質量和需求遵從。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>根據依賴和優先順序選擇要執行的任務</li>
            <li>按照實施指南實施解決方案</li>
            <li>遵循編碼標準和最佳實踐</li>
            <li>處理邊緣情況和錯誤條件</li>
            <li>記錄實施決策和理由</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">執行過程：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>準備必要的資源和環境</li>
            <li>逐步遵循實施指南</li>
            <li>監控進度並處理任何意外問題</li>
            <li>維護代碼質量和文檔</li>
          </ul>
          <p class="mt-4">該階段將計劃轉化為具體結果，實施早期階段設計的解決方案。</p>
        `,
      },
      6: {
        title: "結果驗證",
        content: `
          <p>結果驗證階段確保已實施的任務在標記為完成前滿足所有需求和質量標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>驗證是否已實施所有需求</li>
            <li>檢查是否遵循技術標準和最佳實踐</li>
            <li>測試邊緣情況和錯誤處理</li>
            <li>審查代碼質量和文檔</li>
            <li>根據為任務定義的驗證標準進行驗證</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">驗證清單：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>功能正確性：是否按預期工作？</li>
            <li>完整性：是否涵蓋所有需求？</li>
            <li>質量：是否符合編碼標準和最佳實踐？</li>
            <li>性能：是否高效運行？</li>
            <li>文檔：實施是否有良好的文檔？</li>
          </ul>
          <p class="mt-4">這種徹底的驗證過程確保交付高質量的成果，完全滿足需求。</p>
        `,
      },
      7: {
        title: "任務完成",
        content: `
          <p>任務完成階段正式將任務標記為已完成，生成詳細的完成報告，並更新相關依賴任務的狀態。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>成功驗證後正式將任務標記為已完成</li>
            <li>生成全面的完成報告</li>
            <li>更新依賴任務的狀態</li>
            <li>歸檔相關信息以供將來參考</li>
            <li>向利益相關者傳達完成情況</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">完成報告內容：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>已完成工作摘要</li>
            <li>實施亮點和關鍵決策</li>
            <li>遇到的任何值得注意的挑戰及其解決方案</li>
            <li>對未來工作或改進的建議</li>
          </ul>
          <p class="mt-4">完成階段確保任務適當結束，維持工作流程連續性，並為未來項目建立機構知識。</p>
        `,
      },
    },
  };

  // Click detail link to open modal
  detailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const stepIndex = parseInt(this.getAttribute("data-step"));
      const lang = localStorage.getItem("preferred-language") || "en";
      if (stepIndex >= 0 && workflowDetails[lang][stepIndex]) {
        modalTitle.textContent = workflowDetails[lang][stepIndex].title;
        modalContent.innerHTML = workflowDetails[lang][stepIndex].content;
        modal.classList.remove("hidden");
        modal.classList.add("active");
      }
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeModal);
  closeBtnAlt.addEventListener("click", closeModal);

  // Click outside to close modal
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * Add connection line animation for workflow timeline
 */
function animateWorkflowConnections() {
  const desktopTimeline = document.querySelector(
    "#workflow .hidden.md\\:block"
  );
  if (!desktopTimeline) return;

  // When timeline enters viewport, trigger animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const steps = entry.target.querySelectorAll(".workflow-step");

          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add("animated");
            }, index * 200);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(desktopTimeline);
}

/**
 * Add interaction effects for workflow step icons
 */
function addWorkflowIconInteractions() {
  const workflowIcons = document.querySelectorAll(
    ".workflow-icon, .workflow-icon-mobile"
  );

  workflowIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "scale(1.2) rotate(5deg)";
        img.style.transition = "transform 0.3s ease";
      }
    });

    icon.addEventListener("mouseleave", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "";
      }
    });

    // Add click effect
    icon.addEventListener("click", function () {
      const link =
        this.parentNode.querySelector(".workflow-detail-link") ||
        this.closest(".flex").querySelector(".workflow-detail-link");

      if (link) {
        link.click();
      }
    });
  });
}

/**
 * Initialize installation and configuration section functionality
 */
function initInstallationSection() {
  // Initialize installation method tab switching
  initInstallTabs();

  // Initialize Cursor IDE configuration tab switching
  initCursorTabs();

  // Initialize command line copy buttons
  initCommandCopyButtons();

  // Initialize installation cards animation
  initInstallCardsAnimation();
}

/**
 * Initialize installation method tab switching
 */
function initInstallTabs() {
  const tabButtons = document.querySelectorAll(".install-tab-btn");
  const contentSections = document.querySelectorAll(".install-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove all active states
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // Set current active state
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * Initialize Cursor IDE configuration tab switching
 */
function initCursorTabs() {
  const tabButtons = document.querySelectorAll(".cursor-tab-btn");
  const contentSections = document.querySelectorAll(".cursor-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove all active states
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // Set current active state
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * Initialize command line copy buttons
 */
function initCommandCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy-cmd-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.getAttribute("data-command");
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);

        // Update button text
        const originalText = button.textContent.trim();
        button.textContent = "已複製!";
        button.classList.add("bg-gray-600");
        button.classList.remove(
          "bg-blue-600",
          "bg-green-600",
          "bg-purple-600",
          "hover:bg-blue-700",
          "hover:bg-green-700",
          "hover:bg-purple-700"
        );

        //  Restore original state
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("bg-gray-600");

          // Restore button style based on button color
          if (button.classList.contains("copy-cmd-btn")) {
            if (button.closest("#smithery-install")) {
              button.classList.add("bg-blue-600", "hover:bg-blue-700");
            } else if (button.closest("#manual-install")) {
              button.classList.add("bg-green-600", "hover:bg-green-700");
            } else if (button.closest("#cursor-config")) {
              button.classList.add("bg-purple-600", "hover:bg-purple-700");
            }
          }
        }, 2000);
      } catch (err) {
        console.error("複製命令失敗:", err);
        button.textContent = "複製失敗";
      }
    });
  });
}

/**
 * Initialize installation cards animation
 */
function initInstallCardsAnimation() {
  const installCards = document.querySelectorAll("#installation .grid > div");

  installCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
      card.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";

      //  Find the icon inside the card and add animation
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";

      // Restore icon
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "";
      }
    });
  });
}

/**
 * Initialize scroll to top button
 */
function initScrollToTopButton() {
  // Create scroll to top button element
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.id = "scrollToTop";
  scrollToTopBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>';
  scrollToTopBtn.className =
    "fixed bottom-5 right-5 bg-blue-600 text-white p-2 rounded-full shadow-lg transform scale-0 transition-transform duration-300";
  scrollToTopBtn.setAttribute("aria-label", "回到頂部");

  // Add button to document
  document.body.appendChild(scrollToTopBtn);

  // Click event - smooth scroll to top
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Show or hide buttons based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.transform = "scale(1)";
    } else {
      scrollToTopBtn.style.transform = "scale(0)";
    }
  });
}

/**
 * Initialize lazy loading image functionality
 */
function initLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback - using Intersection Observer API
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imgObserver.observe(img);
    });
  }
}

/**
 * Initialize page entrance animation
 */
function initPageEntranceAnimation() {
  // Page load animation
  document.body.classList.add("page-loaded");

  // Delay and start sequence animation
  setTimeout(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }

    const heroContent = document.querySelector("#hero .container");
    if (heroContent) {
      setTimeout(() => {
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
      }, 200);
    }
  }, 100);
}

/**
 * Add animation class to element
 * @param {Element} element - Element to add animation to
 * @param {string} animationClass - Animation class name
 * @param {number} delay - Delay time in milliseconds
 */
function addAnimation(element, animationClass, delay = 0) {
  if (!element) return;

  setTimeout(() => {
    element.classList.add(animationClass);

    //  Remove class after animation ends
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClass);
      },
      { once: true }
    );
  }, delay);
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * Initialize multi-language functionality
 */
function initMultiLanguage() {
  // Check if i18n.js is loaded
  if (typeof i18n !== "undefined") {
    // Prefer using the enhanced initialization function
    if (typeof enhancedInitializeLanguage === "function") {
      enhancedInitializeLanguage();
    } else if (typeof initializeLanguage === "function") {
      //Compatibility processing, if the enhanced version function does not exist, use the original method
      initializeLanguage();
    } else {
      console.warn("Multi-language initialization function is not available, using basic initialization");
      // Basic initialization - provide basic functionality when i18n.js fails to load
      try {
        const currentLang =
          localStorage.getItem("preferred-language") ||
          (navigator.language && navigator.language.startsWith("zh")
            ? "zh-TW"
            : "en");
        document.documentElement.setAttribute("lang", currentLang);
      } catch (e) {
        console.error("基本語言初始化失敗:", e);
      }
    }

    // Add custom event for language switching
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const lang = this.getAttribute("data-lang");

          //Priority use the enhanced version language switching function
          if (typeof enhancedSetLanguage === "function") {
            enhancedSetLanguage(lang);
          } else if (typeof setLanguageWithAnimation === "function") {
            //Secondary priority to use language switching with animation
            setLanguageWithAnimation(lang);
          } else if (typeof setLanguage === "function") {
            //Compatibility processing, use basic language switching function
            setLanguage(lang);
          } else {
            console.warn("Language switching function is not available");
            //Most basic processing - update HTML lang attribute and save preference
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);
            } catch (e) {
              console.error("Basic language switching failed:", e);
            }
          }
        });
      });
    } catch (e) {
      console.error("Error adding event listener for language button:", e);
    }

    // Execute batch translation at initialization to optimize performance
    if (typeof batchApplyTranslations === "function") {
      batchApplyTranslations();
    }
  } else {
    console.warn("i18n.js has not been loaded, unable to enable complete multi-language functionality");
    // Try to provide basic multi-language support
    try {
      const basicLanguageSupport = function () {
        const langBtns = document.querySelectorAll(".lang-btn");
        if (langBtns.length === 0) return;

        langBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            const lang = this.getAttribute("data-lang");
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);

              // Update button state
              langBtns.forEach((b) => {
                if (b.getAttribute("data-lang") === lang) {
                  b.classList.add("active");
                } else {
                  b.classList.remove("active");
                }
              });
            } catch (e) {
              console.error("Basic language switching failed:", e);
            }
          });
        });

        // Initialize button state
        try {
          const savedLang =
            localStorage.getItem("preferred-language") ||
            (navigator.language && navigator.language.startsWith("zh")
              ? "zh-TW"
              : "en");

          langBtns.forEach((btn) => {
            if (btn.getAttribute("data-lang") === savedLang) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });

          document.documentElement.setAttribute("lang", savedLang);
        } catch (e) {
          console.error("Failed to initialize language button state:", e);
        }
      };

      basicLanguageSupport();
    } catch (e) {
      console.error("Basic multilingual support initialization failed:", e);
    }
  }

  // Listen for language change events
  try {
    document.addEventListener("languageChanged", function (event) {
      const lang = event.detail.language;
      console.log("Language changed to:", lang);

      // Use translateText function to update special elements
      const updateSpecialElements = function () {
        // Safely get translation function
        const getTranslation = (key, defaultText) => {
          if (typeof safeTranslate === "function") {
            return safeTranslate(key, defaultText);
          } else if (typeof translateText === "function") {
            return translateText(key, defaultText);
          } else {
            return lang === "en" ? defaultText.en : defaultText.zh;
          }
        };

        try {
          // Update copy button text
          const copyBtns = document.querySelectorAll(".copy-cmd-btn");
          const copyText = getTranslation("common.copy", {
            en: "Copy",
            zh: "複製",
          });

          copyBtns.forEach((btn) => {
            // Only update buttons that do not display "Copied!" or "Copied!"
            if (
              btn.textContent !== "Copied!" &&
              btn.textContent !== "Copied!"
            ) {
              btn.textContent = copyText;
            }
          });
        } catch (e) {
          console.warn("Failed to update copy button text:", e);
        }

        try {
          // Update modal window close button text
          const closeModalBtn = document.getElementById("close-modal-btn");
          if (closeModalBtn) {
            closeModalBtn.textContent = getTranslation("common.close", {
              en: "Close",
              zh: "關閉",
            });
          }
        } catch (e) {
          console.warn("Failed to update close button text:", e);
        }
      };

      // Use setTimeout to avoid blocking UI
      setTimeout(updateSpecialElements, 0);

      // Update workflow modal window content according to current language
      try {
        updateWorkflowModalContent(lang);
      } catch (e) {
        console.warn("Failed to update workflow modal content:", e);
      }
    });
  } catch (e) {
    console.error("Failed to add language change event listener:", e);
  }
}

/**
 * Update workflow modal window content according to current language
 * @param {string} lang - Current language code ("en" or "zh-TW")
 */
function updateWorkflowModalContent(lang) {
  const modal = document.getElementById("workflow-detail-modal");
  if (!modal) return;

  // Get the currently displayed step
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const currentStep = modal.getAttribute("data-current-step");

  if (currentStep && modalTitle && modalContent) {
    // Get corresponding language content from workflow details
    const workflowDetails = getWorkflowDetails();
    const langKey = lang === "en" ? "en" : "zh-TW";

    if (workflowDetails[langKey] && workflowDetails[langKey][currentStep]) {
      const stepData = workflowDetails[langKey][currentStep];

      // Use requestAnimationFrame to optimize rendering performance
      requestAnimationFrame(function () {
        modalTitle.textContent = stepData.title;
        modalContent.innerHTML = stepData.content;

        // Add data-i18n attribute to dynamically generated content
        const dynamicElements = modalContent.querySelectorAll("h4, p, li");
        dynamicElements.forEach(function (el, index) {
          const key = `workflow.step${currentStep}.content.${index}`;
          el.setAttribute("data-i18n-dynamic", key);
        });
      });
    }
  }
}

/**
 * Get workflow details data
 * @returns {Object} Workflow details object
 */
function getWorkflowDetails() {
  // Return workflow details data
  return {
    // Keep existing data unchanged
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
    "zh-TW": {
      1: {
        title: "任務規劃",
        content: `
          <p>任務規劃階段是初始階段，AI助手定義項目範圍、設定目標，並建立成功標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>釐清項目需求和約束條件</li>
            <li>設定明確目標和定義可衡量的成功標準</li>
            <li>確立項目界限和識別相關利益方</li>
            <li>創建高級計劃及時間估算</li>
            <li>可選擇參考現有任務進行持續規劃</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>全面的任務描述</li>
            <li>明確的成功標準</li>
            <li>技術需求和約束條件</li>
          </ul>
          <p class="mt-4">此階段為所有後續工作奠定基礎，確保AI助手和用戶對需要完成的工作有共同理解。</p>
        `,
      },
      2: {
        title: "深入分析",
        content: `
          <p>深入分析階段涉及對需求和技術環境的徹底檢查，以制定可行的實施策略。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>分析需求並識別技術挑戰</li>
            <li>評估技術可行性和潛在風險</li>
            <li>研究最佳實踐和可用解決方案</li>
            <li>系統性地審查現有代碼庫（如適用）</li>
            <li>開發初步實施概念</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>技術可行性評估</li>
            <li>風險識別和緩解策略</li>
            <li>初步實施方法</li>
            <li>適當的偽代碼或架構圖</li>
          </ul>
          <p class="mt-4">此階段確保在進行實施前，提出的解決方案在技術上是合理的，並能處理所有需求。</p>
        `,
      },
      3: {
        title: "方案反思",
        content: `
          <p>方案反思階段涉及在實施前對提出的方法進行批判性審查和優化。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>批判性審查分析結果和提出的解決方案</li>
            <li>識別潛在差距、邊緣情況或低效問題</li>
            <li>考慮替代方法及其權衡</li>
            <li>根據最佳實踐和設計原則評估解決方案</li>
            <li>根據洞察優化實施策略</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>優化後的解決方案設計</li>
            <li>記錄的考慮事項和權衡</li>
            <li>改進的實施策略</li>
          </ul>
          <p class="mt-4">這種反思過程有助於及早發現潛在問題，並確保在投入實施前所選方法是最佳選擇。</p>
        `,
      },
      4: {
        title: "任務分解",
        content: `
          <p>任務分解階段將複雜任務分解為可管理的原子子任務，並建立明確的依賴關係和執行順序。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>將複雜任務分解為更小、可管理的單元</li>
            <li>建立子任務之間的明確依賴關係</li>
            <li>為每個子任務定義範圍和驗收標準</li>
            <li>分配優先級別並評估複雜度</li>
            <li>創建邏輯執行順序</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">支持的更新模式：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>追加(append)：</strong>保留所有現有任務並添加新任務</li>
            <li><strong>覆蓋(overwrite)：</strong>清除所有未完成的任務並完全替換，同時保留已完成的任務</li>
            <li><strong>選擇性更新(selective)：</strong>根據任務名稱智能匹配更新現有任務，同時保留其他任務</li>
            <li><strong>清除所有任務(clearAllTasks)：</strong>移除所有任務並創建備份</li>
          </ul>
          <p class="mt-4">這種結構化方法通過創建由小型、可實現步驟組成的清晰路線圖，使複雜項目變得可管理。</p>
        `,
      },
      5: {
        title: "任務執行",
        content: `
          <p>任務執行階段涉及按照預定計劃實施特定任務，重點關注質量和需求遵從。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>根據依賴和優先順序選擇要執行的任務</li>
            <li>按照實施指南實施解決方案</li>
            <li>遵循編碼標準和最佳實踐</li>
            <li>處理邊緣情況和錯誤條件</li>
            <li>記錄實施決策和理由</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "結果驗證",
        content: `
          <p>結果驗證階段確保已實施的任務在標記為完成前滿足所有需求和質量標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "任務完成",
        content: `
          <p>任務完成階段正式將任務標記為已完成，生成詳細的完成報告，並更新相關依賴任務的狀態。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>成功驗證後正式將任務標記為已完成</li>
            <li>生成全面的完成報告</li>
            <li>更新依賴任務的狀態</li>
            <li>歸檔相關信息以供將來參考</li>
            <li>向利益相關者傳達完成情況</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
  };
}
