## How run consumer command:

### Exchange

- npm run consumer process=exchange exchange=`aa` exchangeType=`bb` routingKey=`cc`

#### Headers Exchange

- npm run consumer process=exchange exchange=xx exchangeType=headers routingKey='' matchingType=`dd` headers=`'{"transport":"car", ....}'`

#### Example

- npm run consumer process=exchange exchange=transport exchangeType=headers routingKey='' matchingType=any headers='{"transport":"car", "isVehicle":"true"}'

Where :

- aa : exchange name
- bb : direct | fanout | topic | headers
- cc : routing key
- dd : any | all

### Queue

- npm run consumer process=queue queue=job
