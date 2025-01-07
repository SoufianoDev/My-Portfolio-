document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.querySelector('.text-gray-400');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
});

class Translator {
    constructor() {
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
        this.toast = document.getElementById('toast');
        this.showToastOnSwitch = false;
        this.languageNames = {
            en: 'English',
            fr: 'Français',
            es: 'Español',
            ar: 'العربية'
        };
        this.initialLoad = true;

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

    async loadTranslations(langs) {
        for (const lang of langs) {
            try {
                const response = await fetch(`/languages/${lang}.json`);
                if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
                const data = await response.json();

                this.translations[lang] = { ...this.translations[lang], ...data };
            } catch (err) {
                console.error(`Error loading ${lang} translations:`, err);
            }
        }
    }

    switchLanguage(lang) {
        if (!this.translations[lang]) {
            this.showToast(this.getToastMessage(lang, 'languageNotAvailable'), lang);
            return;
        }

        if (document.documentElement.lang === lang) {
            if (!this.initialLoad) {
                this.showToast(this.getToastMessage(lang, 'alreadySelected'), lang);
            }
            return;
        }

        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            let translation = this.translations[lang][key];
            if (translation) {
                if (translation.includes('{year}')) {
                    translation = translation.replace('{year}', new Date().getFullYear());
                }
                el.innerHTML = translation;
            }
        });

        if (this.showToastOnSwitch) {
            this.showToast(this.getToastMessage(lang, 'switchedTo'), lang);
        }

        this.initialLoad = false;
    }

    getToastMessage(lang, messageType) {
        const template = this.toastMessages[lang]?.[messageType] || '';
        return template.replace('{lang}', this.languageNames[lang] || lang);
    }

    showToast(msg, lang) {
        if (!this.toast) return console.warn('Toast element missing.');
        this.toast.innerText = msg;
        this.toast.classList.add('show');
        setTimeout(() => this.toast.classList.remove('show'), 4000);
    }

    bindLanguageSwitch() {
        document.querySelectorAll('.dropdown a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.showToastOnSwitch = true;
                this.switchLanguage(lang);
                window.location.hash = lang;
            });
        });
    }
}

const translator = new Translator();
translator.loadTranslations(['en', 'fr', 'es', 'ar']).then(() => {
    translator.bindLanguageSwitch();
    const preSelectedLang = window.location.hash.slice(1) || 'en';
    translator.switchLanguage(preSelectedLang);
});