from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User  # Use Django's default user model
import json

@api_view(['POST'])
def inscription(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')

    if User.objects.filter(username=username).exists():
        return JsonResponse({'status': 'error', 'message': 'Un utilisateur de ce nom existe déjà'})

    new_user = User(
        username=username,
        password=make_password(password),
        first_name=firstname,
        last_name=lastname,
        email=email
    )
    new_user.save()

    return JsonResponse({'status': 'success', 'message': 'Utilisateur créé'})

@api_view(['POST'])
def connexion(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return JsonResponse({'status': 'success', 'message': 'Utilisateur connecté', 'access_token': access_token, 'refresh_token': str(refresh)})
    else:
        return JsonResponse({'status': 'error', 'message': 'Échec de la connexion'})

@api_view(['POST'])
def deconnexion(request):
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'Utilisateur déconnecté'})

def get_user(request):
    try:
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)
    except:
        return JsonResponse({'error': 'Il y a une erreur'})
    mon_user = {
        'username': user.username,
        'id': user.id,
    }
    return JsonResponse({'user': mon_user})
