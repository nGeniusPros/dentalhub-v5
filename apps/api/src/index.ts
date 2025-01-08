import express from 'express';
import patientsRouter from './routes/patients';
import providersRouter from './routes/providers';
import * as dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'net';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', 'apps', 'frontend', '.env') });

const app = express();
const defaultPort = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

app.use('/api/patients', patientsRouter);
app.use('/api/providers', providersRouter);

// Function to find an available port
function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(startPort, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next port
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

// Start the server on an available port
findAvailablePort(defaultPort)
  .then(port => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to find an available port:', err);
    process.exit(1);
  });