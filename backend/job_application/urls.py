from django.urls import path
from .views import JobApplicationView

urlpatterns = [
    path('apply/', JobApplicationView.as_view(), name='apply-job'),
]
