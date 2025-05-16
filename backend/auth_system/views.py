from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User, Group
import json

@api_view(['POST'])
def inscription(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    role = data.get('role', 'Utilisateur')  # Default role is 'Utilisateur'

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

    # Assign user to a group based on role
    group, created = Group.objects.get_or_create(name=role)
    new_user.groups.add(group)

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

@api_view(['GET'])
def get_user(request):
    try:
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)
    except:
        return JsonResponse({'error': 'Il y a une erreur'})

    # Get user's groups (roles)
    roles = list(user.groups.values_list('name', flat=True))

    mon_user = {
        'username': user.username,
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'roles': roles, 
    }
    return JsonResponse({'user': mon_user})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    try:
        auth = JWTAuthentication()
        user, _ = auth.authenticate(request)
    except:
        return JsonResponse({'error': 'Il y a une erreur'})

    data = json.loads(request.body)
    username = data.get('username')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if username:
        user.username = username
    if email:
        user.email = email
    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name

    user.save()

    return JsonResponse({'status': 'success', 'message': 'Profil mis à jour', 'user': {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }})
