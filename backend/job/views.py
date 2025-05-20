from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from job.models import Job
from job.serializers import JobSerializer


class JobViewSet(APIView):
    serializer_class = JobSerializer
    queryset = Job.objects.all()

    def get(self, request):
        serializer = JobSerializer(Job.objects.filter(is_active=True), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailViewSet(APIView):
    serializer_class = JobSerializer
    queryset = Job.objects.all()

    def get(self, request, id):
        job = get_object_or_404(Job, pk=id, is_active=True)
        serializer = JobSerializer(job)
        return Response(serializer.data)

    def put(self, request, id):
        job = get_object_or_404(Job, pk=id)
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        job = get_object_or_404(Job, pk=id)
        if job:
            job.delete()
            return Response({"message": "job successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
        return Response({"message": "No job found"}, status=status.HTTP_404_NOT_FOUND)
