function processLogInfo(msg) {
  return {
    exchange: msg.fields.exchange,
    routingKey: msg.fields.routingKey,
    message: msg.content.toString(),
    rejectedCount: msg.properties.headers["x-death"]
      ? msg.properties.headers["x-death"][0].count
      : null,
  };
}

module.exports = processLogInfo;
