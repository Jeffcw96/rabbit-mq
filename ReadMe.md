## Endpoints:

| Description   | Url                                                              |
| ------------- | ---------------------------------------------------------------- |
| Post Queue    | `http://localhost:3000/api/publish/:queueName`                   |
| Post exchange | `http://localhost:3000/api/:exchangeName/exchange/:exchangeType` |

## How run consumer command:

### Exchange

- npm run consumer process=exchange exchange=`aa` exchangeType=`bb` routingKey=`cc`

#### Headers Exchange

- npm run consumer process=exchange exchange=xx exchangeType=headers routingKey='' matchingType=`dd` headers=`'{"transport":"car", ....}'`

#### Example

- npm run consumer process=exchange exchange=transport exchangeType=headers routingKey='' headers='{"transport":"car", "isVehicle":"true", "x-match":"all"}'

Where :

- aa : exchange name
- bb : direct | fanout | topic | headers
- cc : routing key
- dd : any | all

### Queue

- npm run consumer process=queue queue=job
