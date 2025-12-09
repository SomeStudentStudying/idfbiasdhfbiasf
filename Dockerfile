FROM ollama/ollama:latest

# Copier ton fichier modèle
COPY ./models/Model /models/Model

# Télécharger Llama3
RUN ollama pull llama3

# Créer ton modèle custom
RUN ollama create parking-sign-ai -f /models/Model

EXPOSE 11434
CMD ["ollama", "serve"]
