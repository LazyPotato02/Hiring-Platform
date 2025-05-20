from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from company.models import Company
from company.serializers import CompanySerializer

class CompanyList(APIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        if companies:
            return Response(serializer.data)
        return Response({'message': 'No companies found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):

        if request.user.role != 'interviewer':
            return Response({"detail": "Only interviewers can create companies."}, status=403)

        serializer = CompanySerializer(data=request.data)
        if not serializer.is_valid():
            name_errors = serializer.errors.get('name', [])
            if any("already exists" in str(e).lower() for e in name_errors):
                return Response({'error': 'Company with that name already exists'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'Error while parsing data'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyDetail(APIView):
    permission_classes = [IsAuthenticated]
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get(self, request, id):
        company = Company.objects.get(pk=id)
        serializer = CompanySerializer(company)
        if company:
            return Response(serializer.data)
        return Response({'message': 'No companies found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        company = Company.objects.get(pk=id)
        serializer = CompanySerializer(company, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        company = Company.objects.get(pk=id)
        company.delete()
        return Response({"message":"Company successfully deleted"},status=status.HTTP_204_NO_CONTENT)
