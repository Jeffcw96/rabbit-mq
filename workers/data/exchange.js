const deadLetterHandler = require("../messageHandler/deadLetterHandler");
const exchangeHandler = require("../messageHandler/exchangeHandler");

const QUEUE_METADATA = [
  /*
    Routing key is required for direct exchange. To create a dead-letter service:
      1. Establish new exchange for dead-letter
      2. Specify the dead-letter exchange type
      3. Provide routing key if it's direct exchange
      4. Include the dead-letter exchange and routing key in your main exchange under deadLetterExchange and deadLetterRoutingKey parameters
      5. The message will be rerouted to the specified dead-letter exchange once it's rejected/ negative acknowledged
      6. To create a retry mechanism
        - Under the dead-letter exchange, specify your deadLetterExchange and deadLetterRoutingKey parameters based on your exchange that you want to return.
        - Then inside dead-letter exchange, we can reject/nack the message so that it will refer these info and rerouted back to the main exchange
  */
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
