function exchangeHandler(rejectFlag = false) {
  return function (msg, channel) {
    try {
      if (rejectFlag) {
        channel.reject(msg, false);
      } else {
        console.log("receive msg", JSON.parse(msg.content.toString()));
        channel.ack(msg, false);
      }
    } catch (error) {
      console.error("exchange handler error", error);
    }
  };
}

module.exports = exchangeHandler;
