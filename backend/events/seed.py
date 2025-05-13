from django.core.management import call_command

def seed():
    # Charger les groupes
    call_command('loaddata', 'fixtures/groups.json')
    # Charger les permissions
    call_command('loaddata', 'fixtures/permissions.json')

if __name__ == '__main__':
    seed()
