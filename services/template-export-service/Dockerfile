FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

COPY . .

EXPOSE 3003

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3003"]
