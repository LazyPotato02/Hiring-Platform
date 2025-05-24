from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from job.models import Job, TechCategory, TechStack
from job.serializers import JobSerializer, TechCategorySerializer


class JobViewSet(APIView):
    serializer_class = JobSerializer
    queryset = Job.objects.all()

    def get(self, request):
        tech_stack_ids = request.GET.get('tech_stack')
        category_name = request.GET.get('category')

        jobs = Job.objects.filter(is_active=True)

        if tech_stack_ids:
            ids = [int(id.strip()) for id in tech_stack_ids.split(',') if id.strip().isdigit()]
            jobs = jobs.filter(tech_stack__id__in=ids)

        if category_name:
            jobs = jobs.filter(tech_stack__category__name__iexact=category_name)

        serializer = JobSerializer(jobs.distinct(), many=True)
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

class TechCategoryListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        categories = TechCategory.objects.prefetch_related('tech_stacks').all()
        serializer = TechCategorySerializer(categories, many=True)
        return Response(serializer.data)

class GetJobsByTechStack(APIView):
    permission_classes = [AllowAny]
    def get(self, request, tech_stack):
        jobs = Job.objects.filter(tech_stack__slug=tech_stack, is_active=True).distinct()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)