# API Documentation

This API documentation provides an overview of the endpoints and functionality of  the mykoprisma server designed to interact with an ESP32 device in a mushroom monitoring and control system. The API allows for the exchange of measurement data, manual control of actuators, and setting of preset conditions.
The server application is built using Node.js and Express.js, and it uses MongoDB as the database for storing measurement data, override settings, and preset conditions. The API endpoints are designed to be accessed by the ESP32 device .


## Models

### Measurement Model

A measurement is posted using the `/meas` endpoint. In this exchange, humidity, CO2, temperature, actuator status, and other relevant data are sent in JSON format. After receiving the measurement data, the server responds with commands specifying the desired status of each actuator based on the locally stored file `outbox.json`. In most cases, there is no ordered change in actuator status, so the status of each actuator matches the set value.

The measurement data is stored in a locally hosted MongoDB server using the following schema:

```javascript
measSchema = {
  humidity: Number,
  co2: Number,
  temperature: Number,
  timestamp: Number,
  waterLevel: Number,
  actuator0Status: Boolean,
  actuator1Status: Boolean,
  actuator2Status: Boolean,
  actuator3Status: Boolean,
  actuator4Status: Boolean,
  actuator5Status: Boolean
}
```

### Measurement Controller

- **POST `/setMeas`**: Uploads a new set of measurements and returns the current preset values and overrides. The ESP exchanges its own measurements for commands from the server with this POST request.

- **GET `/getMeas`**: Returns raw measurement JSON data from the database.

### Override Model

An override is used to manually set the status of an actuator or to manually take pictures. It is a simple POST request wherein the locally stored set values are sent to the MongoDB server. The next time a measurement is posted, the server will respond with the updated statuses set by the `/override` endpoint.

The override data is stored using the following schema:

```javascript
manualOverrideSchema = {
  actuator0Override: Integer,
  actuator1Override: Integer,
  actuator2Override: Integer,
  actuator3Override: Integer,
  actuator4Override: Integer,
  actuator5Override: Integer,
  photoOverride: Integer
}
```

### Override Controller

- **POST `/setOverride`**: Manually set the status of the actuators. They can be set individually or all together. For example, to manually turn on actuator 4, send a POST request to `/setOverride` with the following JSON payload:

  ```json
  {
    "actuator4Override": 1
  }
  ```

  Now, when the ESP polls the server and gets its commands with `/getMeas`, the response will be:

  ```json
  {
    "humidity": 100,
    "co2": 100,
    "temperature": 100,
    "actuator1Override": 2,
    "actuator0Override": 2,
    "actuator2Override": 2,
    "actuator3Override": 2,
    "actuator4Override": 1,
    "actuator5Override": 2,
    "photoOverride": 2
  }
  ```

  In this response, all the overrides set to 2 will be ignored, while actuator4Override has been individually set by the earlier POST request.

### Preset Model

A preset is a set of defined conditions including humidity, CO2 levels, and temperature. Once a preset is set, it is stored in a data buffer which is accessed by the ESP32. The ESP gets the values and makes decisions based on the preset unless an override is set. The preset GET response is also accompanied by the values of the buffer from the override function. When an actuator's override value is set to '2', it is ignored by the ESP, and the preset is used. If the override value for any of the actuators is set to either 1 or 0, the ESP will manually set the value of that actuator regardless of the preset values.

The preset data is stored using the following schema:

```javascript
presetSchema = {
  humidity: Number,
  co2: Number,
  temperature: Number
}
```

### Preset Controller

- **POST `/changePreset`**: Changes the preset. Humidity, CO2, and temperature should all be changed at the same time.

- **GET `/getPreset`**: Returns the presets that are set and the override buffer.

## Testing with ReqBin

To test the API using https://reqbin.com/, follow these steps:

1. Open https://reqbin.com/ in your web browser.

2. Set the HTTP method (GET or POST) based on the endpoint you want to test.

3. Enter the API URL in the following format: `http://localhost:3603/endpoint`, where `/endpoint` is the desired endpoint (e.g., `/setMeas`, `/getMeas`, `/setOverride`, `/changePreset`, `/getPreset`).

4. If sending a POST request, select the "Body" tab and enter the JSON payload in the provided text area.

5. Click the "Send" button to make the API request.

6. The response from the server will be displayed in the "Response" section, including the status code, headers, and body.

You can use ReqBin to test the various endpoints and verify the functionality of the API.