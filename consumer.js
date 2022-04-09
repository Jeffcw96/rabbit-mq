const amqp = require("amqplib");
connectQueue();
connectExchange();
connectDirectExchange();
connectDirectExchange2();

async function connectQueue() {
  try {
    const queueName = "jobs";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1); //ensure the queue doesn't keep dispatch message to consumer until they've ack the job
    channel.consume(queueName, (data) => {
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log("Received", JSON.parse(data.content.toString()));
        channel.ack(data);
      }, secs * 1000);
      channel.close();
    });
  } catch (error) {
    console.error("Something wrong in RabbitMQ consumer queue", error);
  }
}

async function connectExchange() {
  try {
    const exchange = "jobs_exchange";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "fanout", {
      durable: true,
    });

    /*
     *One of the reason put empty string is because `fanout` exchange will broadcast message to each queue,
     *If we assertQueue with same queue name, only 1 consumer will receive the message as there are in the same queue.name
     *Passing empty string will automatically create random queue name and exclusive flag will delete thr queue after it closed
     */
    const q = await channel.assertQueue("", {
      durable: true,
    });
    // channel.prefetch(1); //ensure the queue doesn't keep dispatch message to consumer until they've ack the job

    console.log(
      " [*] Waiting for messages in %s. To exit press CTRL+C",
      q.queue
    );
    await channel.bindQueue(q.queue, exchange, "");

    channel.consume(q.queue, (data) => {
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log("Received", JSON.parse(data.content.toString()));
        channel.ack(data);
        channel.close();
      }, secs * 1000);
    });
  } catch (error) {
    console.error("Something wrong in RabbitMQ consumer exchange", error);
  }
}

async function connectDirectExchange() {
  try {
    const routingKey = "software_engineer";
    const exchange = "jobs_direct";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    const q = await channel.assertQueue("", {
      durable: true,
    });

    await channel.bindQueue(q.queue, exchange, routingKey);

    channel.consume(q.queue, (data) => {
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log(
          `Received ${exchange} >> ${routingKey}`,
          JSON.parse(data.content.toString())
        );
        channel.ack(data);
        channel.close();
      }, secs * 1000);
    });
  } catch (error) {
    console.error("Something wrong in consumer direct exchange");
  }
}

async function connectDirectExchange2() {
  try {
    const routingKey = "project_manager";
    const exchange = "jobs_direct";
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    const q = await channel.assertQueue("", {
      durable: true,
    });

    await channel.bindQueue(q.queue, exchange, routingKey);

    channel.consume(q.queue, (data) => {
      const secs = data.content.toString().split(".").length - 1;

      setTimeout(() => {
        console.log(
          `Received ${exchange} >> ${routingKey}`,
          JSON.parse(data.content.toString())
        );
        channel.ack(data);
        channel.close();
      }, secs * 1000);
    });
  } catch (error) {
    console.error("Something wrong in consumer direct exchange");
  }
}
