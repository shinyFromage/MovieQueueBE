# MovieQueueBE
Backend for a multi user movie queue website 


## Technologies Used
    Prisma
    Graphql
    Apollo Server 4
    TypeScript

## Installation
### database
with prisma the structure of the database is saved under the `schema.prisma` file
currently it is set to work with mysql but you can change the provider to others ([here is a link](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-cockroachdb) to the doc for how to set it up with other datasources  )
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
make sure you set up an .env file for your database url
then to actually build your database run the following command

```bash
npx prisma migrate dev --name init
```
### server
running the server should be a simple 
```
npm start
```
apollo provides a nice default sandbox to test out the api on http://localhost:4000 when the server is running