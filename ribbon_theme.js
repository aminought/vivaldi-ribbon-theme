(function ribbon_theme() {
    "use strict";

    const FETCH_BACKGROUND_IMAGE = true;
    const REPLACE_DARK_COLOR = true;
    const YANDEX_BROWSER_TITLE = true;
    const CENTER_TABS = true;

    const DARK_COLOR_BRIGHTNESS_THRESHOLD = 50;
    const DARK_COLOR_REPLACEMENT = "#808080";

    class RibbonTheme {
        #backgroundImageFetcher = null;
        #yandexBrowserTitle = null;
        #darkColorReplacer = null;
        #tabsCentering = null;

        constructor() {
            if (FETCH_BACKGROUND_IMAGE) {
                this.#backgroundImageFetcher = new BackgroundImageFetcher();
            }
            if (YANDEX_BROWSER_TITLE) {
                this.#yandexBrowserTitle = new YandexBrowserTitle();
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

    class YandexBrowserTitle {
        #titleMutationObserver = null;

        constructor() {
            this.#modifyAddressField();
            this.#titleMutationObserver = this.#createTitleMutationObserver();
        }

        // listeners

        #createTitleMutationObserver() {
            const titleMutationObserver = new MutationObserver(() => {
                setTimeout(() => this.#modifyAddressField(), 10);
            });
            titleMutationObserver.observe(this.#head, {
                childList: true,
                subtree: true
            });
            return titleMutationObserver;
        }

        #addRibbonDomainButtonListener(domainInfo) {
            this.#ribbonDomainButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const prefix = this.#calculateDomainPrefix(domainInfo['type']);
                const url = prefix + domainInfo['domain'];
                this.#activeWebview.setAttribute('src', url);
            }, true);
        }

        // builders

        #createRibbonDomainButton() {
            const domainInfo = this.#parseUrlDomain(this.#urlFragmentLink ? this.#urlFragmentLink.innerText : this.#urlFragmentHighlight.innerText);
            if (!domainInfo['domain']) {
                return null;
            }

            const ribbonDomainButton = this.#createRibbonDomainButtonEmpty();
            const ribbonDomain = this.#createRibbonDomain(domainInfo['domain']);
            ribbonDomainButton.appendChild(ribbonDomain);
            this.#urlBarAddressField.insertBefore(ribbonDomainButton, this.#urlBarUrlFieldWrapper);
            this.#addRibbonDomainButtonListener(domainInfo);
            setTimeout(() => {ribbonDomainButton.style.opacity = 1}, 10);
            return ribbonDomainButton;
        }

        #createRibbonDomainButtonEmpty() {
            const button = document.createElement('button');
            button.className = 'RibbonDomainButton';
            return button;
        }

        #createRibbonDomain(domain) {
            const ribbonDomain = document.createElement('div');
            ribbonDomain.className = 'UrlFragment--Lowlight RibbonDomain';
            ribbonDomain.innerText = domain;
            return ribbonDomain;
        }

        #createRibbonTitle() {
            const ribbonTitle = this.#createRibbonTitleEmpty();
            this.#urlFragments.appendChild(ribbonTitle);
            setTimeout(() => {ribbonTitle.style.opacity = 1}, 10);
        }

        #createRibbonTitleEmpty() {
            const title = this.#title.innerText;
            const ribbonTitle = document.createElement('div');
            ribbonTitle.className = 'UrlFragment--Highlight RibbonTitle';
            ribbonTitle.innerText = title;
            return ribbonTitle;
        }

        // actions

        #modifyAddressField() {
            if (this.#ribbonDomainButton) {
                this.#urlBarAddressField.removeChild(this.#ribbonDomainButton);
            }
            if (this.#ribbonTitle) {
                this.#urlFragments.removeChild(this.#ribbonTitle);
            }
            if (this.#urlFragmentLink || this.#urlFragmentHighlight) {
                const ribbonDomainButton = this.#createRibbonDomainButton();
                if (ribbonDomainButton && this.#title) {
                    this.#createRibbonTitle();
                }
            }
        }

        // helpers

        #calculateDomainPrefix(type) {
            if (type === 'url') {
                return 'https://';
            } else if (type === 'vivaldi') {
                return 'vivaldi://';
            } else if (type === 'about') {
                return '';
            } else {
                return null;
            }
        }

        #parseVivaldiDomain(url) {
            const regexp = /vivaldi:\/\/([^\/]*)/;
            return url.match(regexp)[1];
        }

        #parseUrlDomain(url) {
            if (url.startsWith('vivaldi://')) {
                return {type: 'vivaldi', domain: this.#parseVivaldiDomain(url)};
            } else if (url.startsWith('file://')) {
                return {type: 'file', domain: null};
            } else if (url.startsWith('about:')) {
                return {type: 'about', domain: url};
            } else {
                return {type: 'url', domain: url};
            }
        }

        // getters

        get #head() {
            return document.querySelector('head');
        }

        get #title() {
            return document.querySelector('title');
        }

        get #activeWebview() {
            return document.querySelector('.webpageview.active.visible webview');
        }

        get #urlBarAddressField() {
            return document.querySelector('.UrlBar-AddressField');
        }

        get #urlBarUrlFieldWrapper() {
            return document.querySelector('.UrlBar-AddressField .UrlBar-UrlFieldWrapper');
        }

        get #urlFragments() {
            return document.querySelector('.UrlBar-AddressField .UrlFragment-Wrapper');
        }

        get #urlFragmentLink() {
            return document.querySelector('.UrlBar-AddressField .UrlFragment-Link');
        }

        get #urlFragmentHighlight() {
            return document.querySelector('.UrlBar-AddressField span.UrlFragment--Highlight');
        }

        get #ribbonDomainButton() {
            return document.querySelector('.RibbonDomainButton');
        }

        get #ribbonTitle() {
            return document.querySelector('.RibbonTitle');
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