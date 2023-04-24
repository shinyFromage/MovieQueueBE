import { PrismaClient } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import GraphQLJSON from 'graphql-type-json';

interface Context {
    prismaa: PrismaClient
}

const prisma = new PrismaClient();



const typeDefs = `#graphql

    scalar JSON

    enum MovieListStatus {
        UNREAD
        SEARCHING
        FOUND_NO_SUB
        FOUND_SUB
        CANT_FIND
        WATCHED
    }

    type Group {
        id: Int!
        name: String!
        profileImage: String
        ruleset: JSON
        list: [List]!
    }

    type List {
        id: Int!
        name: String!
        ownerId: Int!
        groupId: Int
        group: Group
        user: User!
        movieList: [MovieList]!
        movies: [Movie]
    }

    type MovieList {
        listId: Int!
        movieId: Int!
        status: MovieListStatus!
        list: List!
        movie: Movie!
    }

    type Movie {
        id: Int!
        title: String!
        year: Int!
        imdbUrl: String
        runtime: String
        director: String
        additionalNote: String
        language: String
        movieList: [MovieList]!
    }

    type User {
        id: Int!
        name: String!
        profileImage: String
        list: [List]!
    }

    type Query {
        groups: [Group!]!
        group(id: Int!): Group
        lists: [List!]!
        list(id: Int!): List
        movieLists: [MovieList!]!
        movieList(listId: Int!, movieId: Int!): MovieList
        movies: [Movie!]!
        movie(id: Int!): Movie
        users: [User!]!
        user(id: Int!): User
    }

    type Mutation {
        createGroup(name: String!, profileImage: String, ruleset: JSON): Group!
        updateGroup(id: Int!, name: String, profileImage: String, ruleset: JSON): Group!
        deleteGroup(id: Int!): Group
        createList(name: String!, ownerId: Int!, groupId: Int): List!
        updateList(id: Int!, name: String, ownerId: Int, groupId: Int): List!
        deleteList(id: Int!): List
        addMovieToList(listId: Int!, movieId: Int!, status: MovieListStatus!): MovieList!
        updateMovieStatus(listId: Int!, movieId: Int!, status: MovieListStatus!): MovieList!
        removeMovieFromList(listId: Int!, movieId: Int!): MovieList!
        createMovie(title: String!, year: Int!, imdbUrl: String, runtime: String, director: String, additionalNote: String, language: String): Movie!
        updateMovie(id: Int!, title: String, year: Int, imdbUrl: String, runtime: String, director: String, additionalNote: String, language: String): Movie!
        deleteMovie(id: Int!): Movie
        createUser(name: String!, profileImage: String): User!
        updateUser(id: Int!, name: String, profileImage: String): User!
        deleteUser(id: Int!): User
    }
`;

const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        groups: async () => {
            return await prisma.group.findMany();
        },
        group: async (parent, { id }) => {
            return await prisma.group.findUnique({ where: { id: id } });
        },
        lists: async () => {
            return await prisma.list.findMany();
        },
        list: async (parent, { id }) => {
            return await prisma.list.findUnique({ where: { id: id } });
        },
        movies: async () => {
            return await prisma.movie.findMany();
        },
        movie: async (parent, { id }) => {
            return await prisma.movie.findUnique({ where: { id: id } });
        },
        movieLists: async () => {
            return await prisma.movieList.findMany();
        },
        movieList: async (parent, args) => {
            return await prisma.movieList.findUnique({ where: { listId_movieId: { listId: args.listId, movieId: args.movieId }}})
        },
        user: async (parent, { id }) => {
            return await prisma.user.findUnique({ where: { id: id } });
        },
        users: async () => {
            return await prisma.user.findMany();
        }
    },
  
    Mutation: {
        createGroup: async (parent, args ) => {
            return await prisma.group.create({ data: args });
        },
        updateGroup: async (parent, args ) => {
            return await prisma.group.update({ where: { id: args.id }, data: args });
        },
        deleteGroup: async (parent, { id }) => {
            return await prisma.group.delete({ where: { id: id } });
        },
        createList: async (parent, args ) => {
            return await prisma.list.create({ data: args });
        },
        updateList: async (parent, args ) => {
            return await prisma.list.update({ where: { id: args.id }, data: args });
        },
        deleteList: async (parent, { id }) => {
            return await prisma.list.delete({ where: { id: id } });
        },
        createMovie: async (parent, args ) => {
            return await prisma.movie.create({ data: args });
        },
        updateMovie: async (parent, args ) => {
            return await prisma.movie.update({ where: { id: args.id }, data: args });
        },
        deleteMovie: async (parent, { id }) => {
            return await prisma.movie.delete({ where: { id: id } });
        },
        createUser: async (parent, args ) => {
            return await prisma.user.create({ data: args });
        },
        updateUser: async (parent, args) => {
            return await prisma.user.update({ where: { id: args.id }, data: args });
        },
        deleteUser: async (parent, { id }) => {
            return await prisma.user.delete({ where: { id: id } });
        },
        addMovieToList: async (parent, args ) => {
            return await prisma.movieList.create({ data: args });
        },
        updateMovieStatus: async (parent, args ) => {
            return await prisma.movieList.update({ where: { listId_movieId: { listId: args.listId, movieId: args.movieId } }, data: args });
        },
        removeMovieFromList: async (parent, args) => {
            return await prisma.movieList.delete({ where: { listId_movieId: { listId: args.listId, movieId: args.movieId } } });
        },
    },
  
    Group: {
        list: async (parent) => {
            return await prisma.list.findMany({ where: { groupId: parent.id } });
        },
    },
  
    List: {
        user: async (parent) => {
            return await prisma.user.findUnique({ where: { id: parent.ownerId } });
        },
        group: async (parent) => {
            return await prisma.group.findUnique({ where: { id: parent.groupId } });
        },
        movieList:async (parent) => {
            return await prisma.list.findUnique({ where: {id: parent.id }}).movieList()
        },
        movies: async (parent) => {
            // a possibly more direct approach to getting the movies in a list
            // but you do lose the status info
            // a possible todo would be to modify the movie type to fetch this info
            const movieList = await prisma.movieList.findMany({ 
                where: { listId: parent.id }
            })
            const movieIds = movieList.map((x) => x.movieId)
            return await prisma.movie.findMany({
                where: {
                    id: { in: movieIds }
                }
            })
        }
    },
  
    MovieList: {
        list: async (parent) => {
            return await prisma.list.findUnique({ where: { id: parent.listId } });
        },
        movie: async (parent) => {
            return await prisma.movie.findUnique({ where: { id: parent.movieId } });
        },
    },
  
    Movie: {
        movieList: async (parent) => {
            return await prisma.movieList.findMany({ where: { movieId: parent.id } });
        },
    },

    User: {
        list: async (parent) => {
            return await prisma.list.findMany({ where: { ownerId: parent.id } })
        },
    }
};

const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000},
    context: async () => ({prismaa: prisma})
});

console.log(` Server ready at: ${url}`);