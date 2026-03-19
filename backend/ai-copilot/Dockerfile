FROM python:3.12-slim

WORKDIR /app

COPY ai-copilot/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ai-copilot/app ./app
COPY ai-copilot/configs ./configs

EXPOSE 50053
CMD ["python", "-m", "app.main"]
