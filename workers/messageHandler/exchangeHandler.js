function exchangeHandler(rejectFlag = false) {
  //Figure out why cannot import in outer function scope
  return function (msg) {
    const queueWorker = require("../QueueWorker");
    const channel = queueWorker.getChannel();
    try {
      if (rejectFlag) {
        channel.reject(msg, false);
      } else {
        channel.ack(msg, false);
      }
    } catch (error) {
      console.error("exchange handler error", error);
    }
  };
}

module.exports = exchangeHandler;
