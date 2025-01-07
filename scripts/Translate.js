// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select the footer element that contains the year text
    const footerYear = document.querySelector('.text-gray-400');
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Replace the year in the footer text with the current year
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
});

// Translator class to handle multi-language support
class Translator {
    constructor() {
        // Define translations for supported languages
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

        // Reference to the toast notification element
        this.toast = document.getElementById('toast');
        this.showToastOnSwitch = false; // Flag to control toast notifications on language switch
        this.languageNames = { // Friendly names for languages
            en: 'English',
            fr: 'Français',
            es: 'Español',
            ar: 'العربية'
        };
        this.initialLoad = true; // Flag to identify the first page load

        // Toast messages for different scenarios in each language
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

    // Load additional translations from external JSON files
    async loadTranslations(langs) {
        for (const lang of langs) {
            try {
                // Fetch the JSON file for the specified language
                const response = await fetch(`/languages/${lang}.json`);
                if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
                const data = await response.json();

                // Merge the fetched translations with existing ones
                this.translations[lang] = { ...this.translations[lang], ...data };
            } catch (err) {
                console.error(`Error loading ${lang} translations:`, err);
            }
        }
    }

    // Switch the website's language
    switchLanguage(lang) {
        // Check if the specified language has translations
        if (!this.translations[lang]) {
            this.showToast(this.getToastMessage(lang, 'languageNotAvailable'), lang);
            return;
        }

        // If the selected language is already active, show a toast
        if (document.documentElement.lang === lang) {
            if (!this.initialLoad) {
                this.showToast(this.getToastMessage(lang, 'alreadySelected'), lang);
            }
            return;
        }

        // Set the language for the HTML document
        document.documentElement.lang = lang;

        // Update all elements with translations
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            let translation = this.translations[lang][key];
            if (translation) {
                // Replace placeholders (e.g., {year}) with dynamic values
                if (translation.includes('{year}')) {
                    translation = translation.replace('{year}', new Date().getFullYear());
                }
                el.innerHTML = translation;
            }
        });

        // Show a toast notification if the language switch was triggered
        if (this.showToastOnSwitch) {
            this.showToast(this.getToastMessage(lang, 'switchedTo'), lang);
        }

        this.initialLoad = false; // Mark the initial load as complete
    }

    // Get the appropriate toast message based on language and type
    getToastMessage(lang, messageType) {
        const template = this.toastMessages[lang]?.[messageType] || '';
        return template.replace('{lang}', this.languageNames[lang] || lang);
    }

    // Display a toast notification
    showToast(msg, lang) {
        if (!this.toast) return console.warn('Toast element missing.');
        this.toast.innerText = msg;
        this.toast.classList.add('show');
        setTimeout(() => this.toast.classList.remove('show'), 4000); // Hide toast after 4 seconds
    }

    // Bind click events to language selection links
    bindLanguageSwitch() {
        document.querySelectorAll('.dropdown a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault(); // Prevent default link behavior
                const lang = e.target.getAttribute('data-lang'); // Get the selected language
                this.showToastOnSwitch = true;
                this.switchLanguage(lang); // Switch the language
                window.location.hash = lang; // Update the URL hash
            });
        });
    }
}

// Initialize the Translator instance
const translator = new Translator();
// Load additional translations and bind language switch functionality
translator.loadTranslations(['en', 'fr', 'es', 'ar']).then(() => {
    translator.bindLanguageSwitch();
    const preSelectedLang = window.location.hash.slice(1) || 'en'; // Use language from URL or default to English
    translator.switchLanguage(preSelectedLang);
});