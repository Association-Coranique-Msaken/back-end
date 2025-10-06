# Association-Coranique-M'saken Backend

Backend project.

## Prerequisites

Make sure you have the following installed:

-   Node.js
-   npm (Node Package Manager)
-   Docker

## Setup

```bash
git clone https://github.com/Association-Coranique-Msaken/Backend.git

npm install

docker-compose up

```

# About

This project is a combinisation between:

-   Express ts
-   MySql
-   TypeOrm as an ORM
-   JWT Auth (accessToekn & refreshToken)
-   Asmin Roles (fullAccessAdmin, limitedAccess, readOnly)
-   Docker :
    -   Docker.dev for easy and fast development environment
    -   Docker.prod for production environment (TODO)
-   Docker compose :
    -   docker-compose.yml for easy and fast development environment
    -   docker-compose.prod for production environment (TODO)

<br>
<br>

# Swagger-ts

-   To generate a <b>API TS</b> file from <b>swagger.json</b> :

```
npm run swagger:ts (TODO)
```

-   Then copy the generated file <b>src/api/myApi.ts</b> to your frontend folder (TODO)

<br>
<br>

# Migration

-   Create migration called init :

```
npx prisma migrate dev --name "init"
```

-   Upload seeds dummies data to DB :

```
I will add the CMD here
```

<br>
<br>

# Run Development environment:

```
docker-compose up --build
```

<br>
<br>

# Run Production environment:

```
I will add the CMD here
```

<br>
<br>
