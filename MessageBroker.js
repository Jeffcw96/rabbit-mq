const amqp = require("amqplib");
class MessageBroker {
  constructor(url) {
    this.url = url;
    this.channel = null;
  }

  async connect() {
    const connection = await amqp.connect(this.url);
    this.channel = await connection.createChannel();
  }

  async sendMessage(queueName, payload) {
    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        deliveryMode: 2,
      }
    );
  }

  async publishExchange(exchange, exchangeType, payload, routingKey = "") {
    await this.channel.assertExchange(exchange, exchangeType, {
      durable: true,
    });
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload))
    );
  }

  async close() {
    await this.channel.close();
  }
}

module.exports = MessageBroker;
