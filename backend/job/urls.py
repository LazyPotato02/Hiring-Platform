from django.urls import path

from job.views import JobViewSet, TechCategoryListView

urlpatterns = [
    path('',JobViewSet.as_view(), name='job-list'),
    path('<int:id>/',JobViewSet.as_view(), name='job-detail'),

    path('tech-categories/', TechCategoryListView.as_view(), name='tech-categories'),
]