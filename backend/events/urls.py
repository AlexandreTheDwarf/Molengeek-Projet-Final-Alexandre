# urls.py
from django.urls import path
from .views import (
    EventListCreateView, EventDetailView, EarlyEventsListView, LastChanceEventsListView,
    ArticleListCreateView, ArticleDetailView, LatestArticlesListView,
    AvisEventListCreateView, EventAvisListView, AvisEventDetailView,
    InscriptionListCreateView, InscriptionDetailView,
    CheckRegistrationView, GetUserInscriptionsView, GetUserCreatedEventsView,
    GetUserCreatedArticlesView, GetInscriptionsForEventView
)

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

    path('inscriptions/check/<int:event_id>/', CheckRegistrationView.as_view(), name='check_registration'),
    path('get_user_inscriptions/', GetUserInscriptionsView.as_view(), name='get_user_inscriptions'),
    path('get_user_events/', GetUserCreatedEventsView.as_view(), name='get_user_events'),
    path('events/<int:event_id>/inscriptions/', GetInscriptionsForEventView.as_view(), name='event-inscriptions'),

    path('get_user_articles/', GetUserCreatedArticlesView.as_view(), name='get_user_articles'),

]
