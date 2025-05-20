from django.db import models

from company.models import Company


class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    tech_stack = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)