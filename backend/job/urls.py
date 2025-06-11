from django.urls import path

from job.views import JobViewSet, TechCategoryListView, JobDetailViewSet, TechStackJobListView, \
    GlobalJobListView, JobGetSingleJob, MyJobsView

urlpatterns = [
    path('', JobViewSet.as_view(), name='job-list'),
    path('detail/<int:id>/', JobDetailViewSet.as_view(), name='job-detail'),
    path('search/<int:id>/', JobGetSingleJob.as_view(), name='single-job-detail'),

    path('tech-categories/', TechCategoryListView.as_view(), name='tech-categories'),

    path('jobs/tech/<str:tech_stack>/', TechStackJobListView.as_view(), name='techstack-jobs'),
    path('my-jobs/<int:user_id>/', MyJobsView.as_view(), name='my-jobs'),
    path('jobs/', GlobalJobListView.as_view(), name='all-jobs'),
]
