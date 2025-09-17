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
});