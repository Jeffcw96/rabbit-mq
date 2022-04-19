const amqp = require("amqplib");
const rabbitmqUrl = "amqp://localhost:5672";
class MessageBroker {
  constructor() {
    this.url = rabbitmqUrl;
    this.channel = null;
  }

  async connect() {
    const connection = await amqp.connect(this.url);
    this.channel = await connection.createChannel();
  }

  async assertQueue(queueName, option = {}) {
    await this.channel.assertQueue(queueName, option);
  }

  async sendMessage(queueName, payload) {
    await this.channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        deliveryMode: 2,
      }
    );
  }

  async publishExchange({ exchange, exchangeType, body, options = {} }) {
    const { payload, properties } = body;
    await this.assertExchange(exchange, exchangeType, options);
    await this.channel.assertExchange(exchange, exchangeType, {
      durable: true,
    });
    this.channel.publish(
      exchange,
      properties.routing_key,
      Buffer.from(JSON.stringify(payload)),
      options
    );
  }

  async assertExchange(exchange, exchangeType, options = {}) {
    await this.channel.assertExchange(exchange, exchangeType, options);
  }

  async bindExchangeQueue(exchange, routingKey, option = {}) {
    /*
     *One of the reason put empty string is because `fanout` exchange will broadcast message to each queue,
     *If we assertQueue with same queue name, only 1 consumer will receive the message as there are in the same queue.name
     *Passing empty string will automatically create random queue name and exclusive flag will delete thr queue after it closed
     */
    const { queue } = await this.channel.assertQueue("", option);

    // channel.prefetch(1); //ensure the queue doesn't keep dispatch message to consumer until they've ack the job
    await this.channel.bindQueue(queue, exchange, routingKey, option.headers);

    return queue;
  }

  consumeMessage(queue) {
    this.channel.consume(queue, (data) => {
      console.log("data", data);
      console.log("Received", JSON.parse(data.content.toString()));
      this.channel.ack(data, false, true);
    });
  }

  async close() {
    await this.channel.close();
  }

  isValidExchangeType(exchangeType) {
    return ["fanout", "direct", "topic", "headers"].some(
      (exchange) => exchange === exchangeType
    );
  }
}

module.exports = MessageBroker;
