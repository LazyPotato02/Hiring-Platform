from django.urls import path

from job.views import JobViewSet, TechCategoryListView, GetJobsByTechStack, JobDetailViewSet

urlpatterns = [
    path('', JobViewSet.as_view(), name='job-list'),
    path('<int:id>/', JobDetailViewSet.as_view(), name='job-detail'),
    path('tech-categories/', TechCategoryListView.as_view(), name='tech-categories'),
    path('get-techstack-jobs/<str:tech_stack>/', GetJobsByTechStack.as_view(), name='get-jobs-by-tech-stack'),
]