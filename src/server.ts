import Fastify from 'fastify';
import registerPlugins from './plugins';
import registerRoutes from './routes';

const buildApp = () => {
  const fastify = Fastify({ logger: true });

  registerPlugins(fastify);
  registerRoutes(fastify);

  return fastify;
};

export default buildApp;
