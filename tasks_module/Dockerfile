FROM python:3.10

ENV PYTHONUNBUFFERED=1

# Set base working directory
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Copy the entire teams_module into the image
COPY ./teams_module ./teams_module

# Copy the entire tasks_module into the image
COPY ./tasks_module ./tasks_module

# Install teams_module dependencies (optional but helpful)
WORKDIR /app/teams_module
RUN pip install -r requirements.txt || true
RUN pip install -e .

# Install tasks_module dependencies
WORKDIR /app/tasks_module
RUN pip install -r requirements.txt

# Expose the port used by the Django server
EXPOSE 8004

# Start the server in tasks_module
# Run the Django app
COPY tasks_module/entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh", "./entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8004", "--noreload"]
