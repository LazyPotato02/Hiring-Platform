from django.db import models

from company.models import Company


class TechCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TechStack(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(TechCategory, on_delete=models.CASCADE, related_name="tech_stacks")

    def __str__(self):
        return self.name


class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    tech_stack = models.ManyToManyField(TechStack, related_name="jobs")
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)
