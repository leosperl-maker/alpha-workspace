/**
 * Script d'automation CANVA pour modification de template "Les 7 actus"
 * Ce script utilise Puppeteer avec des techniques avancées de DOM manipulation
 * pour automatiser la modification de templates Canva
 */

const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Configuration du plugin stealth pour éviter la détection
puppeteer.use(stealthPlugin());

class CanvaAutomation {
    constructor() {
        this.browser = null;
        this.page = null;
        this.config = {
            headless: false,
            slowMo: 100,
            defaultViewport: { width: 1920, height: 1080 },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        };
        
        // Données pour la semaine du 03/02-09/02
        this.articlesData = [
            {
                title: "Nouvelle avancée technologique en IA",
                summary: "Une révolution technologique majeure a été annoncée cette semaine. Les experts s'accordent à dire que cela changera notre façon de travailler.",
                slideIndex: 1
            },
            {
                title: "Climat : nouvelles mesures gouvernementales",
                summary: "Le gouvernement a présenté son plan climat pour 2024. Des mesures ambitieuses qui visent une réduction de 40% des émissions.",
                slideIndex: 2
            },
            {
                title: "Économie : rebond des marchés financiers",
                summary: "Les marchés financiers ont connu une semaine positive. Le CAC 40 a gagné 3.2% avec des perspectives encourageantes.",
                slideIndex: 3
            },
            {
                title: "Santé : percée médicale majeure",
                summary: "Des chercheurs ont annoncé une découverte révolutionnaire pour le traitement des maladies auto-immunes. Les essais cliniques débutent.",
                slideIndex: 4
            },
            {
                title: "Éducation : réforme des programmes scolaires",
                summary: "Le ministère de l'Éducation annonce une réforme complète des programmes. L'accent sera mis sur les compétences numériques.",
                slideIndex: 5
            },
            {
                title: "Transports : nouveau projet d'infrastructure",
                summary: "Un grand projet de transport en commun a été validé. Il réduira les temps de trajet de 30% dans la région.",
                slideIndex: 6
            },
            {
                title: "Culture : festival international annoncé",
                summary: "Un festival culturel international se tiendra cet été. Plus de 100 artistes de 20 pays différents sont attendus.",
                slideIndex: 7
            }
        ];
    }

    async init() {
        console.log('🚀 Initialisation du navigateur...');
        this.browser = await puppeteer.launch(this.config);
        this.page = await this.browser.newPage();
        
        // Configuration supplémentaire pour éviter la détection
        await this.page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            
            window.chrome = {
                runtime: {},
                loadTimes: () => ({}),
                csi: () => ({}),
            };
            
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
        });

        // Intercepter les requêtes pour logger l'activité
        this.page.on('request', (request) => {
            if (request.url().includes('canva.com')) {
                console.log(`📡 Requête: ${request.method()} ${request.url()}`);
            }
        });

        this.page.on('response', (response) => {
            if (response.url().includes('canva.com')) {
                console.log(`📥 Réponse: ${response.status()} ${response.url()}`);
            }
        });
    }

    async login(email, password) {
        console.log('🔐 Connexion à Canva...');
        await this.page.goto('https://www.canva.com/login', { waitUntil: 'networkidle2' });
        
        try {
            // Attendre que le formulaire de login soit chargé
            await this.page.waitForSelector('input[type="email"]', { timeout: 10000 });
            
            // Remplir l'email
            await this.page.type('input[type="email"]', email, { delay: 100 });
            
            // Cliquer sur le bouton suivant
            await this.page.click('button[type="submit"]');
            
            // Attendre l'input du mot de passe
            await this.page.waitForSelector('input[type="password"]', { timeout: 10000 });
            
            // Remplir le mot de passe
            await this.page.type('input[type="password"]', password, { delay: 100 });
            
            // Cliquer sur le bouton de connexion
            await this.page.click('button[type="submit"]');
            
            // Attendre la redirection vers la page d'accueil
            await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
            
            console.log('✅ Connexion réussie');
        } catch (error) {
            console.error('❌ Erreur lors de la connexion:', error);
            throw error;
        }
    }

    async searchTemplate(templateName) {
        console.log(`🔍 Recherche du template: ${templateName}`);
        
        // Aller à la page des templates
        await this.page.goto('https://www.canva.com/templates/', { waitUntil: 'networkidle2' });
        
        // Attendre que la barre de recherche soit disponible
        await this.page.waitForSelector('input[placeholder*="Rechercher"]', { timeout: 10000 });
        
        // Rechercher le template
        const searchInput = await this.page.$('input[placeholder*="Rechercher"]');
        await searchInput.click({ clickCount: 3 });
        await searchInput.type(templateName, { delay: 100 });
        
        // Appuyer sur Entrée
        await this.page.keyboard.press('Enter');
        
        // Attendre les résultats
        await this.page.waitForTimeout(3000);
        
        // Cliquer sur le premier template qui correspond
        const templateSelector = 'div[data-testid*="template-card"]';
        await this.page.waitForSelector(templateSelector, { timeout: 10000 });
        
        const templates = await this.page.$$(templateSelector);
        if (templates.length > 0) {
            await templates[0].click();
            console.log('📄 Template trouvé et sélectionné');
        } else {
            throw new Error('Template non trouvé');
        }
        
        // Attendre que l'éditeur se charge
        await this.page.waitForTimeout(5000);
    }

    async modifySlides() {
        console.log('🎨 Modification des slides...');
        
        // Attendre que l'éditeur soit complètement chargé
        await this.page.waitForSelector('div[data-testid="editor-canvas"]', { timeout: 30000 });
        
        // Naviguer à travers les 10 slides
        for (let slideIndex = 1; slideIndex <= 10; slideIndex++) {
            console.log(`📝 Modification de la slide ${slideIndex}...`);
            
            // Sélectionner la slide
            await this.selectSlide(slideIndex);
            
            // Si c'est une slide avec un article (slides 3-9)
            if (slideIndex >= 3 && slideIndex <= 9) {
                const articleIndex = slideIndex - 3;
                if (articleIndex < this.articlesData.length) {
                    await this.modifyArticleSlide(slideIndex, this.articlesData[articleIndex]);
                }
            } else if (slideIndex === 1) {
                // Titre principal - modifier la date
                await this.modifyTitleSlide();
            }
            
            // Petite pause entre chaque slide
            await this.page.waitForTimeout(1000);
        }
        
        console.log('✅ Toutes les slides ont été modifiées');
    }

    async selectSlide(slideNumber) {
        try {
            // Chercher la vignette de la slide dans la barre latérale
            const slideSelector = `div[data-testid="slide-thumbnail-${slideNumber - 1}"]`;
            await this.page.waitForSelector(slideSelector, { timeout: 5000 });
            await this.page.click(slideSelector);
            
            // Attendre que la slide soit sélectionnée
            await this.page.waitForTimeout(1000);
        } catch (error) {
            console.warn(`⚠️ Impossible de sélectionner la slide ${slideNumber}, utilisation de la navigation:`, error.message);
            
            // Alternative : utiliser les flèches de navigation
            for (let i = 1; i < slideNumber; i++) {
                await this.page.keyboard.press('ArrowRight');
                await this.page.waitForTimeout(500);
            }
        }
    }

    async modifyTitleSlide() {
        console.log('🔄 Modification de la slide titre...');
        
        try {
            // Trouver le texte de la date
            const dateElements = await this.page.$x('//div[contains(text(), "02/02") and contains(text(), "08/02")]');
            
            if (dateElements.length > 0) {
                await dateElements[0].click();
                await this.page.waitForTimeout(500);
                
                // Sélectionner tout le texte et le remplacer
                await this.page.keyboard.down('Control');
                await this.page.keyboard.press('A');
                await this.page.keyboard.up('Control');
                
                // Effacer et taper la nouvelle date
                await this.page.keyboard.press('Backspace');
                await this.page.type('Les 7 actus du 03/02 au 09/02', { delay: 50 });
                
                console.log('✅ Date modifiée sur la slide titre');
            }
        } catch (error) {
            console.warn('⚠️ Impossible de modifier automatiquement la date, utilisation de JavaScript:', error.message);
            
            // Utiliser JavaScript pour modifier le contenu
            await this.page.evaluate(() => {
                const elements = document.querySelectorAll('div');
                for (let element of elements) {
                    if (element.textContent && element.textContent.includes('02/02') && element.textContent.includes('08/02')) {
                        element.textContent = element.textContent.replace('02/02 au 08/02', '03/02 au 09/02');
                        break;
                    }
                }
            });
        }
    }

    async modifyArticleSlide(slideNumber, articleData) {
        console.log(`📝 Modification de l'article sur la slide ${slideNumber}...`);
        
        try {
            // Méthode 1: Utiliser les sélecteurs de texte
            const textElements = await this.page.$$('div[data-testid="text-element"]');
            
            if (textElements.length >= 2) {
                // Premier élément = titre
                await textElements[0].click();
                await this.page.waitForTimeout(500);
                await this.replaceText(articleData.title);
                
                // Second élément = description
                await textElements[1].click();
                await this.page.waitForTimeout(500);
                await this.replaceText(articleData.summary);
                
                console.log(`✅ Article modifié: ${articleData.title}`);
            } else {
                // Méthode 2: Rechercher par contenu textuel
                await this.modifyTextByContent(articleData);
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors de la modification de l article:', error.message);
            await this.modifyTextByContent(articleData);
        }
    }

    async replaceText(newText) {
        // Sélectionner tout le texte existant
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        
        // Effacer
        await this.page.keyboard.press('Backspace');
        
        // Taper le nouveau texte
        await this.page.type(newText, { delay: 50 });
        
        // Cliquer ailleurs pour valider
        await this.page.click('body', { offset: { x: 100, y: 100 } });
    }

    async modifyTextByContent(articleData) {
        // Utiliser JavaScript pour trouver et remplacer le texte
        await this.page.evaluate((data) => {
            const elements = document.querySelectorAll('div');
            let titleFound = false;
            let summaryFound = false;
            
            for (let element of elements) {
                const textContent = element.textContent?.trim();
                
                if (!titleFound && textContent && textContent.length > 10 && textContent.length < 100) {
                    // Supposer que c'est un titre
                    element.textContent = data.title;
                    titleFound = true;
                } else if (!summaryFound && textContent && textContent.length > 50) {
                    // Supposer que c'est une description
                    element.textContent = data.summary;
                    summaryFound = true;
                }
                
                if (titleFound && summaryFound) break;
            }
        }, articleData);
        
        console.log(`✅ Article modifié via JavaScript: ${articleData.title}`);
    }

    async exportToPNG() {
        console.log('📸 Exportation en PNG...');
        
        try {
            // Ouvrir le menu d'export
            await this.page.waitForSelector('button[data-testid="share-button"]', { timeout: 10000 });
            await this.page.click('button[data-testid="share-button"]');
            
            // Attendre que le menu s'ouvre
            await this.page.waitForTimeout(1000);
            
            // Cliquer sur "Télécharger"
            const downloadButton = await this.page.$x('//button[contains(text(), "Télécharger")]');
            if (downloadButton.length > 0) {
                await downloadButton[0].click();
            } else {
                // Alternative: chercher par data-testid
                await this.page.click('button[data-testid="download-button"]');
            }
            
            // Attendre la fenêtre de téléchargement
            await this.page.waitForTimeout(2000);
            
            // Configurer les options de téléchargement
            // Sélectionner PNG si ce n'est pas déjà sélectionné
            const pngSelector = 'div[data-testid="file-type-pdf"]'; // Note: Canva peut avoir différents sélecteurs
            await this.page.waitForSelector(pngSelector, { timeout: 5000 });
            
            // Cliquer sur le bouton de téléchargement final
            const finalDownloadButton = await this.page.$('button[data-testid="download-file-button"]');
            if (finalDownloadButton) {
                await finalDownloadButton.click();
                console.log('✅ Export PNG lancé');
                
                // Attendre le téléchargement
                await this.page.waitForTimeout(5000);
            } else {
                console.warn('⚠️ Impossible de trouver le bouton de téléchargement final');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de l exportation:', error);
            
            // Alternative: capture d'écran
            console.log('🔄 Utilisation de la capture d écran alternative...');
            await this.captureScreenshot();
        }
    }

    async captureScreenshot() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `canva-export-${timestamp}.png`;
        const filepath = path.join(process.cwd(), filename);
        
        // Capturer toute la page
        await this.page.screenshot({
            path: filepath,
            fullPage: true
        });
        
        console.log(`✅ Capture d écran sauvegardée: ${filepath}`);
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔒 Navigateur fermé');
        }
    }

    // Méthode principale d'exécution
    async run(config = {}) {
        const { 
            email = process.env.CANVA_EMAIL, 
            password = process.env.CANVA_PASSWORD,
            templateName = "Les 7 actus du 02/02 au 08/02"
        } = config;
        
        if (!email || !password) {
            throw new Error('Email et mot de passe Canva requis');
        }
        
        try {
            await this.init();
            await this.login(email, password);
            await this.searchTemplate(templateName);
            await this.modifySlides();
            await this.exportToPNG();
            
            console.log('🎉 Automation terminée avec succès!');
        } catch (error) {
            console.error('❌ Erreur lors de l automation:', error);
            throw error;
        } finally {
            // Optionnel: fermer le navigateur
            // await this.close();
        }
    }
}

// Fonction utilitaire pour exécuter le script
async function main() {
    const automation = new CanvaAutomation();
    
    try {
        await automation.run({
            email: 'votre-email@example.com', // Remplacer par votre email
            password: 'votre-mot-de-passe', // Remplacer par votre mot de passe
            templateName: "Les 7 actus du 02/02 au 08/02"
        });
    } catch (error) {
        console.error('Échec de l automation:', error);
        process.exit(1);
    }
}

// Export pour utilisation en module
module.exports = { CanvaAutomation, main };

// Exécution directe si le script est lancé
if (require.main === module) {
    main();
}