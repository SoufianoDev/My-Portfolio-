// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Select the footer element containing the year
    const footerYear = document.querySelector('.text-gray-400');
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Replace the existing year in the footer with the current year
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
});

// Translator class to handle multilingual support
class Translator {
    constructor() {
        // Define default translations for multiple languages
        this.translations = {
            en: {
                footerText: '© {year} Soufiano Dev. All rights reserved.'
            },
            fr: {
                footerText: '© {year} Soufiano Dev. Tous droits réservés.'
            },
            es: {
                footerText: '© {year} Soufiano Dev. Todos los derechos reservados.'
            },
            ar: {
                footerText: '© {year} Soufiano Dev. جميع الحقوق محفوظة.'
            }
        };

        // Toast element for displaying messages
        this.toast = document.getElementById('toast');
        // Flag to control toast display on language switch
        this.showToastOnSwitch = false;
        // Language names for displaying in toast messages
        this.languageNames = {
            en: 'English',
            fr: 'Français',
            es: 'Español',
            ar: 'العربية'
        };
        // Flag to indicate if the page is being loaded for the first time
        this.initialLoad = true;

        // Toast messages for different scenarios
        this.toastMessages = {
            en: {
                languageNotAvailable: 'Translations for {lang} not available.',
                alreadySelected: '{lang} is already selected.',
                switchedTo: 'Language switched to {lang}.'
            },
            fr: {
                languageNotAvailable: 'Les traductions pour {lang} ne sont pas disponibles.',
                alreadySelected: '{lang} est déjà sélectionné.',
                switchedTo: 'Langue changée en {lang}.'
            },
            es: {
                languageNotAvailable: 'Las traducciones para {lang} no están disponibles.',
                alreadySelected: '{lang} ya está seleccionado.',
                switchedTo: 'Idioma cambiado a {lang}.'
            },
            ar: {
                languageNotAvailable: 'الترجمات للغة {lang} غير متوفرة.',
                alreadySelected: 'اللغة {lang} مُختارة بالفعل.',
                switchedTo: 'تم تغيير اللغة إلى {lang}.'
            }
        };
    }

    // Load additional translations dynamically
    async loadTranslations(langs) {
        for (const lang of langs) {
            try {
                // Fetch translation file for the specified language
                const response = await fetch(`/languages/${lang}.json`);
                if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
                const data = await response.json();
                // Merge new translations with existing ones
                this.translations[lang] = { ...this.translations[lang], ...data };
            } catch (err) {
                console.error(`Error loading ${lang} translations:`, err);
            }
        }
    }

    // Switch the language of the application
    switchLanguage(lang) {
        // Show error if translations for the selected language are not available
        if (!this.translations[lang]) {
            this.showToast(this.getToastMessage(lang, 'languageNotAvailable'), lang);
            return;
        }

        // Check if the selected language is already active
        if (document.documentElement.lang === lang) {
            if (!this.initialLoad) {
                this.showToast(this.getToastMessage(lang, 'alreadySelected'), lang);
            }
            return;
        }

        // Set the HTML document's language
        document.documentElement.lang = lang;
        // Update all translatable elements on the page
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            let translation = this.translations[lang][key];
            if (translation) {
                // Replace {year} placeholder with the current year
                if (translation.includes('{year}')) {
                    translation = translation.replace('{year}', new Date().getFullYear());
                }
                el.innerHTML = translation;
            }
        });

        // Show a toast message if the language is switched
        if (this.showToastOnSwitch) {
            this.showToast(this.getToastMessage(lang, 'switchedTo'), lang);
        }

        this.initialLoad = false;
    }

    // Get the appropriate toast message based on language and message type
    getToastMessage(lang, messageType) {
        const template = this.toastMessages[lang]?.[messageType] || '';
        return template.replace('{lang}', this.languageNames[lang] || lang);
    }

    // Display a toast message
    showToast(msg, lang) {
        if (!this.toast) return console.warn('Toast element missing.');
        this.toast.innerText = msg;
        this.toast.classList.add('show');
        // Hide the toast after 4 seconds
        setTimeout(() => this.toast.classList.remove('show'), 4000);
    }

    // Bind click events for language switch links
    bindLanguageSwitch() {
        document.querySelectorAll('.dropdown a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.showToastOnSwitch = true;
                this.switchLanguage(lang);
                // Update the URL hash with the selected language
                window.location.hash = lang;
            });
        });
    }
}

const translator = new Translator();

// Load additional translations and bind language switch functionality
translator.loadTranslations(['en', 'fr', 'es', 'ar']).then(() => {
    translator.bindLanguageSwitch();
    // Set the default language based on the URL hash or fallback to English
    const preSelectedLang = window.location.hash.slice(1) || 'en';
    translator.switchLanguage(preSelectedLang);
});