const amqplib = require('amqplib');
const winston = require('winston');

async function setupRabbitMQ(uri) {
  try {
    const connection = await amqplib.connect(uri);
    const channel = await connection.createChannel();
    winston.info('Connected to RabbitMQ');
    return channel;
  } catch (err) {
    winston.error('RabbitMQ error:', err);
    process.exit(1);
  }
}

module.exports = setupRabbitMQ;
