from django.urls import path
from .views import *

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),

    path('avis/', AvisEventListCreateView.as_view(), name='avisEvent-list-create'),
    path('avis/<int:pk>/', AvisEventDetailView.as_view(), name='avisEvent-detail'),

    path('inscriptions/', InscriptionListCreateView.as_view(), name='inscriptionEvent-list-create'),
    path('inscriptions/<int:pk>/', InscriptionDetailView.as_view(), name='inscriptionEvent-detail'),
]
