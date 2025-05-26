# Etapa 1 – Build
FROM node:18-slim AS builder

WORKDIR /app

# Copiem fișierele de config și instalăm dependențele
COPY package.json package-lock.json* ./
RUN npm ci

# Copiem tot proiectul și rulăm build-ul
COPY . .
RUN npm run build

# Etapa 2 – Run (servește aplicația)
FROM node:18-slim

WORKDIR /app

# Copiem doar artefactele build-uite
COPY --from=builder /app ./

# Dacă folosești Tailwind sau imagini, le are deja builduite

EXPOSE 4000

CMD ["npm", "start"]
