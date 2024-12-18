import express, { Application, Request, Response } from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './services/auth.js';
import { expressMiddleware } from '@apollo/server/express4';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  // Use expressMiddleware to integrate Apollo Server
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => ({ user: authMiddleware(req) }),
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (res: Response) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server is running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL available at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();