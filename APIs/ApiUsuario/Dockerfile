FROM python:3.11-slim

WORKDIR /ServicoWebCadastro
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

ENV GOOGLE_CLIENT_ID="668469425698-17ulsbs51rvuejdd1pkco6bhtilotqs5.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="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"

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]