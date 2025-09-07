# Path: ml-service-python/Dockerfile

# 1. Start from the official FastAPI image, as your teammate intended.
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

# 2. Copy your requirements file into the image.
COPY ./requirements.txt /app/requirements.txt

# 3. Run pip install to install all of your project's libraries.
#    This is the step that fixes the "ModuleNotFoundError".
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# 4. Copy all your application code into the image.
#    This includes main.py and the 'core' directory.
COPY . /app
