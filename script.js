const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const contactFields = [...contactForm.querySelectorAll("[required]")];
const phoneField = document.querySelector("#contact-phone");
const currentYear = document.querySelector("#current-year");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#primary-navigation");
const projectCards = [...document.querySelectorAll(".project-card")];
const projectFilterStatus = document.querySelector("#project-filter-status");
const lightbox = document.querySelector("#project-lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxTitle = lightbox.querySelector("#lightbox-title");
const lightboxCaption = lightbox.querySelector("#lightbox-caption");
let contactFormSubmitted = false;

currentYear.textContent = new Date().getFullYear();

function filterProjects(category) {
    const filterExists = [...document.querySelectorAll(".filter-button")]
        .some((button) => button.dataset.filter === category);
    if (!filterExists) return;

    let visibleCount = 0;
    projectCards.forEach((card) => {
        const isVisible = category === "all" || card.dataset.category === category;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
    });

    document.querySelectorAll(".filter-button").forEach((button) => {
        const isSelected = button.dataset.filter === category;
        button.classList.toggle("is-active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });

    projectFilterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"} shown.`;
}

document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => filterProjects(button.dataset.filter));
});

document.querySelectorAll(".project-image-trigger").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".project-card");
        const image = button.querySelector("img");
        const projectName = card.querySelector("h3").textContent;
        const figureCaption = card.querySelector("figcaption").textContent;

        lightboxTitle.textContent = projectName;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = figureCaption;
        lightbox.showModal();
    });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
    lightbox.close();
});

lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        lightbox.close();
    }
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.close();
    }
});

function setMenuOpen(isOpen) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    siteNav.classList.toggle("is-open", isOpen);
}

function toggleMenu() {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
}

menuToggle.addEventListener("click", toggleMenu);

siteNav.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    setMenuOpen(false);

    if (window.location.hash !== link.hash) {
        window.history.pushState(null, "", link.hash);
    }

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    target.scrollIntoView({ behavior, block: "start" });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) return;

    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuToggle.focus();
    }
});

function validateContactField(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    let errorMessage = "";

    if (!field.value.trim()) {
        errorMessage = field.type === "email" ? "Please enter your email address." : `Please enter your ${field.name}.`;
    } else if (field.type === "email" && field.validity.typeMismatch) {
        errorMessage = "Please enter a valid email address (for example, name@example.com).";
    }

    field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    errorElement.textContent = errorMessage;
    return !errorMessage;
}

contactFields.forEach((field) => {
    field.addEventListener("blur", () => validateContactField(field));
    field.addEventListener("input", () => {
        if (contactFormSubmitted || field.hasAttribute("aria-invalid")) {
            validateContactField(field);
        }
        formStatus.textContent = "";
    });
});

phoneField.addEventListener("input", () => {
    const allowedCharacters = phoneField.value.replace(/[^0-9+\s-]/g, "");
    const hadDisallowedCharacters = allowedCharacters !== phoneField.value;
    phoneField.value = allowedCharacters;
    phoneField.setAttribute("aria-invalid", String(hadDisallowedCharacters));
    document.querySelector("#contact-phone-error").textContent = hadDisallowedCharacters
        ? "Use numbers, an optional +, spaces, or hyphens."
        : "";
    formStatus.textContent = "";
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactFormSubmitted = true;

    const invalidFields = contactFields.filter((field) => !validateContactField(field));
    if (invalidFields.length > 0) {
        formStatus.textContent = "Please correct the highlighted fields before continuing.";
        invalidFields[0].focus();
        return;
    }

    formStatus.textContent = "Your message is valid, but this demo form is not connected to a service, so it was not sent.";
});