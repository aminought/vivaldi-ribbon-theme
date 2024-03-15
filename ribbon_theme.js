(function ribbon_theme() {
    "use strict";

    const FETCH_BACKGROUND_IMAGE = true;
    const REPLACE_DARK_COLOR = false;
    const CENTER_TABS = false;

    const DARK_COLOR_BRIGHTNESS_THRESHOLD = 50;
    const DARK_COLOR_REPLACEMENT = "#808080";

    class RibbonTheme {
        #backgroundImageFetcher = null;
        #darkColorReplacer = null;
        #tabsCentering = null;

        constructor() {
            if (FETCH_BACKGROUND_IMAGE) {
                this.#backgroundImageFetcher = new BackgroundImageFetcher();
            }
            if (REPLACE_DARK_COLOR) {
                this.#darkColorReplacer = new DarkColorReplacer();
            }
            if (CENTER_TABS) {
                this.#tabsCentering = new TabsCentering();
            }
        }
    };

    class BackgroundImageFetcher {
        constructor() {
            this.#fetchBackgroundImage();
        }

        // actions

        #fetchBackgroundImage() {
            this.#ribbonBackgroundImage = this.#backgroundImage;
        }

        // getters

        get #browser() {
            return document.querySelector('#browser');
        }

        get #backgroundImage() {
            return this.#browser.style.backgroundImage;
        }

        get #ribbonBackgroundImage() {
            return this.#browser.style.getPropertyValue('--ribbonBackgroundImage');
        }

        // setters

        set #ribbonBackgroundImage(image) {
            this.#browser.style.setProperty('--ribbonBackgroundImage', image);
        }
    };

    class DarkColorReplacer {
        #browserStyleMutationObserver = null;

        constructor() {
            this.#replaceDarkColor();
            this.#browserStyleMutationObserver = this.#createBrowserStyleMutationObserver();
        }

        // listeners

        #createBrowserStyleMutationObserver() {
            const browserStyleMutationObserver = new MutationObserver(() => {
                this.#replaceDarkColor();
            });
            browserStyleMutationObserver.observe(this.#browser, {
                attributes: true,
                attributeFilter: ["style"]
            });
            return browserStyleMutationObserver;
        }

        // actions

        #replaceDarkColor() {
            if (this.#colorAccentBg != DARK_COLOR_REPLACEMENT && this.#getBrightness(this.#colorAccentBg) < DARK_COLOR_BRIGHTNESS_THRESHOLD) {
                this.#colorAccentBg = DARK_COLOR_REPLACEMENT;
            }
        }

        // helpers

        #getRGB(hex) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            var r = parseInt(hex.slice(0, 2), 16),
                g = parseInt(hex.slice(2, 4), 16),
                b = parseInt(hex.slice(4, 6), 16);
            return [r, g, b];
        }

        #getBrightness(hex) {
            var [r, g, b] = this.#getRGB(hex);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }

        // getters

        get #browser() {
            return document.querySelector('#browser');
        }

        get #colorAccentBg() {
            return this.#browser.style.getPropertyValue('--colorAccentBg');
        }

        // setters

        set #colorAccentBg(color) {
            this.#browser.style.setProperty('--colorAccentBg', color);
        }
    };

    class TabsCentering {
        constructor() {
            this.#centerTabs();
        }

        // actions

        #centerTabs() {
            this.#app.classList.add('RibbonCenterTabs');
        }

        // getters

        get #app() {
            return document.querySelector('#app');
        }
    };

    function initMod() {
        window.ribbonTheme = new RibbonTheme();
    }

    setTimeout(initMod, 500);
})();