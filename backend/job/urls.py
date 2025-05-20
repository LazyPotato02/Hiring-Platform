from django.urls import path

from job.views import JobViewSet

urlpatterns = [
    path('',JobViewSet.as_view(), name='job-list'),
    path('<int:id>/',JobViewSet.as_view(), name='job-detail'),
]