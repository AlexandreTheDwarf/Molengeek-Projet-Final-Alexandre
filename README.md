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

```

## Lancer le script de seed

Pour lancer le script de seed, exécute la commande suivante :

```bash
python run_seed.py



