const $ = (selector) => document.querySelector(selector);
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", (event) => { if (event.target.matches("a")) navLinks.classList.remove("open"); });

const skills = [
  ["HTML", "Frontend", 90], ["CSS", "Frontend", 88], ["JavaScript", "Frontend", 85],
  ["React", "Frontend", 75], ["Node.js", "Backend", 78], ["Express.js", "Backend", 75],
  ["PostgreSQL", "Database", 72], ["MongoDB", "Database", 65], ["Git & GitHub", "Tools", 82], ["Python", "Programming", 70]
];

const projects = [
  { title:"Personal Portfolio", description:"Responsive developer portfolio with sections for profile, skills, projects and contact information.", tech:["HTML","CSS","JavaScript"], liveUrl:"", githubUrl:"", featured:true },
  { title:"Calculator App", description:"Responsive calculator application with a clean interface and interactive JavaScript functionality.", tech:["HTML","CSS","JavaScript"], liveUrl:"https://arpitkumar-coder.github.io/Calculator/", githubUrl:"", featured:true },
  { title:"Uber Clone", description:"Ride-booking style web application project demonstrating modern UI and full-stack development concepts.", tech:["React","Node.js","Express"], liveUrl:"", githubUrl:"", featured:false },
  { title:"Online Therapy Platform", description:"Web application concept designed to connect users with online therapy services through a simple interface.", tech:["HTML","CSS","JavaScript","Node.js"], liveUrl:"", githubUrl:"", featured:false },
  { title:"IoT Fire Alert System", description:"Arduino-based fire and smoke monitoring system using sensors, buzzer and GSM communication for alerts.", tech:["Arduino","IoT","Sensors","GSM"], liveUrl:"", githubUrl:"", featured:false },
  { title:"Brain Tumor MRI Classification", description:"Deep-learning project for preliminary classification of MRI images into glioma, meningioma, pituitary tumor and healthy classes.", tech:["Python","CNN","Transfer Learning","MRI"], liveUrl:"", githubUrl:"", featured:true }
];

function escapeHtml(value="") { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
function safeUrl(value="") { try { const u=new URL(value); return ["http:","https:"].includes(u.protocol) ? u.href : "#"; } catch { return "#"; } }

$("#skillsGrid").innerHTML = skills.map(([name, category, level]) => `
  <article class="skill"><div class="skill-top"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(category)} · ${level}%</small></div><div class="bar"><span style="width:${level}%"></span></div></article>
`).join("");

$("#projectsGrid").innerHTML = projects.map(project => `
  <article class="project"><p class="eyebrow">${project.featured ? "FEATURED PROJECT" : "PROJECT"}</p><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p>
  <div class="tags">${project.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
  <div class="project-links">${project.liveUrl ? `<a href="${safeUrl(project.liveUrl)}" target="_blank" rel="noreferrer">Live ↗</a>` : ""}${project.githubUrl ? `<a href="${safeUrl(project.githubUrl)}" target="_blank" rel="noreferrer">GitHub ↗</a>` : ""}</div></article>
`).join("");

$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const recipient = "YOUR_EMAIL@example.com";
  const subject = encodeURIComponent(data.subject || "Portfolio Contact");
  const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  $("#formStatus").textContent = "Opening your email app...";
});

$("#year").textContent = new Date().getFullYear();
