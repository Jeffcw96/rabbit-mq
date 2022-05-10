const { methodInfoConnectionUnblocked } = require("amqplib/lib/defs");
const uuid = require("uuid");

function uniqueId() {
  return uuid.v4();
}

module.exports = uniqueId;
