FROM node:24

WORKDIR /app

# Copy shared folder first (needed for path mappings)
COPY shared ./shared

# Copy backend files
COPY backend/package.json .
COPY backend/package-lock.json* .

RUN npm install

COPY backend/src ./src
COPY backend/tsconfig.json .

EXPOSE 5000

CMD [ "npm", "run", "dev" ]