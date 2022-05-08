function deadLetterHandler() {
  return function (msg, channel) {
    console.log("dead-letter msg", JSON.parse(msg.content.toString()));
    if (msg.properties.headers["x-death"][0].count > 4) {
      channel.ack(msg);
    } else {
      /**since we assert main_exchange and it's routing key as deadLetter,
            when dead letter reject msg it will g back to it's original route
          **/
      channel.reject(msg, false);
    }
  };
}

module.exports = deadLetterHandler;
