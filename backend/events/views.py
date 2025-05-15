from rest_framework import generics
from .models import Event, Article, AvisEvent, Inscription
from .serializers import EventSerializer, ArticleSerializer, AvisEventSerializer, InscriptionSerializer

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer 

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class EventAvisListView(generics.ListAPIView):
    serializer_class = AvisEventSerializer

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return AvisEvent.objects.filter(event_id=event_id)

class AvisEventListCreateView(generics.ListCreateAPIView):
    queryset = AvisEvent.objects.all()
    serializer_class = AvisEventSerializer

class AvisEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AvisEvent.objects.all()
    serializer_class = AvisEventSerializer

class InscriptionListView(generics.ListAPIView):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer

class InscriptionListCreateView(generics.ListCreateAPIView):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer

class InscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer