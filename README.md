# Molengeek-Projet-Final-Alexandre

## Modification de la bibliothèque django-seed

Une solution rapide pour contourner un problème lié à `timezone.make_aware()` dans la bibliothèque `django-seed` est de modifier directement la bibliothèque pour ajuster l'usage de l'argument `is_dst`.

### Étapes pour résoudre le problème :

1. **Accéder à l'installation de django-seed :**

   Le fichier où l'erreur se produit se trouve dans le répertoire `env\Lib\site-packages\django_seed\guessers.py`.

2. **Modifier `guessers.py` :**

   Trouve la ligne qui appelle `timezone.make_aware` avec l'argument `is_dst`, puis modifie-la en supprimant cet argument.

### Exemple de modification :

* **Avant modification :**

```python
return timezone.make_aware(value, timezone.get_current_timezone(), is_dst=False)
```

* **Après modification :**

```python
return timezone.make_aware(value, timezone.get_current_timezone())
```

En supprimant le paramètre `is_dst`, l'erreur liée à cet argument obsolète devrait être évitée.

## Lancer le script de seed

Pour lancer le script de seed, exécute la commande suivante :

```bash
python run_seed.py
```

---

## Description

Ce projet est une plateforme web pour gérer des événements liés à Magic The Gathering, avec création d’articles, gestion des inscriptions, et plus encore.
Backend Django REST API + frontend React.

---

## Fonctionnalités principales

* Gestion des utilisateurs avec rôles (Organisateur, Rédacteur)
* Création, modification, suppression d’événements
* Inscription aux événements avec suivi des participants
* Création, modification, suppression d’articles
* Gestion des avis sur les événements
* Interface utilisateur réactive avec modales pour création et édition
* Authentification sécurisée via JWT

---

## Tech Stack

* Backend : Django 5.2, Django REST Framework
* Frontend : React (React Router, Axios, React Modal)
* Authentification : JWT (JSON Web Tokens)
* Base de données : SQLite / PostgreSQL (à configurer)
* Stockage médias : dossier `backend/media` (non suivi par Git)

---

### Installation & Setup

1. Crée et active ton environnement virtuel :

```bash
python -m venv env
source env/bin/activate  # ou env\Scripts\activate sous Windows
```

2. Installe les dépendances :

```bash
pip install -r requirements.txt
```

3. **Patch django-seed** (important) :
   Modifie le fichier `env/Lib/site-packages/django_seed/guessers.py` pour enlever l’argument `is_dst` de la fonction `make_aware` (voir plus haut).

4. Lance les migrations, crée un super utilisateur et démarre le serveur :

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

5. (Optionnel) Lance le script de seed pour remplir la base :

```bash
python run_seed.py
```

---

## Usage

* Accéder à l’interface frontend via [http://localhost:5173](http://localhost:5173)
* Utiliser l’API REST à [http://localhost:8000/api/](http://localhost:8000/api/)
* Créer un compte, se connecter
* En fonction de vos rôles, accéder aux fonctionnalités d’organisation d’événements ou de rédaction d’articles

---

## Ajouts récents

* Gestion fine des rôles utilisateurs (Organisateur, Rédacteur)
* Modales React pour création et édition (événements et articles)
* Filtrage avancé et vues personnalisées (events en early, last chance)
* Dashboard profil personnalisé avec gestion des contenus créés
* Sécurisation des endpoints avec permissions personnalisées

---

## À venir

* Gestion avancée des inscriptions (validation, annulation, notifications)
* Amélioration de l’UI/UX sur mobile
* Tests unitaires et intégration continue




