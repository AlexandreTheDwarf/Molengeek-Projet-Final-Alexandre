from rest_framework import generics
from rest_framework.views import APIView
from django.db.models import F
from .models import Event, Article, AvisEvent, Inscription
from .serializers import EventSerializer, ArticleSerializer, AvisEventSerializer, InscriptionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .permissions import IsAuthorOrHasChangePermission

class EventListView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

from rest_framework.permissions import AllowAny, IsAuthenticated

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsAuthorOrHasChangePermission()]
        return [AllowAny()]

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)

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
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        event_id = self.request.data.get('event')
        event = Event.objects.get(id=event_id)
        serializer.save(player=self.request.user, event=event)

class InscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # pour savoir si c'est un PATCH ou PUT
        instance = self.get_object()

        # Met à jour l'état uniquement si présent dans la requête
        etat = request.data.get('etat')
        if etat:
            instance.etat = etat

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Recalcul du nombre de participants valides
        instance.event.update_participant_count()

        return Response(serializer.data, status=status.HTTP_200_OK)

# Special views : 

class EarlyEventsListView(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.all().order_by('-date')[:10]  # Get the 10 most recent events

class LastChanceEventsListView(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        # Calcule le nombre de places restantes
        return Event.objects.annotate(
            places_restantes=F('nombre_participant_max') - F('nombre_participant')
        ).filter(
            places_restantes__lte=5,
            places_restantes__gt=0  
        ).order_by('-places_restantes')[:5]


class LatestArticlesListView(generics.ListAPIView):
    serializer_class = ArticleSerializer

    def get_queryset(self):
        return Article.objects.all().order_by('-date_creation')[:5]  # Get the 5 most recent articles

class CheckRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        user = request.user
        is_registered = Inscription.objects.filter(event_id=event_id, player=user).exists()
        return Response({'isRegistered': is_registered}, status=status.HTTP_200_OK)
    
class GetUserInscriptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            inscriptions = Inscription.objects.filter(player=user).order_by('-event__date')
            serializer = InscriptionSerializer(inscriptions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetUserCreatedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            events = Event.objects.filter(author=user).order_by('-date')
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetUserCreatedArticlesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            articles = Article.objects.filter(auteur=user).order_by('-date_creation')
            serializer = ArticleSerializer(articles, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
class GetInscriptionsForEventView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        try:
            event = Event.objects.get(pk=event_id, author=request.user)
            inscriptions = Inscription.objects.filter(event=event)
            serializer = InscriptionSerializer(inscriptions, many=True)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response({"error": "Événement introuvable ou non autorisé."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
