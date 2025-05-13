from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin
from .models import Event, Inscription, AvisEvent, Article

# Unregister the default User admin
admin.site.unregister(User)

# Custom UserAdmin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_groups')

    def get_queryset(self, request):
        # On utilise prefetch_related pour optimiser la récupération des groupes (ManyToMany)
        qs = super().get_queryset(request)
        return qs.prefetch_related('groups')

    def get_groups(self, instance):
        return ", ".join([group.name for group in instance.groups.all()])
    get_groups.short_description = 'Groups'

# Register the custom UserAdmin
admin.site.register(User, CustomUserAdmin)

# Register other models
admin.site.register(Event)
admin.site.register(Inscription)
admin.site.register(AvisEvent)
admin.site.register(Article)
