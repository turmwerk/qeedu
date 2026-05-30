FROM python:3.12-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends bubblewrap ca-certificates nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY ai-chat/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ai-chat/app ./app
COPY ai-chat/configs ./configs

EXPOSE 50054
CMD ["python", "-m", "app.main"]
