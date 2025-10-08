document.addEventListener('DOMContentLoaded', () => {
  // Wait for the DOM to be fully loaded before running the script

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link').forEach(link => { // Select all navigation links
    link.addEventListener('click', function(e) { // Add click event to each nav link
      const targetId = this.getAttribute('href').slice(1); // Get the target section's ID (remove '#')
      const target = document.getElementById(targetId); // Find the section element by ID
      if (target) { // If the section exists
        e.preventDefault(); // Prevent default anchor jump
        window.scrollTo({
          top: target.offsetTop - document.querySelector('.navbar').offsetHeight, // Scroll to section, offset by navbar height
          behavior: 'smooth' // Enable smooth scrolling
        });
      }
    });
  });

  // Highlight nav link on scroll
  const sections = document.querySelectorAll('main section'); // Select all main sections
  const navLinks = document.querySelectorAll('.nav-link'); // Select all nav links
  window.addEventListener('scroll', () => { // Listen for scroll events
    let current = ''; // Track the current section
    let minDist = Infinity; // Track the minimum distance from top
    const navbarHeight = document.querySelector('.navbar').offsetHeight; // Get navbar height
    sections.forEach(section => { // For each section
      const rect = section.getBoundingClientRect(); // Get section's position relative to viewport
      const dist = Math.abs(rect.top - navbarHeight); // Calculate distance from navbar
      if (dist < minDist) { // If this section is closer than previous
        minDist = dist; // Update minimum distance
        current = section.getAttribute('id'); // Set current section ID
      }
    });
    navLinks.forEach(link => { // For each nav link
      link.classList.remove('active'); // Remove active class
      if (link.getAttribute('href') === '#' + current) { // If link matches current section
        link.classList.add('active'); // Add active class
      }
    });
  });

  // Animate sections on scroll
  const observer = new IntersectionObserver((entries) => { // Create an intersection observer
    entries.forEach(entry => { // For each observed entry
      if (entry.isIntersecting) { // If section is in view
        entry.target.classList.add('animate-fadein'); // Add fade-in animation class
      }
    });
  }, { threshold: 0.15 }); // Trigger when 15% of section is visible
  document.querySelectorAll('.section').forEach(section => { // For each section
    observer.observe(section); // Observe for intersection (scroll into view)
  });

  // Copy email to clipboard when email icon is clicked and show a temporary tooltip
  const emailAnchor = document.getElementById('email-copy');
  if (emailAnchor) {
    emailAnchor.addEventListener('click', async (e) => {
      e.preventDefault(); // prevent any navigation or mail client opening
      const email = emailAnchor.getAttribute('data-email') || 'booiprince0@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showTooltip(emailAnchor, 'Email copied to clipboard');
      } catch (err) {
        // Fallback: create a temporary input to copy
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();
        try {
          document.execCommand('copy');
          showTooltip(emailAnchor, 'Email copied to clipboard');
        } catch (e2) {
          showTooltip(emailAnchor, 'Copy failed');
        }
        document.body.removeChild(input);
      }
    });
  }

  function showTooltip(targetEl, text) {
    // remove existing tooltip if any
    const existing = document.getElementById('temp-tooltip');
    if (existing) existing.remove();
    const tip = document.createElement('div');
    tip.id = 'temp-tooltip';
    tip.textContent = text;
    Object.assign(tip.style, {
      position: 'absolute',
      padding: '6px 10px',
      background: '#222',
      color: '#fff',
      borderRadius: '6px',
      fontSize: '13px',
      zIndex: 1000,
      opacity: '0',
      transition: 'opacity 150ms ease-in-out'
    });
    document.body.appendChild(tip);
    const rect = targetEl.getBoundingClientRect();
    tip.style.left = (window.scrollX + rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
    tip.style.top = (window.scrollY + rect.top - tip.offsetHeight - 8) + 'px';
    // force reflow then show
    void tip.offsetWidth;
    tip.style.opacity = '1';
    setTimeout(() => {
      tip.style.opacity = '0';
      setTimeout(() => tip.remove(), 200);
    }, 1500);
  }
});