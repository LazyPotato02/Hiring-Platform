from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from company.models import Company, CompanyMembership
from company.serializers import CompanySerializer
from users.models import CustomUser


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
            company = serializer.save()
            CompanyMembership.objects.create(
                user=request.user,
                company=company,
                role='creator'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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

        membership = CompanyMembership.objects.filter(user=request.user, company=company).first()
        if not membership or membership.role not in ['creator', 'admin']:
            return Response({'detail': 'Not authorized to modify this company.'}, status=403)

        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            new_user_id = request.data.get('user_id')
            new_role = request.data.get('role')

            if new_user_id and new_role:
                user = CustomUser.objects.get(pk=new_user_id)
                CompanyMembership.objects.update_or_create(
                    user=user,
                    company=company,
                    defaults={'role': new_role}
                )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        company = Company.objects.get(pk=id)
        if company:
            company.delete()
            return Response({"message": "Company successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "No companies found"}, status=status.HTTP_404_NOT_FOUND)


class AddUserToCompanyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            company = Company.objects.get(pk=id)
        except Company.DoesNotExist:
            return Response({'detail': 'Company not found.'}, status=status.HTTP_404_NOT_FOUND)

        membership = CompanyMembership.objects.filter(user=request.user, company=company).first()
        if not membership or membership.role not in ['creator', 'admin']:
            return Response({'detail': 'You are not authorized to add users to this company.'},
                            status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        role = request.data.get('role')

        if not user_id or not role:
            return Response({'detail': 'Both user_id and role are required.'}, status=status.HTTP_400_BAD_REQUEST)

        valid_roles = [choice[0] for choice in CompanyMembership.ROLE_CHOICES]
        if role not in valid_roles:
            return Response({'detail': f'Invalid role. Valid roles: {valid_roles}'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if CompanyMembership.objects.filter(user=user, company=company).exists():
            return Response({'detail': 'User is already a member of this company.'}, status=status.HTTP_400_BAD_REQUEST)

        CompanyMembership.objects.create(
            user=user,
            company=company,
            role=role
        )

        return Response({'message': 'User successfully added to company.'}, status=status.HTTP_201_CREATED)
