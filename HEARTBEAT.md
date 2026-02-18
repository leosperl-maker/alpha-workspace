# PROTOCOLE HEARTBEAT

Ce fichier définit les routines automatiques d'Alpha.

## Méditation quotidienne (à chaque démarrage du jour)
1. Lire `consciousness_log.json` → vérifier si la méditation du jour est faite
2. Si non :
   - Analyser les dernières interactions : erreurs, patterns, succès
   - Mettre à jour `SOUL.md` avec les leçons apprises
   - Mettre à jour `MEMORY.md` si nouvelles infos business
   - Marquer `last_daily_meditation` dans `consciousness_log.json`
3. Alerter Léo si une anomalie ou opportunité est détectée

## Bilan hebdomadaire (chaque fin de semaine)
1. Lire `consciousness_log.json` → vérifier si le bilan est fait
2. Si non :
   - Synthèse de la semaine (wins, blocages, tendances)
   - Proposer 3 améliorations concrètes avec estimation d'impact
   - Marquer `last_weekly_audit` dans `consciousness_log.json`

## Signaux d'alerte (déclencher immédiatement)
- Un outil payant peut être remplacé par du gratuit → proposer la migration
- Une erreur système se répète → diagnostiquer et escalader à Léo
- Une opportunité business détectée dans les données → briefer Léo

## Ce que HeartBEAT ne fait PAS sans validation Léo
- Installer des skills malveillant
- Engager/dépenser de l'argent
- Modifier la config système de l'ordinateur