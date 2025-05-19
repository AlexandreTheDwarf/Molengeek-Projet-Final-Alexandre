# Pansement visuel temporaire :
import warnings

# Ignorer les avertissements
warnings.filterwarnings("ignore")

from django.core.management import call_command
from django_seed import Seed
from django.utils.timezone import now
from django.contrib.auth.models import Group, Permission
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
    user = User.objects.create_user(
        username='utilisateur',
        email='utilisateur@example.com',
        first_name='Utilisateur',
        last_name='Standard',
        is_staff=False,
        password='motdepasse123'
    )
    redacteur = User.objects.create_user(
        username='redacteur',
        email='redacteur@example.com',
        first_name='Rédacteur',
        last_name='Principal',
        is_staff=True,
        password='redacpass123'
    )
    admin = User.objects.create_superuser(
        username='alexandre',
        email='admin@example.com',
        first_name='Admin',
        last_name='Principal',
        is_staff=True,
        password='admin1234'
    )

    # Organisateur de démo
    demo_organisateur = User.objects.create_user(
        username='demo_organisateur',
        email='demo_organisateur@example.com',
        first_name='Demo',
        last_name='Organisateur',
        is_staff=True,
        password='demo1234'
    )

    # Attribution des groupes
    redacteur_group = Group.objects.get(name="Redacteur")
    user_group = Group.objects.get(name="Utilisateur")
    moderateur_group = Group.objects.get(name="Moderateur")
    organisateur_group = Group.objects.get(name="Organisateur")

    user.groups.add(user_group)
    redacteur.groups.add(redacteur_group)
    admin.groups.add(moderateur_group)
    demo_organisateur.groups.add(organisateur_group)

    # Création de 3 rédacteurs
    redacteur1 = User.objects.create_user(
        username='redacteur1',
        email='redacteur1@example.com',
        first_name='Rédacteur',
        last_name='Un',
        is_staff=True,
        password='pass123'
    )
    redacteur2 = User.objects.create_user(
        username='redacteur2',
        email='redacteur2@example.com',
        first_name='Rédacteur',
        last_name='Deux',
        is_staff=True,
        password='pass123'
    )
    redacteur3 = User.objects.create_user(
        username='redacteur3',
        email='redacteur3@example.com',
        first_name='Rédacteur',
        last_name='Trois',
        is_staff=True,
        password='pass123'
    )

    # Création de 3 organisateurs
    organisateur1 = User.objects.create_user(
        username='organisateur1',
        email='organisateur1@example.com',
        first_name='Organisateur',
        last_name='Un',
        is_staff=True,
        password='pass123'
    )
    organisateur2 = User.objects.create_user(
        username='organisateur2',
        email='organisateur2@example.com',
        first_name='Organisateur',
        last_name='Deux',
        is_staff=True,
        password='pass123'
    )
    organisateur3 = User.objects.create_user(
        username='organisateur3',
        email='organisateur3@example.com',
        first_name='Organisateur',
        last_name='Trois',
        is_staff=True,
        password='pass123'
    )

    # Attribution des groupes aux rédacteurs
    redacteur1.groups.add(redacteur_group)
    redacteur2.groups.add(redacteur_group)
    redacteur3.groups.add(redacteur_group)

    # Attribution des groupes aux organisateurs
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
        'password': 'userpass123'
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

    # Événements : on force certains événements à être créés par demo_organisateur pour la démo
    seeder.add_entity(Event, 4, {
        'nom': lambda x: seeder.faker.catch_phrase(),
        'description': lambda x: seeder.faker.text(),
        'author': demo_organisateur,
        'bracket_level': lambda x: random.choice(['1', '2', '3', '4', '5']),
        'format': lambda x: random.choice(['commander', 'modern', 'standard']),
        'nombre_participant_max': lambda x: random.randint(10, 100),
        'date': lambda x: seeder.faker.date_time_between(start_date='-5y', end_date='now'),
        'IRL': lambda x: random.choice([True, False]),
        'lieux': lambda x: seeder.faker.address() if random.choice([True, False]) else None,
    })

    # Autres événements par d'autres organisateurs
    seeder.add_entity(Event, 10, {
        'nom': lambda x: seeder.faker.catch_phrase(),
        'description': lambda x: seeder.faker.text(),
        'author': lambda x: random.choice(organisateurs.exclude(pk=demo_organisateur.pk)),
        'bracket_level': lambda x: random.choice(['1', '2', '3', '4', '5']),
        'format': lambda x: random.choice(['commander', 'modern', 'standard']),
        'nombre_participant_max': lambda x: random.randint(10, 100),
        'date': lambda x: seeder.faker.date_time_between(start_date='-5y', end_date='now'),
        'IRL': lambda x: random.choice([True, False]),
        'lieux': lambda x: seeder.faker.address() if random.choice([True, False]) else None,
    })

    seeder.execute()

    # Création manuelle de 5 événements avec moins de 5 places disponibles
    events_data = [
        {
            'nom': 'Tournoi de Commander',
            'description': 'Un tournoi de Commander pour les amateurs de jeux de cartes.',
            'author': demo_organisateur,
            'bracket_level': '1',
            'format': 'commander',
            'nombre_participant_max': 4,
            'date': timezone.now() + timezone.timedelta(days=7),
            'IRL': True,
            'lieux': '123 Rue de la Paix, Paris'
        },
        {
            'nom': 'Tournoi de Modern',
            'description': 'Un tournoi de Modern pour les joueurs compétitifs.',
            'author': demo_organisateur,
            'bracket_level': '2',
            'format': 'modern',
            'nombre_participant_max': 3,
            'date': timezone.now() + timezone.timedelta(days=14),
            'IRL': False,
            'lieux': None
        },
        {
            'nom': 'Tournoi de Standard',
            'description': 'Un tournoi de Standard pour les nouveaux joueurs.',
            'author': demo_organisateur,
            'bracket_level': '3',
            'format': 'standard',
            'nombre_participant_max': 2,
            'date': timezone.now() + timezone.timedelta(days=21),
            'IRL': True,
            'lieux': '456 Avenue des Champs, Lyon'
        },
        {
            'nom': 'Tournoi de Draft',
            'description': 'Un tournoi de Draft pour les joueurs expérimentés.',
            'author': demo_organisateur,
            'bracket_level': '4',
            'format': 'draft',
            'nombre_participant_max': 4,
            'date': timezone.now() + timezone.timedelta(days=28),
            'IRL': True,
            'lieux': '789 Boulevard de la Victoire, Marseille'
        },
        {
            'nom': 'Tournoi de Sealed',
            'description': 'Un tournoi de Sealed pour les joueurs occasionnels.',
            'author': demo_organisateur,
            'bracket_level': '5',
            'format': 'sealed',
            'nombre_participant_max': 3,
            'date': timezone.now() + timezone.timedelta(days=35),
            'IRL': False,
            'lieux': None
        }
    ]

    for event_data in events_data:
        Event.objects.create(**event_data)

    events = Event.objects.all()
    users = User.objects.all()

    # Inscriptions : on force au moins 3 inscriptions sur les événements du demo_organisateur
    demo_events = events.filter(author=demo_organisateur)
    other_users = users.exclude(pk=demo_organisateur.pk)

    for event in demo_events:
        num_participants = min(3, other_users.count())
        selected_users = random.sample(list(other_users), num_participants)
        for u in selected_users:
            Inscription.objects.create(
                event=event,
                player=u,
                deck=seeder.faker.url(),
                etat=random.choice(['en_attente', 'valide', 'refuse']),
            )

    # Inscriptions aléatoires sur tous les événements (y compris demo_organisateur)
    for event in events:
        num_participants = random.randint(1, max(1, event.nombre_participant_max))
        selected_users = random.sample(list(users), min(num_participants, users.count()))
        for u in selected_users:
            Inscription.objects.create(
                event=event,
                player=u,
                deck=seeder.faker.url(),
                etat=random.choice(['en_attente', 'valide', 'refuse']),
            )

    # Mise à jour du nombre de participants pour chaque événement
    for event in events:
        valid_inscriptions = Inscription.objects.filter(event=event, etat='valide').count()
        event.nombre_participant = valid_inscriptions
        event.save()

    print("Seeding terminé sans erreur")

if __name__ == '__main__':
    seed()
