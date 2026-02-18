#!/bin/bash
# Alpha — Diagnostic matinal automatique
# Usage: ./daily-check.sh ou via cron

LOG_FILE="/Users/leosperl/.openclaw/workspace/alpha/logs/daily-check-$(date +%Y-%m-%d).log"
ERRORS=0

mkdir -p "$(dirname "$LOG_FILE")"

echo "=== Diagnostic Alpha — $(date) ===" | tee -a "$LOG_FILE"

# 1. OpenClaw Gateway
curl -s http://127.0.0.1:18789/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ OpenClaw Gateway: OK" | tee -a "$LOG_FILE"
else
    echo "❌ OpenClaw Gateway: DOWN" | tee -a "$LOG_FILE"
    ((ERRORS++))
fi

# 2. n8n
curl -s http://127.0.0.1:5678/healthz > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ n8n: OK" | tee -a "$LOG_FILE"
else
    echo "❌ n8n: DOWN" | tee -a "$LOG_FILE"
    ((ERRORS++))
fi

# 3. Ollama (vérifie si le process tourne, pas d'endpoint HTTP direct)
pgrep -f "ollama" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Ollama: Running" | tee -a "$LOG_FILE"
else
    echo "❌ Ollama: DOWN" | tee -a "$LOG_FILE"
    ((ERRORS++))
fi

# 4. Dernière backup git
cd /Users/leosperl/.openclaw/workspace
LAST_BACKUP=$(git log --oneline -1 --format="%h %ar" 2>/dev/null || echo "jamais")
echo "🔄 Dernière backup: $LAST_BACKUP" | tee -a "$LOG_FILE"

# 5. Espace disque
df -h /Users/leosperl | awk 'NR==2 {print "💾 Disque: "$5 " utilisé"}' | tee -a "$LOG_FILE"

echo "=== Fin du diagnostic — $ERRORS erreur(s) ===" | tee -a "$LOG_FILE"

exit $ERRORS
