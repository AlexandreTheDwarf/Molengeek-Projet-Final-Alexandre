from django.core.management import call_command
from django_seed import Seed
from django.utils.timezone import now
from django.contrib.auth.models import Group
from .models import User, Article, Event, Inscription
import random

from django.utils import timezone

def custom_make_aware(value):
    return timezone.make_aware(value, timezone.get_current_timezone())


def seed():
    # Charger les groupes et permissions
    call_command('loaddata', 'events/fixtures/groups.json')
    call_command('loaddata', 'events/fixtures/permissions.json')

    seeder = Seed.seeder()
    current_time = now()

    # Création manuelle des utilisateurs
    user = User.objects.create_user(username='utilisateur', email='utilisateur@example.com', first_name='Utilisateur', last_name='Standard', is_staff=False)
    redacteur = User.objects.create_user(username='redacteur', email='redacteur@example.com', first_name='Rédacteur', last_name='Principal', is_staff=True)
    admin = User.objects.create_superuser(username='admin', email='admin@example.com', first_name='Admin', last_name='Principal', is_staff=True)

    # Attribution des groupes
    redacteur_group = Group.objects.get(name="Redacteur")
    user_group = Group.objects.get(name="Utilisateur")
    moderateur_group = Group.objects.get(name="Moderateur")

    user.groups.add(user_group)
    redacteur.groups.add(redacteur_group)
    admin.groups.add(moderateur_group)

    # Création de 3 rédacteurs
    redacteur1 = User.objects.create_user(username='redacteur1', email='redacteur1@example.com', first_name='Rédacteur', last_name='Un', is_staff=True)
    redacteur2 = User.objects.create_user(username='redacteur2', email='redacteur2@example.com', first_name='Rédacteur', last_name='Deux', is_staff=True)
    redacteur3 = User.objects.create_user(username='redacteur3', email='redacteur3@example.com', first_name='Rédacteur', last_name='Trois', is_staff=True)

    # Création de 3 organisateurs
    organisateur1 = User.objects.create_user(username='organisateur1', email='organisateur1@example.com', first_name='Organisateur', last_name='Un', is_staff=True)
    organisateur2 = User.objects.create_user(username='organisateur2', email='organisateur2@example.com', first_name='Organisateur', last_name='Deux', is_staff=True)
    organisateur3 = User.objects.create_user(username='organisateur3', email='organisateur3@example.com', first_name='Organisateur', last_name='Trois', is_staff=True)

    # Attribution des groupes
    redacteur_group = Group.objects.get(name="Redacteur")
    organisateur_group = Group.objects.get(name="Organisateur")
    
    redacteur1.groups.add(redacteur_group)
    redacteur2.groups.add(redacteur_group)
    redacteur3.groups.add(redacteur_group)

    organisateur1.groups.add(organisateur_group)
    organisateur2.groups.add(organisateur_group)
    organisateur3.groups.add(organisateur_group)

    # Utilisateurs aléatoires
    seeder.add_entity(User, 10, {
        'username': lambda x: seeder.faker.user_name(),
        'email': lambda x: seeder.faker.email(),
        'first_name': lambda x: seeder.faker.first_name(),
        'last_name': lambda x: seeder.faker.last_name(),
        'is_staff': False,
    })

    results = seeder.execute()
    user_pks = results[User]

    # Groupes pour users aléatoires
    for user_pk in user_pks:
        u = User.objects.get(pk=user_pk)
        u.groups.add(user_group)
        if random.choice([True, False]):
            u.groups.add(redacteur_group)

    # Récupérer les users pour les articles/events
    redacteurs = User.objects.filter(groups__name="Redacteur")
    organisateurs = User.objects.filter(groups__name="Organisateur")

    # Articles
    seeder.add_entity(Article, 10, {
        'titre': lambda x: seeder.faker.sentence(),
        'categorie': lambda x: random.choice(['news', 'guide', 'avis']),
        'contenu': lambda x: seeder.faker.text(),
        'auteur': lambda x: random.choice(redacteurs),
        'date_creation': lambda x: custom_make_aware(seeder.faker.date_time()),
    })

    seeder.execute()

    # Événements
    seeder.add_entity(Event, 5, {
        'nom': lambda x: seeder.faker.catch_phrase(),
        'description': lambda x: seeder.faker.text(),
        'author': lambda x: random.choice(organisateurs),
        'bracket_level': lambda x: random.choice(['1', '2', '3', '4', '5']),
        'format': lambda x: random.choice(['commander', 'modern', 'standard']),
        'nombre_participant': lambda x: random.randint(0, 10),
        'nombre_participant_max': lambda x: random.randint(10, 100),
        'date': lambda x: custom_make_aware(seeder.faker.date_time()),
        'IRL': lambda x: random.choice([True, False]),
        'lieux': lambda x: seeder.faker.address() if random.choice([True, False]) else None,
    })

    results = seeder.execute()
    events = Event.objects.all()
    users = User.objects.all()

    # Inscriptions
    for event in events:
        num_participants = random.randint(1, event.nombre_participant)
        selected_users = random.sample(list(users), min(num_participants, len(users)))

        for u in selected_users:
            seeder.add_entity(Inscription, 1, {
                'event': event,
                'player': u,
                'deck': lambda x: seeder.faker.url(),
                'etat': lambda x: random.choice(['en_attente', 'valide', 'refuse']),
            })

    seeder.execute()

    print("Seeding terminé sans erreur")

if __name__ == '__main__':
    seed()
