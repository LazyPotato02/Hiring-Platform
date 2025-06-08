from django.db import models
from django.contrib.auth import get_user_model

from job.models import Job

User = get_user_model()

class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    cv = models.FileField(upload_to='cvs/')
    message = models.TextField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} applied for {self.job.title}"
