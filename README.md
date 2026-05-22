# EFET Maroc — Bureau des Étudiants

Une application web complète et moderne pour le Bureau des Étudiants (BDE) de l'EFET Maroc, avec un thème futuriste bleu et une interface utilisateur immersive.

## Caractéristiques

- **Design futuriste**: Thème bleu avec glassmorphism, effets néon et animations fluides
- **Rôles multiples**: Étudiant, Responsable de Classe, Administrateur
- **Système de publications**: Création, approbation, réactions et commentaires
- **Système de vote**: Création de sondages pour élire les responsables de classe
- **Messagerie privée**: Communication entre responsables et étudiants
- **Gestion admin**: Tableau de bord complet avec statistiques et gestion des utilisateurs

## Stack Technique

### Backend
- Node.js + Express.js
- MySQL avec Prisma ORM
- JWT Authentication (access token + refresh token)
- bcrypt pour le hachage des mots de passe
- Rate limiting sur les endpoints sensibles

### Frontend
- React 18
- Redux Toolkit pour la gestion d'état
- React Router v6 pour le routage
- Axios pour les appels API
- CSS Modules avec thème personnalisé
- Recharts pour les graphiques

## Structure du Projet

```
bde-efet/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Logique des contrôleurs
│   │   ├── routes/          # Définition des routes API
│   │   ├── middlewares/     # Middleware d'auth et de rôles
│   │   ├── services/        # Couche de service métier
│   │   ├── prisma/
│   │   │   └── schema.prisma # Schéma de base de données
│   │   └── server.js        # Point d'entrée du serveur
│   ├── prisma/
│   │   └── seed.js          # Script de seed de données
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/          # Images et ressources statiques
    │   ├── components/      # Composants React réutilisables
    │   ├── pages/           # Pages de l'application
    │   ├── features/        # Slices Redux
    │   ├── store/           # Configuration Redux
    │   ├── services/        # Appels API Axios
    │   └── styles/          # CSS global et variables
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation et Configuration

### Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### Configuration du Backend

1. Naviguez vers le dossier backend:
```bash
cd backend
```

2. Installez les dépendances:
```bash
npm install
```

3. Configurez les variables d'environnement:
```bash
cp .env.example .env
```

4. Éditez le fichier `.env` avec vos configurations:
```env
DATABASE_URL="mysql://username:password@localhost:3306/bde_efet"
JWT_ACCESS_SECRET="your-super-secret-access-token-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-in-production"
FRONTEND_URL="http://localhost:3000"
PORT=5000
NODE_ENV=development
```

5. Initialisez Prisma et créez la base de données:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Seed la base de données avec les données de démonstration:
```bash
npx prisma db seed
```

7. Démarrez le serveur backend:
```bash
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### Configuration du Frontend

1. Naviguez vers le dossier frontend:
```bash
cd frontend
```

2. Installez les dépendances:
```bash
npm install
```

3. Configurez les variables d'environnement:
```bash
cp .env.example .env
```

4. Éditez le fichier `.env` si nécessaire:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Téléchargez le logo EFET Maroc:
   - Visitez: https://efetmaroc.com/wp-content/uploads/2025/07/cropped-40107-1-270x270.png
   - Sauvegardez l'image dans `frontend/src/assets/efet-logo.png`

6. Démarrez le serveur de développement:
```bash
npm run dev
```

L'application frontend sera accessible sur `http://localhost:3000`

## Comptes de Démonstration

Après avoir exécuté le script de seed, vous pouvez utiliser les comptes suivants:

### Administrateur
- Email: `admin@efetmaroc.com`
- Mot de passe: `password123`
- Accès: Tableau de bord admin complet

### Responsable de Classe
- Email: `responsable@efetmaroc.com`
- Mot de passe: `password123`
- Accès: Dashboard responsable + publications + messages

### Étudiants
- Email: `student1@efetmaroc.com` (ou student2@efetmaroc.com, student3@efetmaroc.com, etc.)
- Mot de passe: `password123`
- Accès: Dashboard étudiant + réactions + votes

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir le token

### Utilisateurs (Admin uniquement)
- `GET /api/users` - Liste tous les utilisateurs
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur
- `PATCH /api/users/:id/role` - Modifier le rôle

### Publications
- `GET /api/posts` - Publications approuvées
- `GET /api/posts/pending` - Publications en attente (Admin)
- `POST /api/posts` - Créer une publication (Responsable)
- `PATCH /api/posts/:id/approve` - Approuver (Admin)
- `PATCH /api/posts/:id/reject` - Rejeter (Admin)
- `POST /api/posts/:id/react` - Réagir (Étudiant)
- `POST /api/posts/:id/comment` - Commenter

### Votes
- `GET /api/polls` - Liste des sondages
- `POST /api/polls` - Créer un sondage (Admin)
- `PATCH /api/polls/:id/close` - Fermer un sondage (Admin)
- `POST /api/polls/:id/vote` - Voter (Étudiant)
- `GET /api/polls/:id/results` - Résultats (Admin)

### Messages
- `GET /api/messages` - Boîte de réception
- `POST /api/messages` - Envoyer un message (Responsable)
- `GET /api/messages/:userId` - Fil de conversation

### Admin
- `GET /api/admin/stats` - Statistiques du tableau de bord
- `GET /api/admin/classes` - Liste des classes
- `POST /api/admin/classes` - Créer une classe

## Sécurité

- Tokens JWT avec expiration (15min pour access, 7 jours pour refresh)
- Cookies httpOnly pour les tokens
- Hachage bcrypt pour les mots de passe
- Rate limiting sur le login
- Validation des entrées avec express-validator
- CORS configuré pour l'origine frontend
- Middleware de vérification des rôles

## Fonctionnalités par Rôle

### Étudiant
- Voir les publications approuvées
- Réagir aux publications (Like, Heart, Clap)
- Commenter les publications
- Voir et participer aux votes actifs
- Voir les résultats des votes fermés

### Responsable de Classe
- Toutes les fonctionnalités étudiant
- Créer des publications (en attente d'approbation)
- Voir le statut de ses publications
- Envoyer des messages privés aux étudiants
- Voir les messages reçus

### Administrateur
- Tableau de bord avec statistiques
- Gérer les utilisateurs (CRUD)
- Modifier les rôles des utilisateurs
- Approuver ou rejeter les publications
- Créer et gérer les sondages
- Fermer les sondages et annoncer les gagnants
- Gérer les classes

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est en cours d'exécution
- Vérifiez les credentials dans le fichier `.env`
- Assurez-vous que la base de données `bde_efet` existe

### Erreur Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL frontend
- Vérifiez la configuration CORS dans `server.js`

## License

Ce projet est développé pour l'EFET Maroc — Bureau des Étudiants.

**EFET Maroc — Bureau des Étudiants**
*Votre avenir, notre mission.*
