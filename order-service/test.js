const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/order.proto');
const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = grpc.loadPackageDefinition(pkgDef).order;

const client = new orderProto.OrderService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

client.GetOrdersByUser({ userId: 'u1' }, (err, res) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Orders for User ID: u1');
    if (res.orders && res.orders.length > 0) {
      res.orders.forEach((order, index) => {
        console.log(`  Order ${index + 1}:`);
        console.log(`    Order ID: ${order.orderId}`);
        console.log(`    Product: ${order.product}`);
        console.log(`    Quantity: ${order.quantity}`);
        console.log(`    Price: ${order.price}`);
      });
    } else {
      console.log('  No orders found.');
    }
  }
});
