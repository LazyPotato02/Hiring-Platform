from rest_framework import serializers

from company.serializers import CompanyJobSerializer
from job.models import Job


class JobSerializer(serializers.ModelSerializer):
    company = CompanyJobSerializer(read_only=True)
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('is_active',)
