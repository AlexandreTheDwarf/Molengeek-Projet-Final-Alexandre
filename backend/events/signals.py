from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.contrib.auth.models import User, Group
from .models import AvisEvent, Inscription

@receiver(post_save, sender=User)
def add_user_to_default_group(sender, instance, created, **kwargs):
    if created:
        group, created_group = Group.objects.get_or_create(name='Utilisateur')
        instance.groups.add(group)

@receiver(pre_delete, sender=User)
def ban_user_avis(sender, instance, **kwargs):
    AvisEvent.objects.filter(author=instance).update(banned=True)

@receiver(post_save, sender=Inscription)
def update_participant_count(sender, instance, **kwargs):
    if instance.etat == 'valide':
        event = instance.event
        event.nombre_participant += 1
        event.save()