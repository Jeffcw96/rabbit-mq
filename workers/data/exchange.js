const deadLetterHandler = require("../messageHandler/deadLetterHandler");
const exchangeHandler = require("../messageHandler/exchangeHandler");

const QUEUE_METADATA = [
  {
    queue: "job-queue",
    exchange: "job",
    exchangeType: "direct",
    routingKey: "job-key",
    handler: exchangeHandler(true),
    options: {
      deadLetterExchange: "dead-letter",
      deadLetterRoutingKey: "dead-letter-job",
      durable: true,
    },
  },
  {
    queue: "dead-letter-queue",
    exchange: "dead-letter",
    exchangeType: "direct",
    routingKey: "dead-letter-job",
    handler: deadLetterHandler(),
    options: {
      deadLetterExchange: "job",
      deadLetterRoutingKey: "job-key",
      durable: true,
    },
  },
  {
    queue: "", //empty string to generate random queue name
    exchange: "transports",
    exchangeType: "fanout",
    routingKey: "",
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
  },
  /*
    Topic exchange routing key must be a list of words, delimited by dots
    - * (star) can substitute for exactly one word.
    - # (hash) can substitute for zero or more words.
  */
  {
    queue: "", //empty string to generate random queue name
    exchange: "animals",
    exchangeType: "topic",
    routingKey: "*.mammal.*", // eg: animal.mammal.tiger = true ; animal.mammals.tiger.strong = false
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
  },
  {
    queue: "", //empty string to generate random queue name
    exchange: "animals",
    exchangeType: "topic",
    routingKey: "animal.#", // eg: animal.mammal.tiger = true ; animal.mammals.tiger.strong = true ; animalxxx.mamal = false
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
  },
  {
    queue: "", //empty string to generate random queue name
    exchange: "animals",
    exchangeType: "topic",
    routingKey: "animal.#", // eg: animal.mammal.tiger = true ; animal.mammals.tiger.strong = true ; animalxxx.mamal = false
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
  },
  /*
      Headers exchange, message headers
        "headers":{
            "noOfPlayer": 10,
            "duration":40,
            "timeUnit": "minutes"
        }
      - x-match:all ; The headers element's key and value must be exactly matched.
        - if let's say we only have noOfPlayer and duration keys but their value is the same. It will still route to the queue
        - However, if we have 2 same & 1 different header's key, it will not route to the queue
      - x-match: any ; One of the headers element's key and value must be exactly matched.
  */
  {
    queue: "", //empty string to generate random queue name
    exchange: "sport",
    exchangeType: "headers",
    routingKey: "",
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
    headers: {
      noOfPlayer: 10,
      duration: 40,
      timeUnit: "minutes",
      "x-match": "all",
    },
  },
  {
    queue: "", //empty string to generate random queue name
    exchange: "sport",
    exchangeType: "headers",
    routingKey: "",
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
    headers: {
      noOfPlayer: 10,
      timeUnit: "minutes",
      "x-match": "all",
    },
  },
  {
    queue: "", //empty string to generate random queue name
    exchange: "sport",
    exchangeType: "headers",
    routingKey: "",
    handler: exchangeHandler(false),
    options: {
      durable: true,
      expires: 2000,
    },
    headers: {
      isMultiplayer: true,
      noOfPlayer: 10,
      timeUnit: "hours",
      "x-match": "any",
    },
  },
];

module.exports = QUEUE_METADATA;
