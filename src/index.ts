import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';
import { Context, createContext } from './context';


const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000},
    context: createContext
});

console.log(` Server ready at: ${url}`);