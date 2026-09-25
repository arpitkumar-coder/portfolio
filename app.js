const $ = (selector) => document.querySelector(selector);

const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) navLinks.classList.remove("open");
});

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase();
}

function renderPortfolio(data) {
  const { profile, skills, projects } = data;

  document.title = `${profile.name} | Portfolio`;
  $("#heroName").textContent = profile.name;
  $("#heroRole").textContent = profile.role;
  $("#heroBio").textContent = profile.bio;
  $("#aboutText").textContent = profile.bio;
  $("#avatar").textContent = initials(profile.name);
  $("#location").textContent = profile.location || "";
  $("#emailLink").textContent = profile.email;
  $("#emailLink").href = `mailto:${profile.email}`;
  $("#githubLink").href = profile.github || "#";
  $("#linkedinLink").href = profile.linkedin || "#";
  $("#footerName").textContent = profile.name;

  $("#skillsGrid").innerHTML = skills.map(skill => `
    <article class="skill">
      <div class="skill-top">
        <strong>${escapeHtml(skill.name)}</strong>
        <small>${escapeHtml(skill.category)} · ${skill.level}%</small>
      </div>
      <div class="bar"><span style="width:${skill.level}%"></span></div>
    </article>
  `).join("");

  $("#projectsGrid").innerHTML = projects.map(project => `
    <article class="project">
      <p class="eyebrow">${project.featured ? "FEATURED PROJECT" : "PROJECT"}</p>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tags">
        ${(project.tech || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>
      <div class="project-links">
        ${project.liveUrl ? `<a href="${safeUrl(project.liveUrl)}" target="_blank" rel="noreferrer">Live ↗</a>` : ""}
        ${project.githubUrl ? `<a href="${safeUrl(project.githubUrl)}" target="_blank" rel="noreferrer">GitHub ↗</a>` : ""}
      </div>
    </article>
  `).join("");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function safeUrl(value = "") {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}

async function loadPortfolio() {
  try {
    const response = await fetch("/api/portfolio");
    const result = await response.json();

    if (!response.ok || !result.success) throw new Error(result.message);
    renderPortfolio(result.data);
  } catch (error) {
    console.error(error);
    $("#heroName").textContent = "Portfolio unavailable";
    $("#heroBio").textContent = "Start the backend and make sure MongoDB is running.";
  }
}

$("#contactForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = $("#formStatus");
  const button = form.querySelector("button");
  const payload = Object.fromEntries(new FormData(form).entries());

  status.textContent = "Sending...";
  button.disabled = true;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) throw new Error(result.message);

    status.textContent = "Thanks! Your message has been sent.";
    form.reset();
  } catch (error) {
    status.textContent = error.message || "Unable to send message.";
  } finally {
    button.disabled = false;
  }
});

$("#year").textContent = new Date().getFullYear();
loadPortfolio();
