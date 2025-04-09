const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/user.proto');
const pkgDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(pkgDef).user;

const client = new userProto.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

client.GetUser({ user_id: 'u1' }, (err, res) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('User Details:');
    console.log(`User ID: ${res.user_id}`);
    console.log(`Name: ${res.name}`);
    console.log(`Email: ${res.email}`);
    console.log('Orders:');
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
