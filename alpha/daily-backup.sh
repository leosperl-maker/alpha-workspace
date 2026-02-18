#!/bin/bash
# Alpha — Backup quotidien automatique
# Usage: ./daily-backup.sh

WORKSPACE="/Users/leosperl/.openclaw/workspace"
LOG_FILE="$WORKSPACE/alpha/logs/backup-$(date +%Y-%m-%d).log"
ERRORS=0

mkdir -p "$(dirname "$LOG_FILE")"

echo "=== Backup Alpha — $(date) ===" | tee -a "$LOG_FILE"

cd "$WORKSPACE" || exit 1

# 1. Vérifier si c'est un repo git
if [ ! -d ".git" ]; then
    echo "🆕 Initialisation du repo git..." | tee -a "$LOG_FILE"
    git init 2>&1 | tee -a "$LOG_FILE"
    git add README.md 2>/dev/null || true
fi

# 2. Configurer git si besoin (une seule fois)
git config user.email "alpha@agency.local" 2>/dev/null
git config user.name "Alpha" 2>/dev/null

# 3. Vérifier si remote origin existe
REMOTE_EXISTS=$(git remote get-url origin 2>/dev/null)
if [ -z "$REMOTE_EXISTS" ]; then
    echo "⚠️ Aucun remote configuré" | tee -a "$LOG_FILE"
fi

# 4. Ajouter tous les fichiers modifiés
git add -A . 2>&1 | tee -a "$LOG_FILE"

# 5. Vérifier s'il y a des changements à commit
STATUS=$(git status --porcelain 2>/dev/null)
if [ -z "$STATUS" ]; then
    echo "✅ Rien à sauvegarder — déjà à jour" | tee -a "$LOG_FILE"
else
    # 6. Commit
    git commit -m "Backup auto: $(date '+%Y-%m-%d %H:%M') — $(echo "$STATUS" | wc -l) fichiers" 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Commit réussi" | tee -a "$LOG_FILE"
        
        # 7. Push si remote existe
        if [ -n "$REMOTE_EXISTS" ]; then
            git push origin main 2>&1 | tee -a "$LOG_FILE"
            if [ $? -eq 0 ]; then
                echo "✅ Push vers remote: OK" | tee -a "$LOG_FILE"
            else
                echo "❌ Push échoué" | tee -a "$LOG_FILE"
                ((ERRORS++))
            fi
        else
            echo "ℹ️ Commit local uniquement (pas de remote)" | tee -a "$LOG_FILE"
        fi
    else
        echo "❌ Commit échoué" | tee -a "$LOG_FILE"
        ((ERRORS++))
    fi
fi

# 8. Afficher le dernier commit
LAST_COMMIT=$(git log --oneline -1 2>/dev/null || echo "Aucun commit")
echo "📝 Dernier: $LAST_COMMIT" | tee -a "$LOG_FILE"

echo "=== Fin backup — $ERRORS erreur(s) ===" | tee -a "$LOG_FILE"

exit $ERRORS
