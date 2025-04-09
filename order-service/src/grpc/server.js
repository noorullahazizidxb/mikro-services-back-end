const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const Order = require('../models/order.model');

// Load order.proto
const protoPath = path.join(__dirname, '../../../proto/order.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

const server = new grpc.Server();

server.addService(orderProto.OrderService.service, {
  GetOrdersByUser: async (call, callback) => {
    const { userId } = call.request;

    try {
      const orders = await Order.find({ userId });
      callback(null, { orders });
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Internal server error',
      });
    }
  },
});

function startGrpcServer(port) {
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on port ${port}`);
  });
}

module.exports = startGrpcServer;
