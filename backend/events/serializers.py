from rest_framework import serializers
from .models import Event, Inscription, AvisEvent, Article

# serializers.py

class EventLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'nom', 'date', 'lieux']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['date'] = instance.date.isoformat() if instance.date else None
        return representation

class EventSerializer(serializers.ModelSerializer):  # Version complète
    class Meta:
        model = Event
        fields = '__all__'

class InscriptionSerializer(serializers.ModelSerializer):
    event = EventLightSerializer()  # 🧠 utilise la version light ici

    class Meta:
        model = Inscription
        fields = ['id', 'event', 'deck', 'etat']

class AvisEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisEvent
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'titre', 'categorie', 'contenu', 'image_banner', 'auteur', 'date_creation']

    def validate_image_banner(self, value):
        if value and value.size > 10 * 1024 * 1024:  # 10 MB max
            raise serializers.ValidationError("L'image est trop volumineuse.")
        return value

