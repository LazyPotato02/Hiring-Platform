from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import JobApplication
from .serializers import JobApplicationSerializer

class JobApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        job_id = request.data.get('job')
        if not job_id:
            return Response({'error': 'Missing job ID'}, status=400)

        serializer = JobApplicationSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'Application submitted'}, status=201)
        return Response(serializer.errors, status=400)


