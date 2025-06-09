import mimetypes

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from job.models import Job
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

        if JobApplication.objects.filter(user=request.user, job_id=job_id).exists():
            return Response({'detail': 'Already applied'}, status=400)

        serializer = JobApplicationSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            application = serializer.save(user=request.user)
            job = application.job
            employer_email = job.created_by.email
            applicant_email = request.user.email
            applicant_name = request.user.get_full_name()
            applicant_github = request.data['github']
            applicant_phone = request.data['phone']
            applicant_linkedin = request.data['linkedin']
            applicant_message = request.data['message']

            # ✅ Email to applicant
            send_mail(
                subject="✅ Application Submitted Successfully",
                message=f"Hello {applicant_name},\n\nYou have successfully applied for the job: {job.title}.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[applicant_email],
            )

            # ✅ Email to employer with CV and details
            email = EmailMessage(
                subject="📨 New Job Application Received",
                body=(
                    f"{applicant_name} has applied for the job: {job.title}\n"
                    f"Email: {applicant_email}\n"
                    f"Phone: {applicant_phone}\n"
                    f"Github: {applicant_github}\n"
                    f"LinkedIn: {applicant_linkedin}\n"
                    
                    f"Message: {applicant_message}\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[employer_email],
            )

            # ✅ Attach CV if available
            if application.cv:
                cv_file = application.cv
                mime_type, _ = mimetypes.guess_type(cv_file.name)
                email.attach(cv_file.name, cv_file.read(), mime_type or 'application/octet-stream')

            email.send()

            return Response({'message': 'Application submitted'}, status=201)

        return Response(serializer.errors, status=400)




class JobApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        already_applied = JobApplication.objects.filter(user=request.user, job_id=job_id).exists()
        return Response({"applied": already_applied})
