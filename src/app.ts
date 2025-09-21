const mobileMenuButton = document.querySelector(".nav__menu-btn") as HTMLButtonElement;
const mobileMenu = document.querySelector(".nav__menu") as HTMLElement;
const submenuButtons = document.querySelectorAll(".nav__submenu-btn") as NodeListOf<HTMLButtonElement>;
const submenus = document.querySelectorAll(".nav__submenu-list") as NodeListOf<HTMLElement>;

let openingSubmenuIndex = -1;

submenuButtons.forEach((element, index) => {
    const expanded = () => element.getAttribute("aria-expanded") === "true";

    element.addEventListener("click", () => {
        if (openingSubmenuIndex != index && openingSubmenuIndex != -1) {
            submenuButtons[openingSubmenuIndex].setAttribute("aria-expanded", "false");
        }
        openingSubmenuIndex = index;
        element.setAttribute("aria-expanded", String(!expanded()));
    });
});

let isMenuOpened = () => mobileMenuButton.getAttribute("aria-expanded") === "true";

const openMobileMenu = () => {
    document.body.setAttribute("modal-opened", "");
    window.scrollTo({ top: 0 });

    mobileMenuButton.setAttribute("aria-expanded", "true");
};

const closeMobileMenu = () => {
    document.body.removeAttribute("modal-opened");

    submenuButtons.forEach((element) => {
        element.setAttribute("aria-expanded", "false");
    });

    mobileMenuButton.setAttribute("aria-expanded", "false");
};

mobileMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    isMenuOpened() ? closeMobileMenu() : openMobileMenu();
});

mobileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
});

window.addEventListener("click", () => {
    if (isMenuOpened()) closeMobileMenu();

    if (openingSubmenuIndex != -1) {
        submenuButtons[openingSubmenuIndex].setAttribute("aria-expanded", "false");
    }
});

window.addEventListener("resize", () => {
    if (isMenuOpened() && window.matchMedia("(min-width: 54em)").matches) closeMobileMenu();
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !e.shiftKey) {
        if (isMenuOpened()) {
            closeMobileMenu();
            requestAnimationFrame(() => {
                mobileMenuButton.focus();
            });
        }

        if (openingSubmenuIndex !== -1) {
            submenuButtons[openingSubmenuIndex].setAttribute("aria-expanded", "false");
            submenuButtons[openingSubmenuIndex].focus();
            openingSubmenuIndex = -1;
        }
    }
});
