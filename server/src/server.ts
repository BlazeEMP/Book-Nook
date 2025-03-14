import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

const __dirname = path.resolve();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startApolloServer = async () => {

    try {
        await server.start();
        await db();
        console.log('MongoDB connected successfully');

        const PORT = process.env.PORT || 3001;
        const app = express();

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.use(
            '/graphql',
            expressMiddleware(server, { context: authenticateToken as any })
        );

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
        });

        if (process.env.NODE_ENV === 'production') {
            app.use(express.static(path.join(__dirname, '../client/dist')));

            app.get('*', (_req: Request, res: Response) => {
                res.sendFile(path.join(__dirname, '../client/dist/index.html'));
            });
        }
    } catch (error) {
        console.error('Error starting Apollo Server:', error);
    }
};

startApolloServer();