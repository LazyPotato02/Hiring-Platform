from django.db import models

from users.models import CustomUser


# Create your models here.
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    website = models.URLField(blank=True)
    users = models.ManyToManyField('users.CustomUser', through='CompanyMembership')

class CompanyMembership(models.Model):
    ROLE_CHOICES = [
        ('creator', 'Creator'),
        ('admin', 'Admin'),
        ('interviewer', 'Interviewer'),
    ]

    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    company = models.ForeignKey('Company', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'company')