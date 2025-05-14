from rest_framework import serializers
from .models import Event, Inscription, AvisEvent, Article

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class InscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscription
        fields = '__all__'

class AvisEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvisEvent
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['titre', 'categorie', 'contenu', 'image_banner', 'auteur']

    def validate_image_banner(self, value):
        if value and value.size > 10 * 1024 * 1024:  # 10 MB max
            raise serializers.ValidationError("L'image est trop volumineuse.")
        return value
