const amqp = require("amqplib");

async function sendToQueue(queueName, payload) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
  } catch (error) {
    console.error("Something wrong in RabbitMQ", error);
    throw error;
  }
}

module.exports = sendToQueue;
