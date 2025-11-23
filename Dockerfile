# Building the frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend

COPY Frontend/package*.json ./
RUN npm install

COPY Frontend/ ./

RUN npm run build

# Setting up the backend
FROM node:18-alpine
WORKDIR /app

COPY Backend/package*.json ./
RUN npm install

COPY Backend/ ./

# Merge and Run
COPY --from=frontend-build /app/frontend/dist ./dist

EXPOSE 4500

CMD ["npm", "start"]