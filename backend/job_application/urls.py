from django.urls import path
from .views import JobApplicationView, JobApplicationStatusView

urlpatterns = [
    path('apply/', JobApplicationView.as_view(), name='apply-job'),
path('apply/status/<int:job_id>/', JobApplicationStatusView.as_view(), name='application-status'),

]
