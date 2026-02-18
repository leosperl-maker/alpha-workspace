#!/usr/bin/env node
/**
 * Canva Design Modifier
 * Outil pour modifier des designs Canva via API
 * Usage: node canva-modifier.js <design-url> <text-to-find> <text-to-replace>
 */

const axios = require('axios');

class CanvaModifier {
    constructor(accessToken, clientSecret) {
        this.accessToken = accessToken;
        this.clientSecret = clientSecret;
        this.baseURL = 'https://api.canva.com/v1';
        
        this.headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Alpha-Agency-Canva-Tool/1.0'
        };
    }

    // Extraire l'ID du design depuis l'URL Canva
    extractDesignId(url) {
        const match = url.match(/\/design\/([^\/]+)/);
        if (!match) {
            throw new Error('URL Canva invalide. Format attendu: https://www.canva.com/design/ID/...');
        }
        return match[1];
    }

    // Récupérer les détails du design
    async getDesign(designId) {
        try {
            const response = await axios.get(`${this.baseURL}/designs/${designId}`, {
                headers: this.headers
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du design:', error.response?.data || error.message);
            throw error;
        }
    }

    // Modifier le texte dans le design
    async modifyText(designId, targetText, replacementText) {
        try {
            // Récupérer le design actuel
            const design = await this.getDesign(designId);
            console.log('Design récupéré:', design.name);

            // Rechercher et remplacer le texte
            const updatedDesign = await this.updateDesignText(designId, targetText, replacementText);
            
            console.log(`✅ Texte modifié avec succès:`);
            console.log(`   "${targetText}" → "${replacementText}"`);
            
            return updatedDesign;
        } catch (error) {
            console.error('❌ Erreur lors de la modification:', error.message);
            throw error;
        }
    }

    // Mettre à jour le texte dans le design
    async updateDesignText(designId, targetText, replacementText) {
        // Note: L'API Canva réelle peut avoir une structure différente
        // Cette méthode doit être adaptée selon la documentation officielle
        
        try {
            const response = await axios.put(`${this.baseURL}/designs/${designId}/elements`, {
                type: 'text',
                modifications: [{
                    find: targetText,
                    replace: replacementText
                }]
            }, {
                headers: this.headers
            });
            
            return response.data;
        } catch (error) {
            // Fallback: créer une nouvelle version si modification directe impossible
            console.log('Création d\'une nouvelle version du design...');
            return this.createVersionWithText(designId, targetText, replacementText);
        }
    }

    // Créer une nouvelle version avec le texte modifié
    async createVersionWithText(designId, targetText, replacementText) {
        try {
            const response = await axios.post(`${this.baseURL}/designs/${designId}/versions`, {
                changes: [{
                    type: 'text_replace',
                    target: targetText,
                    replacement: replacementText
                }]
            }, {
                headers: this.headers
            });
            
            return response.data;
        } catch (error) {
            console.error('Impossible de créer une nouvelle version:', error.response?.data || error.message);
            throw error;
        }
    }
}

// Interface CLI
function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log(`
Usage: node canva-modifier.js <design-url> <text-to-find> <text-to-replace>

Example:
  node canva-modifier.js "https://www.canva.com/design/DAHBImsxUGg/..." "02/02" "09/02"
        `);
        process.exit(1);
    }

    const [designUrl, targetText, replacementText] = args;
    
    // Récupérer les credentials depuis l'environnement ou les paramètres
    const accessToken = process.env.CANVA_ACCESS_TOKEN || 'OC-AZxjyzUhlW14';
    const clientSecret = process.env.CANVA_CLIENT_SECRET || 'cnvcaGfrnwFVJdZ2c8Nuqbw9l5oivIA8b9OBK2HYZmkgc0CIacf82bff';

    const modifier = new CanvaModifier(accessToken, clientSecret);
    
    try {
        const designId = modifier.extractDesignId(designUrl);
        console.log(`Modification du design: ${designId}`);
        
        modifier.modifyText(designId, targetText, replacementText)
            .then(result => {
                console.log('✅ Modification terminée avec succès!');
                if (result.url) {
                    console.log(`Nouveau design: ${result.url}`);
                }
            })
            .catch(error => {
                console.error('❌ Erreur:', error.message);
                process.exit(1);
            });
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

// Exporter la classe pour usage dans d'autres scripts
module.exports = CanvaModifier;

// Exécuter si appelé directement
if (require.main === module) {
    main();
}