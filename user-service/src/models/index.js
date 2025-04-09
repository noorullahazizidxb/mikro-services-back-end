require('dotenv').config();
const connectMongo = require('./config/mongo');
const setupRabbitMQ = require('./messaging/rabbitmq');
const startGrpcServer = require('./grpc/server');

(async () => {
  await connectMongo(process.env.MONGO_URI);
  await setupRabbitMQ(process.env.RABBITMQ_URI);
  startGrpcServer(process.env.PORT);
})();
