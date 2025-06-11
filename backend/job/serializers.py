from rest_framework import serializers


from job.models import Job, TechStack, TechCategory


class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = ['id', 'name', 'slug']


class JobSerializer(serializers.ModelSerializer):
    tech_stack = TechStackSerializer(many=True, read_only=True)
    tech_stack_ids = serializers.PrimaryKeyRelatedField(
        queryset=TechStack.objects.all(),
        many=True,
        write_only=True,
        source='tech_stack'
    )

    class Meta:
        model = Job
        fields = '__all__'

class TechCategorySerializer(serializers.ModelSerializer):
    tech_stacks = TechStackSerializer(many=True, read_only=True)

    class Meta:
        model = TechCategory
        fields = ['id', 'name', 'tech_stacks']
