from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User, Group

@receiver(post_save, sender=User)
def add_user_to_default_group(sender, instance, created, **kwargs):
    if created:
        group, created_group = Group.objects.get_or_create(name='Utilisateur')
        instance.groups.add(group)
