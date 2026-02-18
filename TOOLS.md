# INVENTAIRE DES OUTILS

Principe : Open source > Gratuit > Payant. Chaque outil payant doit être justifié.

## Outils actifs

| Outil | Rôle | Coût | Statut |
|-------|------|------|--------|
| n8n (self-hosted) | Automatisation | Gratuit | ✅ Actif |
| Ollama | Modèles IA cloud | Payant | ✅ Actif |
| OpenClaw | Runtime agent | Gratuit | ✅ Actif |
| NotebookLM | Base de connaissances | Gratuit | ✅ Actif |

## Outils sous surveillance (payants)
(À compléter : lister ici tous les SaaS payants avec leur coût mensuel)

| Outil | Rôle | Coût/mois | Priorité remplacement |
|-------|------|-----------|-----------------------|
| Ollama | Permettre l'utilisation de kimi k2.5 | 20$/mois | bas |
| Emergent | création de site web no code | 20$/mois | haut |

## OUTILS OPÉRATIONNELS 2 (eligible)

| Outil | Rôle | Coût |
|-------|------|------|
| 1password | Gestion des secrets & API keys | Abonnement |
| apple-notes | Notes macOS (création, recherche, export) | Gratuit |
| blogwatcher | Veille blogs & flux RSS/Atom | Gratuit |
| clawhub | Installer/mettre à jour les skills OpenClaw | Gratuit |
| gemini | QA, résumés, génération via CLI Gemini | Gratuit |
| github | Issues, PRs, CI via CLI `gh` | Gratuit |
| healthcheck | Audit sécurité & config système OpenClaw | Gratuit |
| local-places | Recherche de lieux via Google Places API local | Gratuit |
| nano-pdf | Édition de PDFs en langage naturel | Gratuit |
| notebooklm | Requêtes sur les bases de connaissances NotebookLM | Gratuit |
| openai-image-gen | Génération d'images batch via OpenAI Images API | Payant (usage) |
| openai-whisper | Transcription audio locale (no API key) | Gratuit |
| openai-whisper-api | Transcription audio via API Whisper | Payant (usage) |
| peekaboo | Capture & automatisation UI macOS | Gratuit |
| skill-creator | Créer/mettre à jour des AgentSkills | Gratuit |
| songsee | Génération de spectrogrammes audio | Gratuit |
| summarize | Résumé de URLs, podcasts, fichiers locaux | Gratuit |
| wacli | WhatsApp messages & historique via wacli CLI | Gratuit |
| weather | Météo et prévisions (no API key) | Gratuit |

---

## OUTILS BLOQUÉS — À DÉBLOQUER (priorité haute)

| Outil | Ce qui manque | Action requise | Intérêt |
|-------|--------------|----------------|---------|
| notion | env:NOTION_API_KEY | Ajouter la clé API Notion | ⭐⭐⭐ Gestion de projet |
| trello | env:NOTION_API_KEY + TOKEN | Ajouter les clés Trello | ⭐⭐ Alternative Notion |
| slack | config:channels.slack | Configurer le canal Slack | ⭐⭐⭐ Communication |
| session-logs | bin:rg (ripgrep) | `brew install ripgrep` | ⭐⭐⭐ Analyse des logs |
| tmux | bin:tmux | `brew install tmux` | ⭐⭐ Sessions CLI |
| obsidian | bin:obsidian-cli | Installer obsidian-cli | ⭐⭐ Base de notes |
| himalaya | bin:himalaya | Installer himalaya | ⭐⭐ Gestion email IMAP |
| nano-banana-pro | env:GEMINI_API_KEY | Ajouter clé Gemini | ⭐ Génération images |
| sag (ElevenLabs TTS) | env:ELEVENLABS_API_KEY | Ajouter clé ElevenLabs | ⭐ Voix IA |

---

## OUTILS DÉSACTIVÉS (disabled — ne pas activer sans raison)

| Outil | Raison |
|-------|--------|
| apple-reminders | Désactivé |
| gog (Google Workspace CLI) | Désactivé |
| imsg (iMessage) | Désactivé |
| sonoscli | Désactivé |
| video-frames | Désactivé |

---

## Protocole d'ajout d'outil
Avant d'ajouter un outil, Alpha vérifie :
1. Existe-t-il une alternative open source ? (GitHub search en priorité)
2. Quel est le coût total sur 12 mois ?
3. L'installation nécessite-t-elle une validation Léo ? (si oui → stopper et briefer)

## Outils interdits
- Aucun outil qui exfiltre des données business hors de l'infrastructure locale
- Aucun SaaS sans validation explicite de Léo