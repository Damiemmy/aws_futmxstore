FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
#-----------------Test-run for AI assistant Dependencies Start-------------------
RUN pip install --no-cache-dir \
    --timeout=120 \
    --retries=5 \
    --index-url https://download.pytorch.org/whl/cpu \
    torch==2.13.0

RUN pip install --no-cache-dir \
    --timeout=120 \
    --retries=5 \
    -r requirements.txt
#-----------------Test-run for AI assistant Dependencies End-------------------

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]



