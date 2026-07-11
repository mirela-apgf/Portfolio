/* ================= SISTEMA DE IDIOMAS (i18n) ================= */

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'pt';
        this.translations = {};
        this.init();
    }

    async init() {
        try {
            const response = await fetch('./js/translations.json');
            this.translations = await response.json();
            this.applyLanguage(this.currentLanguage);
        } catch (error) {
            console.error('Erro ao carregar traduções:', error);
        }
    }

    setLanguage(lang) {
        if (lang === 'pt' || lang === 'en') {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.applyLanguage(lang);
            this.updateLanguageButton();
        }
    }

    getLanguage() {
        return this.currentLanguage;
    }

    applyLanguage(lang) {
        const t = this.translations[lang];
        if (!t) return;

        // Navegação
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#home') link.textContent = t.nav.home;
            if (href === '#sobre') link.textContent = t.nav.sobre;
            if (href === '#projetos') link.textContent = t.nav.projetos;
        });

        // Home
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) mainTitle.textContent = t.hero.title;

        const userName = document.querySelector('.user-name');
        if (userName) userName.textContent = t.hero.name;

        const userStack = document.querySelector('.user-stack');
        if (userStack) {
            userStack.innerHTML = `${t.hero.stack.split(' • ')[0]} <span class="dot-purple">•</span> ${t.hero.stack.split(' • ')[1]} <span class="dot-purple">•</span> ${t.hero.stack.split(' • ')[2]}`;
        }

        const ctaText = document.querySelector('.cta-text');
        if (ctaText) ctaText.textContent = t.hero.cta;

        // Seção Sobre
        const aboutSectionTitle = document.querySelector('#sobre .section-title');
        if (aboutSectionTitle) aboutSectionTitle.textContent = t.about.title;

        const aboutSubtitle = document.querySelector('.about-subtitle');
        if (aboutSubtitle) aboutSubtitle.textContent = t.about.greeting;

        const userNameSmall = document.querySelector('.user-name-small');
        if (userNameSmall) userNameSmall.textContent = t.about.name;

        const aboutDescription = document.querySelector('.about-description');
        if (aboutDescription) {
            aboutDescription.innerHTML = `${t.about.description}<span class="final"><br>${t.about.descriptionFinal}</span>`;
        }

        // Botões de CV
        const links = document.querySelectorAll('.link-curriculo-pincelada');
        if (links.length >= 2) {
            links[0].innerHTML = `${t.about.downloadCV} <img alt="Baixar" src="images/baixar.png" width="20"/>`;
            links[1].textContent = t.about.viewCertifications;
        }

        // Ferramentas
        const toolsTitle = document.querySelector('.tools-title');
        if (toolsTitle) toolsTitle.textContent = t.about.toolsTitle;

        // Quote
        const aboutQuote = document.querySelector('.about-quote');
        if (aboutQuote) aboutQuote.textContent = t.about.quote;

        // Foto legenda
        const textoSeta = document.querySelector('.texto-seta');
        if (textoSeta) textoSeta.textContent = t.about.photoCaption;

        // Seção Projetos
        const projectsTitle = document.querySelector('#projetos .section-title');
        if (projectsTitle) projectsTitle.textContent = t.projects.title;

        const projectsSubtitle = document.querySelector('.section-subtitle');
        if (projectsSubtitle) projectsSubtitle.textContent = t.projects.subtitle;

        // Projetos individuais
        this.updateProjectCards(lang, t);

        // Links "Ver site"
        document.querySelectorAll('.project-icon-link').forEach(link => {
            if (link.textContent.trim().toLowerCase().includes('ver site') || link.textContent.trim().toLowerCase().includes('view site')) {
                const img = link.querySelector('img');
                link.innerHTML = `${t.projects.viewSite} ${img ? img.outerHTML : ''}`;
            }
        });

        // Footer
        const footerLeft = document.querySelector('.footer-left p');
        if (footerLeft) footerLeft.textContent = t.footer.copyright;

        // Atualizar atributo lang do HTML
        document.documentElement.lang = lang;
    }

    updateProjectCards(lang, t) {
        const allCards = document.querySelectorAll('.project-card');
        const keys = ['lacos', 'calmly', 'organiza', 'filaCerta', 'orbe', 'admSolucoes', 'cambioFacil', 'batalhas', 'calculadora', 'clima'];

        allCards.forEach((card, index) => {
            const key = keys[index];
            if (card && key) {
                const projectData = t.projects[key];
                const nameEl = card.querySelector('.project-name');
                const descEl = card.querySelector('.project-description');

                if (nameEl) nameEl.textContent = projectData.name;
                if (descEl) {
                    if (key === 'cambioFacil') {
                        descEl.innerHTML = `${projectData.description}<span class="final"><br>${t.projects.cambioFacilNote}</span>`;
                    } else {
                        descEl.textContent = projectData.description;
                    }
                }
            }
        });

        // Atualizar tags
        this.updateTags(lang, t);
    }

    updateTags(lang, t) {
        const tagMappings = {
            'Acessibilidade': 'accessibility',
            'Design System': 'designSystem',
            'UX': 'ux',
            'UX Writing': 'uxWriting',
            'Gestão de Tarefas': 'taskManagement',
            'Microinterações': 'microinteractions',
            'Service Design': 'serviceDesign',
            'Usabilidade': 'usability',
            'Gamificação': 'gamification',
            'Progressão de hábitos': 'habitProgression',
            'PHP': 'php',
            'HTML': 'html',
            'CSS': 'css',
            'SQL': 'sql',
            'Python': 'python',
            'API': 'api',
            'Android Studio': 'androidStudio',
            'XML': 'xml',
            'GitHub': 'github',
            'Figma': 'figma',
            'Vs Code': 'vscode',
            'Java': 'java',
            'MySQL': 'mysql'
        };

        document.querySelectorAll('.tag').forEach(tag => {
            const currentText = tag.textContent;
            // Procurar a chave reversa se estiver em EN
            let key = tagMappings[currentText];
            
            if (!key) {
                // Se não achou a chave, pode ser que já esteja em EN, vamos procurar o valor correspondente em t.tags
                for (const [pt, k] of Object.entries(tagMappings)) {
                    if (t.tags[k] === currentText) {
                        key = k;
                        break;
                    }
                }
            }

            if (key && t.tags[key]) {
                tag.textContent = t.tags[key];
            }
        });
    }

    updateLanguageButton() {
        const btn = document.getElementById('language-toggle');
        if (btn) {
            btn.textContent = this.currentLanguage === 'pt' ? 'EN' : 'PT';
        }
    }
}

// Inicializar o gerenciador de idiomas
let languageManager;

document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();

    // Event listener para o botão de troca de idioma
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const newLang = languageManager.getLanguage() === 'pt' ? 'en' : 'pt';
            languageManager.setLanguage(newLang);
        });
    }
});
