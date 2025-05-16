# permissions.py
from rest_framework import permissions

class IsAuthorOrHasChangePermission(permissions.BasePermission):
    """
    L'utilisateur doit être l'auteur de l'objet OU avoir la permission 'change_event'
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Si l'utilisateur est l'auteur
        if obj.author == request.user:
            return True

        # Si l'utilisateur a la permission globale (ex: admin)
        return request.user.has_perm('events.change_event')
