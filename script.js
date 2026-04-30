document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.nav-link');
  const emailAnchor = document.getElementById('email-copy');
  const projectsGrid = document.getElementById('github-projects');
  const projectsStatus = document.getElementById('projects-status');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));

      if (!target || !navbar) return;

      event.preventDefault();
      window.scrollTo({
        top: target.offsetTop - navbar.offsetHeight - 12,
        behavior: 'smooth'
      });
    });
  });

  const setActiveLink = () => {
    if (!navbar) return;

    let current = '';
    const offset = navbar.offsetHeight + 36;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadein');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach((section) => observer.observe(section));

  if (emailAnchor) {
    emailAnchor.addEventListener('click', async (event) => {
      event.preventDefault();
      const email = emailAnchor.dataset.email || 'booiprince0@gmail.com';

      try {
        await navigator.clipboard.writeText(email);
        showTooltip(emailAnchor, 'Email copied');
      } catch {
        const input = document.createElement('input');
        input.value = email;
        document.body.appendChild(input);
        input.select();

        try {
          document.execCommand('copy');
          showTooltip(emailAnchor, 'Email copied');
        } catch {
          showTooltip(emailAnchor, 'Copy failed');
        } finally {
          input.remove();
        }
      }
    });
  }

  if (projectsGrid) {
    loadGitHubProjects(projectsGrid, projectsStatus);
  }
});

async function loadGitHubProjects(projectsGrid, projectsStatus) {
  const username = projectsGrid.dataset.githubUser || 'PBooi70';
  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/vnd.github+json' }
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`);
    }

    const repos = await response.json();
    const projects = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at))
      .slice(0, 6);

    if (!projects.length) {
      throw new Error('No public repositories found');
    }

    projectsGrid.replaceChildren(...projects.map(createProjectCard));

    if (projectsStatus) {
      projectsStatus.textContent = `Showing ${projects.length} latest public repositories from GitHub.`;
    }
  } catch (error) {
    console.warn(error);

    if (projectsStatus) {
      projectsStatus.textContent = 'Showing featured projects. Live GitHub repositories could not be loaded right now.';
    }
  }
}

function createProjectCard(repo) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const content = document.createElement('div');
  const kicker = document.createElement('p');
  kicker.className = 'project-kicker';
  kicker.textContent = repo.language || 'GitHub Repository';

  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = repo.html_url;
  titleLink.target = '_blank';
  titleLink.rel = 'noopener';
  titleLink.textContent = formatRepoName(repo.name);
  title.appendChild(titleLink);

  const description = document.createElement('p');
  description.textContent = repo.description || 'Public repository from Prince Booi on GitHub.';

  content.append(kicker, title, description);

  const meta = document.createElement('div');
  meta.className = 'project-meta';
  meta.append(
    createMetaItem('Updated', formatDate(repo.pushed_at || repo.updated_at)),
    createMetaItem('Stars', repo.stargazers_count)
  );

  if (repo.topics?.length) {
    meta.append(createMetaItem('Topics', repo.topics.slice(0, 3).join(', ')));
  }

  const repoLink = document.createElement('a');
  repoLink.className = 'text-link';
  repoLink.href = repo.html_url;
  repoLink.target = '_blank';
  repoLink.rel = 'noopener';
  repoLink.textContent = 'View on GitHub';

  card.append(content, meta, repoLink);
  return card;
}

function createMetaItem(label, value) {
  const item = document.createElement('span');
  item.textContent = `${label}: ${value}`;
  return item;
}

function formatRepoName(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return 'Recently';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

function showTooltip(target, text) {
  document.getElementById('temp-tooltip')?.remove();

  const tooltip = document.createElement('div');
  tooltip.id = 'temp-tooltip';
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  const rect = target.getBoundingClientRect();
  tooltip.style.left = `${window.scrollX + rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
  tooltip.style.top = `${window.scrollY + rect.top - tooltip.offsetHeight - 10}px`;

  requestAnimationFrame(() => tooltip.classList.add('visible'));

  window.setTimeout(() => {
    tooltip.classList.remove('visible');
    window.setTimeout(() => tooltip.remove(), 180);
  }, 1500);
}
