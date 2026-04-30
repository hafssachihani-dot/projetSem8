<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,18,24&height=200&section=header&text=DYNEX&fontSize=52&fontAlignY=35&desc=Gestion%20de%20Stock%20Intelligente%20avec%20IA&descAlignY=52&descAlign=50&animation=twinkling" alt="Bannière DYNEX — Gestion de Stock Intelligente avec IA" width="100%" />

# ✨ DYNEX

### Gestion de Stock Intelligente avec IA

**Prédire. Optimiser. Sécuriser.**

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![fusion AI](https://img.shields.io/badge/fusion_AI-FF6B35?style=for-the-badge&logoColor=white)](https://fusion.ai/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

📚 **Projet de Fin de Tronc Commun — Formation GenAIOT 2026**

🔗 [**Repository GitHub**](https://github.com/hafssachihani-dot/projetSem8)

</div>

---

## 📝 À propos

**DYNEX** est une solution complète de gestion de stock qui combine un tableau de bord web, une application mobile multiplateforme et une couche d’automatisation pilotée par l’IA. Le projet centralise les données dans **Supabase**, orchestre les flux via **fusion AI / n8n** (webhooks), et exploite des nœuds IA pour les prévisions et les notifications intelligentes.

L’objectif est de **réduire les ruptures**, **fluidifier les achats** et **donner une vision claire** des tendances — en temps réel ou quasi temps réel — aux équipes terrain comme aux décideurs.

Que vous consultiez les graphiques sur le web ou gériez les commandes sur mobile, **DYNEX** reste le même fil conducteur : **prédire, optimiser, sécuriser** votre stock.

---

## 🏗️ Architecture

```
   ┌─────────────────────┐         ┌──────────────────┐         ┌─────────────────┐
   │  Mobile App (RN)   │────────▶│   n8n Webhooks   │────────▶│   Supabase DB   │
   └─────────────────────┘         │   (fusion AI)    │         │  (PostgreSQL)   │
                                   └────────┬─────────┘         └─────────────────┘
   ┌─────────────────────┐                │
   │   Web Dashboard     │────────────────┘
   └─────────────────────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │  AI / IA     │
                            │  Layer       │
                            └──────┬───────┘
                                   ▼
                     ┌─────────────────────────────┐
                     │ Notifications & Prévisions  │
                     └─────────────────────────────┘
```

---

## 📸 Captures d’écran

> Ajoutez vos images dans le dépôt et remplacez les textes ci-dessous par des balises `![...](...)` si vous le souhaitez.

| **Dashboard Web** | **Mobile — Produits** |
|:---:|:---:|
| *Placeholder : tableau de bord avec graphiques temps réel* | *Placeholder : liste produits & indicateurs* |

| **Mobile — Achats** | **Mobile — Login** |
|:---:|:---:|
| *Placeholder : commandes fournisseurs* | *Placeholder : écran connexion / inscription* |

---

## 🛠️ Stack technique

| Couche | Technologies |
|--------|----------------|
| 🖥️ **Dashboard web** | HTML, Tailwind CSS, Chart.js, JavaScript |
| 📱 **Application mobile** | React Native, Expo, TypeScript, Zustand |
| ⚙️ **Backend & automatisation** | fusion AI (webhooks), n8n |
| 🗄️ **Base de données** | Supabase (PostgreSQL) |
| 🤖 **Couche IA** | Nœuds n8n IA — prévisions stock & notifications |

---

## 📂 Structure du projet

```
projetSem8/
├── dashboard_smart_stock_modern.html   ← Dashboard web
├── gestion_stock.sql                   ← Schéma base de données
├── ProjetSem8-2026-04-29T00_58_53.587Z.json   ← Workflow n8n (export)
├── Planning Projet Professionnel.pdf   ← Planning projet
└── mobile/                             ← App React Native (Expo)
    ├── app/
    ├── components/
    ├── services/
    ├── store/
    ├── models/
    ├── constants/
    ├── assets/
    └── package.json
```

---

## 🚀 Installation

### 🌐 Web

Ouvrez `dashboard_smart_stock_modern.html` dans votre navigateur (double-clic ou via un serveur local si besoin).

### 📱 Mobile

```bash
cd mobile
npm install
npx expo start
```

### 🗄️ Base de données

Importez le fichier `gestion_stock.sql` dans votre projet **Supabase** (SQL Editor → exécution du script).

### ⚡ Workflow fusion AI / n8n

Importez `ProjetSem8-2026-04-29T00_58_53.587Z.json` dans **n8n** (ou votre instance fusion AI compatible), puis activez les webhooks selon votre déploiement.

---

## 🔌 Endpoints API (Webhooks)

Les URLs ci-dessous correspondent à la configuration utilisée par le dashboard web ; adaptez-les si votre instance n8n / fusion AI change.

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `https://fusion-ai-api.medifus.dev/webhooks/webhook-e0efqcfhpjr5ulvvo06e6b32/dashboard` | `POST` | Données agrégées du tableau de bord (produits, métriques, graphiques) |
| `https://fusion-ai-api.medifus.dev/webhooks/webhook-cis6ls9trx767p87ljfrplxq/add-product` | `POST` | Ajout d’un nouveau produit au catalogue |
| `https://fusion-ai-api.medifus.dev/webhooks/webhook-ivyz7p0n6uoadbgsxa50e40o/achat` | `POST` | Enregistrement d’une commande / achat fournisseur |
| `https://fusion-ai-api.medifus.dev/webhooks/webhook-zk3gbb2bj1j8d26e8q3evlcz/vente` | `POST` | Mouvement de vente / sortie de stock |

> 💡 Le corps des requêtes est attendu en **JSON** (`Content-Type: application/json`), comme dans `dashboard_smart_stock_modern.html`.

---

## ✨ Fonctionnalités

- 📊 **Dashboard web temps réel** avec graphiques interactifs (Chart.js)
- 📦 **Gestion intelligente** des produits et des niveaux de stock
- 🤖 **Notifications IA** en cas de risque de rupture ou d’anomalies
- 📈 **Prévisions de tendances** automatisées via la couche IA
- 🛒 **Achats & commandes fournisseurs** suivis de bout en bout
- 📱 **Application mobile** React Native / Expo — **iOS & Android**
- 🌡️ **Monitoring IoT** — suivi température et humidité (selon capteurs / données)
- 🔔 **Alertes e-mail** automatiques vers les fournisseurs lorsque configurées
- 🔄 **Rafraîchissement automatique** du dashboard toutes les **15 secondes**
- 🔐 **Authentification** — connexion et inscription (parcours mobile)

---

## 👥 Équipe

Nous sommes ravis de partager **DYNEX** avec la communauté. Retrouvez-nous sur GitHub :

| Membre | Profil |
|--------|--------|
| 👩‍💻 **hafssachihani-dot** | [@hafssachihani-dot](https://github.com/hafssachihani-dot) |
| 👨‍💻 **sabiressaad** | [@sabiressaad](https://github.com/sabiressaad) |

Merci d’avoir pris le temps de découvrir notre projet — vos ⭐ sur le dépôt nous motivent !

---

## 📜 Licence

Ce projet est distribué sous la [**licence MIT**](https://opensource.org/licenses/MIT). Vous pouvez l’utiliser, la modifier et la redistribuer librement, sous réserve de conserver l’avis de copyright et la mention de licence.

---

<div align="center">

### 💜 Remerciements

**Fait avec ❤️ dans le cadre de la formation GenAIOT 2026**

*Prédire. Optimiser. Sécuriser — avec **DYNEX**.*

</div>
