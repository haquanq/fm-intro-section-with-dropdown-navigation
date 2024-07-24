const desktopMenu = {
    mainMenu: document.querySelector(`.nav__menu__wrapper[role="menu"]`),
    mainMenuItemList: document.querySelectorAll(
        `.nav__menu__wrapper > [role="none"] > [role="menuitem"]`
    ),

    accountMenu: document.querySelector(".nav__acount__wrapper"),
    accountMenuItemList: document.querySelectorAll(
        `.nav__account__wrapper > [role="none"] > [role="menuitem"]`
    ),

    featureSubMenuBtn: document.querySelector(
        `.nav__menu__btn[aria-controls="nav-submenu-features"]`
    ),
    featureSubMenu: document.querySelector("#nav-submenu-features"),
    featureSubMenuItemList: document.querySelectorAll(
        `.nav__features__wrapper > [role="none"] > [role="menuitem"]`
    ),

    companySubMenuBtn: document.querySelector(
        `.nav__menu__btn[aria-controls="nav-submenu-company"]`
    ),
    companySubMenu: document.querySelector("#nav-submenu-company"),
    companySubMenuItemList: document.querySelectorAll(
        `.nav__company__wrapper > [role="none"] > [role="menuitem"]`
    ),

    handleMenuItemKeydown(menuItem, idx, p) {
        const functionKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

        menuItem.setAttribute("tabindex", idx == 0 ? "0" : "-1");

        const changeFocus = (fromIdx, toIdx) => {
            p[fromIdx].setAttribute("tabindex", "-1");
            p[toIdx].setAttribute("tabindex", "0");
            p[toIdx].focus();
        };

        menuItem.addEventListener("keydown", (e) => {
            if (functionKeys.includes(e.key)) e.preventDefault();

            const hasSubMenu = menuItem.hasAttribute("aria-controls");
            const hasSubMenuOpened = menuItem.getAttribute("aria-expanded") === "true";

            if (!hasSubMenuOpened && hasSubMenu && e.key == "ArrowDown") {
                menuItem.click();
                requestAnimationFrame(() => {
                    document
                        .querySelector(
                            "#" +
                                menuItem.getAttribute("aria-controls") +
                                ` > [role="none"] > [role="menuitem"][tabindex="0"]`
                        )
                        .focus();

                    return;
                });
            }

            if (["ArrowDown", "ArrowRight"].includes(e.key)) {
                if (idx == p.length - 1) changeFocus(idx, 0);
                else changeFocus(idx, idx + 1);
            } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
                if (idx == 0) changeFocus(idx, p.length - 1);
                else changeFocus(idx, idx - 1);
            } else if (["Home"].includes(e.key)) {
                changeFocus(idx, 0);
            } else if (["End"].includes(e.key)) {
                changeFocus(idx, p.length - 1);
            }
        });
    },
    handleSubMenuBtnClick(btn, menu, menuItems) {
        const expanded = btn.getAttribute("aria-expanded") === "true";

        const openMenu = () => {
            btn.setAttribute("aria-expanded", "true");
            requestAnimationFrame(() => {
                menu.removeAttribute("hidden");
                menu.style.transform = "translateY(8px)";

                requestAnimationFrame(() => {
                    menu.style.transition = "opacity 150ms ease, transform 300ms ease";
                    menu.style.transform = "translateY(0)";
                    menu.style.opacity = "1";

                    menuItems[0].focus();
                });
            });

            document.addEventListener("click", handleDocumentClick);
            document.addEventListener("keydown", handleDocumentKeydown);
        };

        const closeMenu = () => {
            btn.setAttribute("aria-expanded", "false");
            menu.setAttribute("hidden", "");
            menu.style.transition = "";
            menu.style.transform = "";
            menu.style.opacity = "";

            menuItems.forEach((menuItem, idx) => {
                menuItem.setAttribute("tabindex", idx == 0 ? "0" : "-1");
            });

            document.removeEventListener("click", handleDocumentClick);
            document.removeEventListener("keydown", handleDocumentKeydown);
        };

        const handleDocumentClick = (e) => {
            if (!menu.contains(e.target) && !e.target.isEqualNode(btn)) {
                closeMenu();
            }
        };
        const handleDocumentKeydown = (e) => {
            if (e.key == "Escape") {
                closeMenu();
                btn.focus();
            } else if (e.key == "Tab" && document.activeElement !== btn) {
                closeMenu();
            }
        };

        if (expanded) {
            closeMenu();
        } else {
            openMenu();
        }
    },
    init() {
        this.mainMenuItemList.forEach(this.handleMenuItemKeydown);
        this.featureSubMenuItemList.forEach(this.handleMenuItemKeydown);
        this.companySubMenuItemList.forEach(this.handleMenuItemKeydown);
        this.accountMenuItemList.forEach(this.handleMenuItemKeydown);

        this.featureSubMenu.setAttribute("hidden", "");
        this.companySubMenu.setAttribute("hidden", "");
        this.featureSubMenu.style.pointerEvents = "initial";
        this.companySubMenu.style.pointerEvents = "initial";

        this.featureSubMenuBtn.addEventListener("click", (e) => {
            this.handleSubMenuBtnClick(e.target, this.featureSubMenu, this.featureSubMenuItemList);
        });

        this.companySubMenuBtn.addEventListener("click", (e) => {
            this.handleSubMenuBtnClick(e.target, this.companySubMenu, this.companySubMenuItemList);
        });
    },
};

const mobileMenu = {
    dialog: document.querySelector(".mobile-menu__dialog"),
    dialogBtn: document.querySelector("#mobile-menu-btn"),
    dialogOpening: false,

    mainMenu: document.querySelector(`.mobile-menu__wrapper[role="menu"]`),
    mainMenuItemList: document.querySelectorAll(
        `.mobile-menu__wrapper > [role="none"] > [role="menuitem"]`
    ),

    accountMenu: document.querySelector(".mobile-menu__acount__wrapper"),
    accountMenuItemList: document.querySelectorAll(
        `.mobile-menu__account__wrapper > [role="none"] > [role="menuitem"]`
    ),

    featureSubMenuBtn: document.querySelector(
        `.mobile-menu__btn[aria-controls="mobile-menu-submenu-features"]`
    ),
    featureSubMenu: document.querySelector("#mobile-menu-submenu-features"),
    featureSubMenuItemList: document.querySelectorAll(
        `.mobile-menu__features__wrapper > [role="none"] > [role="menuitem"]`
    ),

    companySubMenuBtn: document.querySelector(
        `.mobile-menu__btn[aria-controls="mobile-menu-submenu-company"]`
    ),
    companySubMenu: document.querySelector("#mobile-menu-submenu-company"),
    companySubMenuItemList: document.querySelectorAll(
        `.mobile-menu__company__wrapper > [role="none"] > [role="menuitem"]`
    ),

    requestIdStorage: {},

    openDialog() {
        window.scrollTo({ top: 0 });
        document.body.style.overflow = "hidden";
        this.dialogOpening = true;
        this.dialog.removeAttribute("hidden");
        this.dialog.setAttribute("tabindex", "0");
        this.dialogBtn.classList.add("opened");
        this.dialog.focus();
    },
    closeDialog() {
        document.body.style.overflow = "";
        this.dialogOpening = false;
        this.dialog.setAttribute("hidden", "");
        this.dialog.removeAttribute("tabindex");
        this.dialogBtn.classList.remove("opened");
    },

    saveRequestFrameId(id, value) {
        this.requestIdStorage[id] = value;
    },
    deleteRequestFrameId(id) {
        delete this.requestIdStorage[id];
    },
    getRequestFrameId(id) {
        return this.requestIdStorage[id];
    },

    handleMenuItemKeydown(menuItem, idx, p) {
        const functionKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

        menuItem.setAttribute("tabindex", idx == 0 ? "0" : "-1");

        const changeFocus = (fromIdx, toIdx) => {
            p[fromIdx].setAttribute("tabindex", "-1");
            p[toIdx].setAttribute("tabindex", "0");
            p[toIdx].focus();
        };

        menuItem.addEventListener("keydown", (e) => {
            if (functionKeys.includes(e.key)) e.preventDefault();
            if (["ArrowDown", "ArrowRight"].includes(e.key)) {
                if (idx == p.length - 1) changeFocus(idx, 0);
                else changeFocus(idx, idx + 1);
            } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
                if (idx == 0) changeFocus(idx, p.length - 1);
                else changeFocus(idx, idx - 1);
            } else if (["Home"].includes(e.key)) {
                changeFocus(idx, 0);
            } else if (["End"].includes(e.key)) {
                changeFocus(idx, p.length - 1);
            }
        });
    },
    handleSubMenuBtnClick(btn, menu, menuItems, requestId) {
        const expanded = btn.getAttribute("aria-expanded") === "true";

        const openMenu = () => {
            btn.setAttribute("aria-expanded", "true");
            menu.removeAttribute("hidden");
            menuItems[0].focus();

            const fromHeight = menu.clientHeight;
            menu.style.height = "auto";
            const toHeight = menu.clientHeight;

            if (this.getRequestFrameId(requestId) !== undefined) {
                cancelAnimationFrame(this.getRequestFrameId);
                this.deleteRequestFrameId(requestId);
                menu.style.height = `${fromHeight}px`;
            } else {
                menu.style.height = `0`;
            }

            let startCleanUpTime;
            const cleanUp = (t) => {
                if (startCleanUpTime === undefined) startCleanUpTime = t;
                if (t - startCleanUpTime >= 400) {
                    menu.style.transition = "";
                    menu.style.height = ``;
                    this.deleteRequestFrameId(requestId);
                    return;
                }
                this.saveRequestFrameId(requestId, requestAnimationFrame(cleanUp));
            };
            requestAnimationFrame(() => {
                menu.style.transition = "height 400ms ease";
                menu.style.height = `${toHeight}px`;
                this.saveRequestFrameId(requestId, requestAnimationFrame(cleanUp));
            });

            document.addEventListener("click", handleClickOutside);
            document.addEventListener("keydown", handleKeydown);
        };

        const closeMenu = () => {
            btn.focus();

            menuItems.forEach((menuItem, idx) => {
                menuItem.setAttribute("tabindex", idx == 0 ? "0" : "-1");
            });

            if (this.getRequestFrameId(requestId) !== undefined) {
                cancelAnimationFrame(this.getRequestFrameId(requestId));
                console.log(this.requestIdStorage);
                this.deleteRequestFrameId(requestId);
            }

            menu.style.height = `${menu.clientHeight}px`;

            let startCleanUpTime;
            const cleanUp = (t) => {
                if (startCleanUpTime === undefined) startCleanUpTime = t;
                if (t - startCleanUpTime >= 400) {
                    menu.setAttribute("hidden", "");
                    btn.setAttribute("aria-expanded", "false");
                    menu.style.transition = "";
                    menu.style.height = ``;
                    this.deleteRequestFrameId(requestId);
                    return;
                }
                this.saveRequestFrameId(requestId, requestAnimationFrame(cleanUp));
            };

            requestAnimationFrame(() => {
                menu.style.transition = "height 400ms ease";
                menu.style.height = `0`;
                this.saveRequestFrameId(requestId, requestAnimationFrame(cleanUp));
            });

            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeydown);
        };

        const handleClickOutside = (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                closeMenu();
            }
        };
        const handleKeydown = (e) => {
            if (e.key == "Escape") {
                closeMenu();
            } else if (e.key == "Tab" && document.activeElement !== btn) {
                closeMenu();
            }
        };

        if (expanded) {
            closeMenu();
        } else {
            openMenu();
        }
    },
    init() {
        this.mainMenuItemList.forEach(this.handleMenuItemKeydown);
        this.featureSubMenuItemList.forEach(this.handleMenuItemKeydown);
        this.companySubMenuItemList.forEach(this.handleMenuItemKeydown);
        this.accountMenuItemList.forEach(this.handleMenuItemKeydown);

        this.featureSubMenu.setAttribute("hidden", "");
        this.companySubMenu.setAttribute("hidden", "");
        this.dialog.style.opacity = "1";
        this.dialog.style.pointerEvents = "initial";

        this.dialog.setAttribute("hidden", "");

        document.querySelector(".nav__go-to-mobile-menu").setAttribute("hidden", "");

        this.featureSubMenuBtn.addEventListener("click", (e) => {
            this.handleSubMenuBtnClick(
                this.featureSubMenuBtn,
                this.featureSubMenu,
                this.featureSubMenuItemList,
                "one-1"
            );
        });

        this.companySubMenuBtn.addEventListener("click", (e) => {
            this.handleSubMenuBtnClick(
                this.companySubMenuBtn,
                this.companySubMenu,
                this.companySubMenuItemList,
                "one-2"
            );
        });

        this.dialogBtn.addEventListener("click", (e) => {
            if (this.dialogOpening) {
                this.closeDialog();
            } else {
                this.openDialog();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key == "Escape") {
                const openingFeatres =
                    this.featureSubMenuBtn.getAttribute("aria-expanded") === "true";
                const openingCompany =
                    this.companySubMenuBtn.getAttribute("aria-expanded") === "true";

                if (!openingFeatres && !openingCompany) {
                    this.closeDialog();
                }
                return;
            } else if (
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
            ) {
                return;
            }
            const firstElement = this.dialog;
            const lastElements = [...this.accountMenuItemList];

            if (document.activeElement == firstElement && e.shiftKey) {
                e.preventDefault();
                lastElements.forEach((el) =>
                    el.getAttribute("tabindex") === "0" ? el.focus() : null
                );
            }

            if (lastElements.includes(document.activeElement) && !e.shiftKey) {
                e.preventDefault();
                firstElement.focus();
            }
        });

        window.addEventListener("resize", (e) => {
            const media = window.matchMedia("min-width: 54em");
            if (media && media.matches && this.dialogOpening) {
                this.closeDialog();
            }
        });
    },
};

desktopMenu.init();
mobileMenu.init();
