require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const logger = require('./logger');

// Load user.proto
const userProtoPath = path.join(__dirname, '../../proto/user.proto');
const userPackageDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

// Load order.proto
const orderProtoPath = path.join(__dirname, '../../proto/order.proto');
const orderPackageDefinition = protoLoader.loadSync(orderProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(orderPackageDefinition).order;

// Create gRPC clients for user-service and order-service
const userClient = new userProto.UserService(
  process.env.USER_SERVICE_HOST,
  grpc.credentials.createInsecure()
);

const orderClient = new orderProto.OrderService(
  process.env.ORDER_SERVICE_HOST,
  grpc.credentials.createInsecure()
);

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  GetUser: (call, callback) => {
    const { user_id } = call.request;

    // Fetch user details from user-service
    userClient.GetUser({ user_id }, (err, userResponse) => {
      if (err) {
        logger.error('Error fetching user:', err.message);
        return callback(err);
      }

      // Fetch orders for the user from order-service
      orderClient.GetOrdersByUser({ userId: user_id }, (orderErr, orderResponse) => {
        if (orderErr) {
          logger.error('Error fetching orders:', orderErr.message);
          return callback(orderErr);
        }

        // Combine user details with orders
        const combinedResponse = {
          ...userResponse,
          orders: orderResponse.orders || [],
        };

        callback(null, combinedResponse);
      });
    });
  },
});

server.bindAsync(`0.0.0.0:${process.env.PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  logger.info(`Gateway service running on port ${process.env.PORT}`);
});
