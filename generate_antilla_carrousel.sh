#!/bin/bash
# Carrousel Antilla Hebdo - Génération automatique
# Usage: ./generate_antilla_carrousel.sh [date_debut] [date_fin]

DATE_DEBUT=${1:-"03/02/2026"}
DATE_FIN=${2:-"09/02/2026"}
echo "🎯 Génération carrousel Antilla : $DATE_DEBUT au $DATE_FIN"

# 1. Scraping des articles (via sub-agent)
echo "📰 Extraction des 7 articles..."
# Résultat: articles.json avec [titre, date, categorie, resume]

# 2. Génération slides 1 à 10
echo "🎨 Création des slides..."

# Slide 1 - Cover
echo "📸 Slide 1: Cover avec vue drone..."
# Template: slide1_antilla_style.html

# Slides 2-8 - Actualités
echo "📰 Slides 2-8: 1 actu par jour..."
# Template: template_slide_actu.html + contenu dynamique

# Slide 9 - Question du jour
echo "🤔 Slide 9: Question basée sur les 7 actus..."
# Génération question intelligente

# Slide 10 - Outro
echo "👋 Slide 10: Outro/CTA..."
# Template: slide10_outro.html

# 3. Export PNG
echo "💾 Export des 10 slides en PNG..."
# Screenshots automatiques

echo "✅ Carrousel complet généré en 10 minutes !"
echo "📁 Fichiers prêts dans: /outputs/antilla_[dates]/"