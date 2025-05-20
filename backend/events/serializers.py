from rest_framework import serializers
from .models import Event, Inscription, AvisEvent, Article
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class EventLightSerializer(serializers.ModelSerializer):
    nombre_participant = serializers.SerializerMethodField()
    nombre_participant_max = serializers.IntegerField()

    class Meta:
        model = Event
        fields = ['id', 'nom', 'date', 'lieux', 'nombre_participant', 'nombre_participant_max']

    def get_nombre_participant(self, obj):
        return obj.inscriptions.filter(etat="valide").count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['date'] = instance.date.isoformat() if instance.date else None
        return representation


class EventSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'

class InscriptionSerializer(serializers.ModelSerializer):
    event = EventLightSerializer()
    player = UserSerializer()

    class Meta:
        model = Inscription
        fields = ['id', 'event', 'player', 'deck', 'etat']

class AvisEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisEvent
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    auteur = UserSerializer(read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'titre', 'categorie', 'contenu', 'image_banner', 'auteur', 'date_creation']

    def validate_image_banner(self, value):
        if value and value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("L'image est trop volumineuse.")
        return value

