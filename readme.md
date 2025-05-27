
# 🧾 Orange Money API Integration Test

> Un petit projet de test pour intégrer l'API locale d'Orange Money (Cameroun) en utilisant Node.js.

Ce projet permet de :
- Obtenir un jeton d’accès OAuth
- Initialiser un paiement
- Effectuer un paiement mobile
- Vérifier le statut d’une transaction
- Sauvegarder les transactions dans une base de données
- Relancer la vérification jusqu’à obtention du statut final (`SUCCESSFUL`, `FAILED`, etc.)

---

## 📦 Technologies utilisées

- **Node.js**
- **Axios** – Pour les requêtes HTTP
- **Sequelize** – ORM pour la gestion des données
- **SQLite** – Base de données par défaut (facile à changer)
- **Dotenv** – Gestion des variables d’environnement

---

## 🔧 Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

---

## 🚀 Installation

```bash
git clone git@github.com:SergeNoah000/om-cm-js-api.git
cd om-cm-js-api
npm install
```

---

## ⚙️ Configuration

1. Copie le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

2. Remplis les informations dans le fichier `.env` :

```env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
X_AUTH_TOKEN=your_x_auth_token
MERCHANT_NUMBER=6XXXXXXXXXX
NOTIF_URL=https://www.y-note.cm/notification
```

---

## ▶️ Exécution

```bash
node start
```

Le script effectuera :
1. Récupération du token (ou utilisation du token existant s’il est valide).
2. Initialisation du paiement.
3. Réalisation du paiement.
4. Vérification périodique (10s) du statut jusqu’à succès ou échec.

---

## 🗃️ Modèle de données

Les transactions sont stockées dans une base SQLite (`database.sqlite`) avec les champs suivants :

| Champ              | Type     | Description                         |
|--------------------|----------|-------------------------------------|
| payToken           | STRING   | Jeton unique du paiement            |
| orderId            | STRING   | Numéro de commande                  |
| amount             | FLOAT    | Montant de la transaction           |
| status             | STRING   | Statut actuel (`PENDING`, etc.)     |
| description        | STRING   | Description de la commande          |
| subscriberMsisdn   | STRING   | Numéro du client                    |
| txnid              | STRING   | Identifiant de la transaction       |
| createTime         | STRING   | Date de création de la transaction  |

---

## 📁 Structure du projet

```
orange-money-api/
├── index.js                      # Script principal de test
├── OrangeMoney.js                # Classe principale gérant les appels API
├── models/
│   └── transaction.js            # Modèle Sequelize
├── config/
│   └── db.js                     # Configuration de la base
├── .env                          # Variables d'environnement
├── .env.example
├── package.json
└── README.md
```

---

## 🛡 Licence

MIT License – tu peux l’utiliser librement dans tes projets personnels ou professionnels.

---

## 👥 Auteur

Serge Noah  
LinkedIn : [[sergenoah](https://www.linkedin.com/in/sergenoah/)]  
GitHub : [[SergeNoah000](https://github.com/SergeNoah000)]

---

## 💬 Besoin d’aide ?

N’hésite pas à ouvrir une issue sur GitHub si tu rencontres un problème ou si tu veux ajouter des fonctionnalités (ex: webhook, logs, retry policy, etc.).

