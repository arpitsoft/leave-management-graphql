import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import resolvers from '../src/resolvers/resolvers'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config/jwt";

const server = new ApolloServer({
    typeDefs,
    resolvers,
    persistedQueries: { ttl: 900 },
});

async function start() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3200 },
        context: async ({ req }) => {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return { user: null };
            }

            const token = authHeader.replace('Bearer ', '');
            try {
                const user = jwt.verify(token, JWT_SECRET);
                return { user };
            } catch (err) {
                throw new Error('Invalid or expired token');
            }
        }
    });

    console.log('Server running on', url);
}

start();