require('dotenv').config();
const { connectMongo } = require('./config/mongo');
const startGrpcServer = require('./grpc/server');
const logger = require('./config/logger');
const amqplib = require('amqplib');

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
    const rabbitUri = process.env.RABBITMQ_URI?.trim(); // Ensure no trailing spaces
    logger.info(`RabbitMQ URI: ${rabbitUri}`);
    if (!rabbitUri) {
        logger.error('RabbitMQ URI is not defined');
        throw new Error('RabbitMQ URI is not defined');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const connection = await amqplib.connect(rabbitUri);
            logger.info('Connected to RabbitMQ');
            return connection;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                logger.error(`RabbitMQ connection refused. Attempt ${attempt} of ${retries}. Retrying in ${delay / 1000} seconds...`);
                logger.error('Ensure RabbitMQ is running and accessible at the specified URI.');
                logger.error('To start RabbitMQ, use the command: rabbitmq-server');
                logger.error('Check RabbitMQ logs for more details: /var/log/rabbitmq/rabbitmq.log');
            } else {
                logger.error('RabbitMQ error:', error);
            }

            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
            } else {
                logger.error('All RabbitMQ connection attempts failed.');
                throw error;
            }
        }
    }
};

(async () => {
    await connectMongo(process.env.MONGO_URI);
    try {
        await connectRabbitMQ();
    } catch (error) {
        logger.error('Failed to connect to RabbitMQ:', error);
        process.exit(1); // Exit the process if RabbitMQ connection fails
    }
    startGrpcServer(process.env.PORT);
})();
