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
        fields = '__all__'
