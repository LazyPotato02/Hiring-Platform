from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),

    path('company/', include('company.urls')),
    path('job/',include('job.urls')),
]
