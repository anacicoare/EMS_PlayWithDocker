# Dockerfile
FROM python:3

ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Copy the entire teams_module into the image
COPY ./teams_module ./teams_module

# Copy the entire payments_module into the image
COPY ./payments_module ./payments_module

# Install teams_module dependencies (optional but helpful)
WORKDIR /app/teams_module
RUN pip install -r requirements.txt || true
RUN pip install -e .

# Install payments_module dependencies
WORKDIR /app/payments_module
RUN pip install -r requirements.txt

# Expose the port used by the Django server
EXPOSE 8003

# Run the Django app
COPY payments_module/entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8003"]