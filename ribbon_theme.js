(function ribbon_theme() {
    "use strict";

    const REPLACE_DARK_COLOR = true;
    const YANDEX_BROWSER_TITLE = true;
    const CENTER_TABS = true;

    const DARK_COLOR_BRIGHTNESS_THRESHOLD = 50;
    const DARK_COLOR_REPLACEMENT = "#808080";

    class RibbonTheme {
        #browserStyleMutationObserver = null;
        #titleMutationObserver = null;

        constructor() {
            this.#fetchBackgroundImage();

            if (REPLACE_DARK_COLOR) {
                this.#replaceDarkColor();
            }
            if (YANDEX_BROWSER_TITLE) {
                this.#modifyUrlFragments();
            }
            if (CENTER_TABS) {
                this.#centerTabs();
            }

            this.#browserStyleMutationObserver = this.#createBrowserStyleMutationObserver();
            this.#titleMutationObserver = this.#createTitleMutationObserver();
        }

        // builders

        #createBrowserStyleMutationObserver() {
            const browserStyleMutationObserver = new MutationObserver(() => {
                this.#handleBrowserStyleMutations();
            });
            browserStyleMutationObserver.observe(this.#browser, {
                attributes: true,
                attributeFilter: ["style"]
            });
            return browserStyleMutationObserver;
        }

        #createTitleMutationObserver() {
            const titleMutationObserver = new MutationObserver(() => {
                this.#handleTitleMutations();
            });
            titleMutationObserver.observe(this.#head, {
                childList: true,
                subtree: true
            });
            return titleMutationObserver;
        }

        // handlers

        #handleBrowserStyleMutations() {
            if (REPLACE_DARK_COLOR) {
                this.#replaceDarkColor();
            }
        };

        #handleTitleMutations() {
            if (YANDEX_BROWSER_TITLE) {
                this.#modifyUrlFragments();
            }
        };

        // actions

        #fetchBackgroundImage() {
            this.#ribbonBackgroundImage = this.#backgroundImage;
        }

        #replaceDarkColor() {
            if (this.#colorAccentBg != DARK_COLOR_REPLACEMENT && getBrightness(this.#colorAccentBg) < DARK_COLOR_BRIGHTNESS_THRESHOLD) {
                this.#colorAccentBg = DARK_COLOR_REPLACEMENT;
            }
        }

        #modifyUrlFragments() {
            if (this.#ribbonDomain) {
                this.#urlFragments.removeChild(this.#ribbonDomain);
            }
            if (this.#ribbonTitle) {
                this.#urlFragments.removeChild(this.#ribbonTitle);
            }
            if (this.#urlFragmentLink) {
                const domain = this.#urlFragmentLink.innerText;
                const domainDiv = document.createElement('div');
                domainDiv.className = 'UrlFragment--Lowlight RibbonDomain';
                domainDiv.innerText = domain;
                this.#urlFragments.appendChild(domainDiv);
            }
            if (this.#title) {
                const title = this.#title.innerText;
                const titleDiv = document.createElement('div');
                titleDiv.className = 'UrlFragment--Highlight RibbonTitle';
                titleDiv.innerText = title;
                this.#urlFragments.appendChild(titleDiv);
            }
        }

        #centerTabs() {
            this.#app.classList.add('RibbonCenterTabs');
        }

        // getters

        get #app() {
            return document.querySelector('#app');
        }

        get #browser() {
            return document.querySelector('#browser');
        }

        get #colorAccentBg() {
            return this.#browser.style.getPropertyValue('--colorAccentBg');
        }

        get #backgroundImage() {
            return this.#browser.style.backgroundImage;
        }

        get #ribbonBackgroundImage() {
            return this.#browser.style.getPropertyValue('--ribbonBackgroundImage');
        }

        get #urlFragments() {
            return document.querySelector('.UrlFragment-Wrapper');
        }

        get #urlFragmentLink() {
            return document.querySelector('.UrlFragment-Link');
        }

        get #head() {
            return document.querySelector('head');
        }

        get #title() {
            return document.querySelector('title');
        }

        get #ribbonDomain() {
            return document.querySelector('.RibbonDomain');
        }

        get #ribbonTitle() {
            return document.querySelector('.RibbonTitle');
        }

        // setters

        set #colorAccentBg(color) {
            this.#browser.style.setProperty('--colorAccentBg', color);
        }

        set #ribbonBackgroundImage(image) {
            this.#browser.style.setProperty('--ribbonBackgroundImage', image);
        }
    };

    // utils

    function getRGB(hex) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        var r = parseInt(hex.slice(0, 2), 16),
            g = parseInt(hex.slice(2, 4), 16),
            b = parseInt(hex.slice(4, 6), 16);
        return [r, g, b];
    }

    function getBrightness(hex) {
        var [r, g, b] = getRGB(hex);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // initialization

    function initMod() {
        window.ribbonTheme = new RibbonTheme();
    }

    setTimeout(initMod, 500);
})();