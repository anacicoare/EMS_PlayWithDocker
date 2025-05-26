# Dockerfile
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . /app

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port 8000 (Django default)
EXPOSE 8000

# Run the Django app
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
