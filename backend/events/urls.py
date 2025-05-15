from django.urls import path
from .views import *

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/early/', EarlyEventsListView.as_view(), name='early-events-list'),
    path('events/last-chance/', LastChanceEventsListView.as_view(), name='last-chance-events-list'),

    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/latest/', LatestArticlesListView.as_view(), name='latest-articles-list'),

    path('avis/', AvisEventListCreateView.as_view(), name='avisEvent-list-create'),
     path('events/<int:event_id>/avis/', EventAvisListView.as_view(), name='event-avis-list'),
    path('avis/<int:pk>/', AvisEventDetailView.as_view(), name='avisEvent-detail'),

    path('inscriptions/', InscriptionListCreateView.as_view(), name='inscriptionEvent-list-create'),
    path('inscriptions/<int:pk>/', InscriptionDetailView.as_view(), name='inscriptionEvent-detail'),
]
