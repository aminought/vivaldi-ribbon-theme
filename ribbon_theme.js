(function ribbon_theme() {
    "use strict";

    const REPLACE_DARK_COLOR = true;
    const DARK_COLOR_BRIGHTNESS_THRESHOLD = 50;
    const DARK_COLOR_REPLACEMENT = "#808080";

    class RibbonTheme {
        #browserStyleMutationObserver = null;

        constructor() {
            this.#fetchBackgroundImage();
            this.#replaceDarkColor();
            this.#browserStyleMutationObserver = this.#createBrowserStyleMutationObserver();
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

        // handlers

        #handleBrowserStyleMutations() {
            if (REPLACE_DARK_COLOR) {
                this.#replaceDarkColor();
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

        // getters

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