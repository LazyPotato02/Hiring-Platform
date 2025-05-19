from django.urls import path

from company.views import CompanyList, CompanyDetail

urlpatterns =[
    path('', CompanyList.as_view(), name='company'),
    path('<int:id>', CompanyDetail.as_view(), name='company'),

]