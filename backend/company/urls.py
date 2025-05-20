from django.urls import path

from company.views import CompanyList, CompanyDetail, AddUserToCompanyView

urlpatterns = [
    path('', CompanyList.as_view(), name='company'),
    path('<int:id>', CompanyDetail.as_view(), name='company'),
    path('<int:id>/add_user/', AddUserToCompanyView.as_view(), name='add-user-to-company'),

]
