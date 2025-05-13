from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    FORMAT_CHOICES = [
        ('commander', 'Commander'),
        ('modern', 'Modern'),
        ('standard', 'Standard'),
    ]

    BRACKET_CHOICES = [
        ('1', 'Niveau 1'),
        ('2', 'Niveau 2'),
        ('3', 'Niveau 3'),
        ('4', 'Niveau 4'),
        ('5', 'Niveau 5'),
    ]

    nom = models.CharField(max_length=100)
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_events")
    bracket_level = models.CharField(max_length=1, choices=BRACKET_CHOICES)
    format = models.CharField(max_length=50, choices=FORMAT_CHOICES)
    banner_img = models.ImageField(upload_to='event_banners/', default='default_banner.jpg')
    nombre_participant = models.PositiveIntegerField()
    date = models.DateTimeField()
    IRL = models.BooleanField(default=False)
    lieux = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nom

class Inscription(models.Model):
    ETAT_CHOICES = [
        ('en_attente', 'En attente'),
        ('valide', 'Validé'),
        ('refuse', 'Refusé'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="inscriptions")
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    deck = models.URLField(help_text="Lien vers le deck (Moxfield ou MagicVille)")
    etat = models.CharField(max_length=20, choices=ETAT_CHOICES, default='en_attente')

    def __str__(self):
        return f"{self.player.username} - {self.event.nom}"

class AvisEvent(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='avis')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    positif = models.BooleanField()
    commentaire = models.TextField()
    date_poste = models.DateTimeField(auto_now_add=True)
    banned = models.BooleanField(default=False)

    def __str__(self):
        return f"Avis de {self.author.username} sur {self.event.nom}"

class Article(models.Model):
    CATEGORIE_CHOICES = [
        ('news', 'News'),
        ('guide', 'Guide'),
        ('avis', 'Avis'),
    ]

    titre = models.CharField(max_length=200)
    image_banner = models.ImageField(upload_to='article_banners/', default='default_article.jpg')
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES)
    contenu = models.TextField()
    auteur = models.ForeignKey(User, on_delete=models.CASCADE)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre
