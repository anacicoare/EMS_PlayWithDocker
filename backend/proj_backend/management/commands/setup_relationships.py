from django.core.management.base import BaseCommand
from proj_backend.models import Team, UserData

class Command(BaseCommand):
    help = 'Sets up many-to-many relationships for teams and users'

    def handle(self, *args, **options):
        # Frontend Development Team
        team1 = Team.objects.get(pk=1)
        team1.members.add(*UserData.objects.filter(pk__in=[1, 2, 3, 4, 5]))
        team1.owner.add(UserData.objects.get(pk=1))

        # Backend Systems Team
        team2 = Team.objects.get(pk=2)
        team2.members.add(*UserData.objects.filter(pk__in=[6, 7, 8, 9, 10]))
        team2.owner.add(UserData.objects.get(pk=1))

        # Product Design Team
        team3 = Team.objects.get(pk=3)
        team3.members.add(*UserData.objects.filter(pk__in=[1, 2]))
        team3.owner.add(UserData.objects.get(pk=1))

        # Data Analytics Team
        team4 = Team.objects.get(pk=4)
        team4.members.add(*UserData.objects.filter(pk__in=[3, 4, 5]))
        team4.owner.add(UserData.objects.get(pk=1))

        # Quality Assurance Team
        team5 = Team.objects.get(pk=5)
        team5.members.add(*UserData.objects.filter(pk__in=[6, 7]))
        team5.owner.add(UserData.objects.get(pk=1))

        # DevOps Team
        team6 = Team.objects.get(pk=6)
        team6.members.add(*UserData.objects.filter(pk__in=[8, 9, 10]))
        team6.owner.add(UserData.objects.get(pk=1))

        self.stdout.write(self.style.SUCCESS('Successfully set up team relationships'))