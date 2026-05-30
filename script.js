// Helpers
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

/* Year */
$("#year").textContent = String(new Date().getFullYear());

/* Mobile nav */
const toggle = $(".nav-toggle");
const navLinks = $("#navLinks");

toggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

/* Close nav when clicking a link (mobile) */
$$(".nav-links a").forEach(a => {
  a.addEventListener("click", () => {
    if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

/* Filter projects */
const filters = $$(".filter");
const cards = $$(".card");

function setActiveFilter(btn){
  filters.forEach(b => {
    b.classList.toggle("active", b === btn);
    b.setAttribute("aria-selected", String(b === btn));
  });
}

function applyFilter(tag){
  cards.forEach(card => {
    const tags = (card.dataset.tags || "").split(" ").filter(Boolean);
    const show = tag === "all" ? true : tags.includes(tag);
    card.style.display = show ? "" : "none";
  });
}

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.filter;
    setActiveFilter(btn);
    applyFilter(tag);
  });
});

/* Modal (project details) */
const modal = $("#projectModal");
const modalClose = $("#modalClose");

function openProject(card){
  $("#mTitle").textContent = card.dataset.title || "Prosjekt";
  $("#mSubtitle").textContent = card.dataset.subtitle || "";
  $("#mDesc").textContent = card.dataset.desc || "";
  $("#mRole").textContent = card.dataset.role || "";
  $("#mTech").textContent = card.dataset.tech || "";

  // Bullets
  const ul = $("#mBullets");
  ul.innerHTML = "";
  const bullets = (card.dataset.bullets || "").split("|").map(s => s.trim()).filter(Boolean);
  bullets.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    ul.appendChild(li);
  });

  // Links
  const linkWrap = $("#mLinks");
  linkWrap.innerHTML = "";
  let links = [];
  try { links = JSON.parse(card.dataset.links || "[]"); } catch {}
  links.forEach(l => {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = l.url || "#";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = l.label || "Lenke";
    linkWrap.appendChild(a);
  });

  modal.showModal();
}

function closeModal(){
  modal.close();
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  const rect = modal.getBoundingClientRect();
  const inDialog =
    rect.top <= e.clientY && e.clientY <= rect.bottom &&
    rect.left <= e.clientX && e.clientX <= rect.right;
  if (!inDialog) closeModal();
});

cards.forEach(card => {
  card.addEventListener("click", () => openProject(card));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProject(card);
    }
  });
});

/* Contact form: copy an email draft */
const form = $("#contactForm");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);

  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const message = String(fd.get("message") || "").trim();

  const draft =
`Hei Sander,

Navn: ${name}
E-post: ${email}

Melding:
${message}
`;

  try{
    await navigator.clipboard.writeText(draft);
    $("#formHint").textContent = "Kopiert! Lim inn i en e-post og send til: sandervinterhus@hotmail.no";
  }catch{
    $("#formHint").textContent = "Kunne ikke kopiere automatisk. Marker teksten manuelt i skjemaet og kopier.";
  }
});

/* Gallery images from /assets */
const galleryFiles = [
 
  "IMG_1167-2.jpg",
  "IMG_1229-2.jpg",
  "IMG_1264-2.jpg",
  "IMG_1050-2.jpg",
  "IMG_1271-2.jpg",
  "IMG_1296-2.jpg",
  "IMG_3293-2.jpg",
  "IMG_3229-2.jpg",
  "IMG_1298-2.jpg",
  "IMG_3625-2.jpg",
  "IMG_3548-2.jpg",
  "IMG_3327-2.jpg",
//   "IMG_7561-2.jpg",
//   "IMG_7562-2.jpg",  
  "IMG_3723-2.jpg",
  "IMG_3782-2.jpg",
  "IMG_3787-2.jpg",
  "IMG_5012-2.jpg",
  "IMG_4849-2.jpg",
  "IMG_4855-2.jpg",
  "IMG_5379-2.jpg",
  "IMG_5630-2.jpg",
  "IMG_3643.jpg",
  "IMG_3363.jpg",
  "DSC_0062.jpg",
  "DSC_0208.jpg",
  "mg_9199.jpg",
  "mg_9203.jpg",
  "mg_9234.jpg",
  "mg_9264.jpg",
  "mg_9362.jpg",
  "mg_9488.jpg",
  
];

const galleryGrid = document.getElementById("galleryGrid");

if (galleryGrid) {
  galleryFiles.forEach((file) => {
    const thumbSrc = `assets/optimized/thumb-${file}`;
    const fullSrc = `assets/optimized/full-${file}`;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "gallery-item";
    item.setAttribute("aria-label", `Åpne bilde ${file}`);

    item.innerHTML = `
      <img src="${thumbSrc}" alt="" width="900" height="600" loading="lazy" decoding="async" />
      <div class="gallery-cap">${file}</div>
    `;

    item.addEventListener("click", () => openLightbox(fullSrc));
    galleryGrid.appendChild(item);
  });
}

/* Lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = "Bilde i full størrelse";
  lightbox.showModal();
}

function closeLightbox() {
  lightbox?.close();
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (e) => {
  const rect = lightbox.getBoundingClientRect();
  const inDialog =
    rect.top <= e.clientY && e.clientY <= rect.bottom &&
    rect.left <= e.clientX && e.clientX <= rect.right;
  if (!inDialog) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox?.open) closeLightbox();
});

/* Clickable profile image */
const profileImg = document.querySelector(".profile-click");

if (profileImg) {
  const openProfile = () => {
    openLightbox("assets/optimized/profile-full.jpg");
  };

  profileImg.addEventListener("click", openProfile);

  profileImg.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProfile();
    }
  });
}
