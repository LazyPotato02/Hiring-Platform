# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY ./backend /app

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]