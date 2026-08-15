document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons({ attrs: { width: 17, height: 17, "stroke-width": 1.8 } });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".nav-links");
  const navigationLinks = [...document.querySelectorAll(".nav-links a")];

  const closeNavigation = () => {
    navigation?.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.innerHTML = '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 21, height: 21 } });
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = navigation?.classList.toggle("nav-open") || false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 21, height: 21 } });
  });

  navigationLinks.forEach((link) => link.addEventListener("click", closeNavigation));

  const sections = [...document.querySelectorAll(".page-section")];
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navigationLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { threshold: [0.25, 0.5, 0.75] });
  sections.forEach((section) => observer.observe(section));

  const commentForm = document.querySelector("#comment-form");
  const commentList = document.querySelector(".comment-list");
  const commentCount = document.querySelector(".comment-count");
  const uploadButton = document.querySelector(".upload-box");
  const uploadLabel = document.querySelector(".upload-box span");
  const fileInput = document.querySelector(".hidden-input");
  let selectedPhoto = "";

  const loadComments = () => {
    try { return JSON.parse(localStorage.getItem("yogesh-portfolio-comments") || "[]"); }
    catch { return []; }
  };

  let comments = loadComments();

  const renderComments = () => {
    if (!commentList || !commentCount) return;
    commentCount.textContent = `(${comments.length})`;
    commentList.innerHTML = "";

    if (!comments.length) {
      const empty = document.createElement("div");
      empty.className = "empty-comments";
      empty.innerHTML = '<i data-lucide="user-round"></i><p>No comments yet, be the first to post!</p>';
      commentList.appendChild(empty);
    } else {
      comments.forEach((comment) => {
        const item = document.createElement("article");
        item.className = "comment-item";

        const avatar = comment.photo ? document.createElement("img") : document.createElement("span");
        if (comment.photo) { avatar.src = comment.photo; avatar.alt = ""; }
        else avatar.innerHTML = '<i data-lucide="user-round"></i>';

        const content = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = comment.name;
        const date = document.createElement("small");
        date.textContent = comment.date;
        title.appendChild(date);
        const message = document.createElement("p");
        message.textContent = comment.message;
        content.append(title, message);
        item.append(avatar, content);
        commentList.appendChild(item);
      });
    }
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 20, height: 20 } });
  };

  uploadButton?.addEventListener("click", () => fileInput?.click());
  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      fileInput.value = "";
      return;
    }
    if (uploadLabel) uploadLabel.textContent = file.name;
    const reader = new FileReader();
    reader.onload = () => { selectedPhoto = typeof reader.result === "string" ? reader.result : ""; };
    reader.readAsDataURL(file);
  });

  commentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(commentForm);
    const comment = {
      id: Date.now(),
      name: String(form.get("commentName") || "Guest"),
      message: String(form.get("commentMessage") || ""),
      date: new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date()),
      photo: selectedPhoto,
    };
    comments = [comment, ...comments];
    renderComments();
    try {
      localStorage.setItem("yogesh-portfolio-comments", JSON.stringify(comments.map(({ id, name, message, date }) => ({ id, name, message, date }))));
    } catch { /* The new comment remains visible for the current session. */ }
    commentForm.reset();
    selectedPhoto = "";
    if (uploadLabel) uploadLabel.textContent = "Choose Profile Photo";
  });

  renderComments();
});
