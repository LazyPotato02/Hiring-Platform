from django.http import Http404
from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from job.models import Job, TechCategory, TechStack
from job.serializers import JobSerializer, TechCategorySerializer

def get_job_or_404(id, user):
    try:
        job = Job.objects.get(pk=id)
        if job.is_active or job.created_by == user:
            return job
    except Job.DoesNotExist:
        pass
    raise Http404("Job not found")
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
        tech_stack_data = request.data.pop('tech_stack', [])

        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save(created_by=request.user)
            if tech_stack_data:
                tech_stack_objs = TechStack.objects.filter(id__in=tech_stack_data)
                job.tech_stack.set(tech_stack_objs)
            return Response(JobSerializer(job).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobGetSingleJob(APIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_object(self, id, active_required=True):
        filters = {'pk': id}
        if active_required:
            filters['is_active'] = True
        return get_object_or_404(Job, **filters)

    def get(self, request, id):
        job = get_job_or_404(id, request.user)
        serializer = JobSerializer(job)
        return Response(serializer.data)


class JobDetailViewSet(APIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        job = get_job_or_404(id, request.user)
        serializer = JobSerializer(job)
        return Response(serializer.data)

    def put(self, request, id):
        job = get_job_or_404(id, request.user)
        if job.created_by != request.user:
            return Response({"detail": "Unauthorized."}, status=403)
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        job = get_job_or_404(id, request.user)
        if job.created_by != request.user:
            return Response({"detail": "Unauthorized."}, status=403)
        job.delete()
        return Response({"message": "Job deleted"}, status=204)


class TechCategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = TechCategory.objects.prefetch_related('tech_stacks').all()
        serializer = TechCategorySerializer(categories, many=True)
        return Response(serializer.data)


class JobPagination(PageNumberPagination):
    page_size_query_param = 'limit'

    def get_paginated_response(self, data):
        return Response({
            'results': data,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
        })


class TechStackJobListView(ListAPIView):
    permission_classes = [AllowAny]

    serializer_class = JobSerializer
    pagination_class = JobPagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['posted_at']
    ordering = ['-posted_at']
    search_fields = ['title', 'description']

    def get_queryset(self):
        tech_stack = self.kwargs.get('tech_stack')
        return Job.objects.filter(tech_stack__slug=tech_stack, is_active=True)


class GlobalJobListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = JobSerializer
    pagination_class = JobPagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['posted_at']
    ordering = ['-posted_at']
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Job.objects.filter(is_active=True)

class MyJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if request.user.id != user_id:
            return Response({'detail': 'Not authorized.'}, status=403)

        jobs = Job.objects.filter(created_by=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
