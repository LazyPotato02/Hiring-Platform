from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from company.models import Company
from company.serializers import CompanySerializer


# Create your views here.
class CompanyList(APIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        if companies:
            return Response(serializer.data)
        return Response({'message':'No companies found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
