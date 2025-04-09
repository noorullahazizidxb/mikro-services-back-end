const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const User = require('../models/user.model');

const PROTO_PATH = path.join(__dirname, '../../../proto/user.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDef).user;

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  GetUser: async (call, callback) => {
    const { user_id } = call.request;
    const user = await User.findOne({ user_id });
    if (!user) {
      return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
    }
    callback(null, {
      user_id: user.user_id,
      name: user.name,
      email: user.email
    });
  }
});

function startGrpcServer(port) {
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`gRPC server running on port ${port}`);
  });
}

module.exports = startGrpcServer;
