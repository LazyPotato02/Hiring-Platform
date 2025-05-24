from rest_framework import serializers

from company.models import Company
from company.serializers import CompanyJobSerializer
from job.models import Job, TechStack, TechCategory


class JobSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all())
    tech_stack = serializers.PrimaryKeyRelatedField(many=True, queryset=TechStack.objects.all())

    class Meta:
        model = Job
        fields = '__all__'



class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = ['id', 'name', 'slug']


class TechCategorySerializer(serializers.ModelSerializer):
    tech_stacks = TechStackSerializer(many=True, read_only=True)

    class Meta:
        model = TechCategory
        fields = ['id', 'name', 'tech_stacks']