// Shared site-wide JS: AOS init, feather icons, menu/theme toggles, skeleton spinner, and nav handler
(function(){
  // Initialize AOS when library is available
  function initAOS(){
    if(window.AOS && typeof AOS.init === 'function'){
      AOS.init({ once: true, duration: 1000 });
    }
  }

  // Replace feather icons if available
  function initFeather(){
    if(window.feather && typeof feather.replace === 'function'){
      feather.replace();
    }
  }

  // Mobile menu toggle
  function initMenuToggle(){
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if(menuBtn && mobileMenu){
      menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
  }

  // Theme toggle (dark / light) safe initializer
  function initThemeToggle(){
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    try{
      if(themeIcon){
        if(localStorage.getItem('theme') === 'dark'){
          document.documentElement.classList.add('dark');
          themeIcon.setAttribute('data-feather','moon');
        } else {
          document.documentElement.classList.remove('dark');
          themeIcon.setAttribute('data-feather','sun');
        }
      }

      if(themeToggle){
        themeToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          if(document.documentElement.classList.contains('dark')){
            if(themeIcon) themeIcon.setAttribute('data-feather','moon');
            localStorage.setItem('theme','dark');
          } else {
            if(themeIcon) themeIcon.setAttribute('data-feather','sun');
            localStorage.setItem('theme','light');
          }
          initFeather();
        });
      }
    }catch(e){
      console.warn('Theme toggle init failed', e);
    }
  }

  // Fade out + remove skeleton overlay once all resources are loaded
  function initSkeletonFade(){
    window.addEventListener('load', function() {
      const s = document.getElementById('skeleton');
      if (!s) return;
      setTimeout(function() {
        s.style.transition = 'opacity 300ms ease';
        s.style.opacity = '0';
        setTimeout(function() { s.remove(); }, 350);
      }, 250);
    });
  }

  // Create a compact spinner overlay used for navigation clicks and return it
  function createSkeletonSpinner(){
    const existing = document.getElementById('skeleton-spinner');
    if(existing) return existing;
    const spinner = document.createElement('div');
    spinner.id = 'skeleton-spinner';
    spinner.className = 'fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900';
    spinner.style.zIndex = '99999';
    spinner.innerHTML = '\n          <div class="flex flex-col items-center gap-4">\n            <div class="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 rounded-full animate-spin"></div>\n            <div class="text-sm text-gray-700 dark:text-gray-300">Loading…</div>\n          </div>\n        ';
    document.body.appendChild(spinner);
    return spinner;
  }

  // Nav link click handler: show skeleton then navigate
  function handleNavClick(e){
    const a = e.currentTarget;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#')) return; // ignore in-page anchors
    e.preventDefault();
    createSkeletonSpinner();
    requestAnimationFrame(function(){ window.location.href = href; });
  }

  function attachNavHandlers(){
    const links = document.querySelectorAll('nav a, #mobileMenu a');
    links.forEach(l => l.addEventListener('click', handleNavClick));
  }

  // Run safe initializers when DOM is ready
  document.addEventListener('DOMContentLoaded', function(){
    initFeather();
    initMenuToggle();
    initThemeToggle();
    attachNavHandlers();
    initAOS();
  });

  // Run any window-load behaviors
  initSkeletonFade();

})();
