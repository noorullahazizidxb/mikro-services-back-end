let channel;

function initPublisher(ch) {
  channel = ch;
}

async function publishUserCreated(user) {
  const queue = 'user_created';
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(user)));
}

module.exports = { initPublisher, publishUserCreated };
