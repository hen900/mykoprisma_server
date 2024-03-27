
# Mykoprisma Node.js Server
This API documentation provides an overview of the endpoints and functionality of the mykoprisma server designed to interact with an ESP32 device in a mushroom monitoring and control system. The API allows for the exchange of measurement data, manual control of actuators, and setting of preset conditions.
The server application is built using Node.js and Express.js, and it uses MongoDB as the database for storing measurement data, override settings, and preset conditions. The API endpoints are designed to be accessed by the ESP32 device.

## Routes

The following routes are defined in the API:

- **POST `/setMeas`**: Uploads a new set of measurements and returns the current preset and override values merged together.
- **POST `/setOverride`**: Manually sets the status of the actuators.
- **POST `/setPhoto`**: Sets the photo capture override.
- **POST `/setPreset`**: Sets the new preset data in the database.
- **GET `/getPreset`**: Retrieves the current preset data from the database.
- **GET `/getMeas`**: Retrieves measurement data from the database based on specified query parameters.
- **GET `/getOverride`**: Retrieves the current override data from the database.

## Models

### Measurement Model

A measurement is posted using the `/setMeas` endpoint. In this exchange, humidity, CO2, temperature, actuator status, and other relevant data are sent in JSON format. After receiving the measurement data, the server responds with the current preset and override data merged together.
*The HIGH or LOW logic status of each actuator's control pin is also as a measurement.
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

- **POST `/setMeas`**: Uploads a new set of measurements and returns the current preset and override values merged together. The ESP exchanges its own measurements for commands from the server with this POST request. The response will have the following structure:

  ```json
  {
    "humidity": 60,
    "co2": 800,
    "temperature": 25,
    "actuator0Override": 2,
    "actuator1Override": 2,
    "actuator2Override": 2,
    "actuator3Override": 2,
    "actuator4Override": 1,
    "actuator5Override": 2,
    "photoOverride": 2
  }
  ```

  In this response, the preset values for humidity, CO2, and temperature are returned along with the override values for each actuator. The override values of 2 indicate that the preset should be used for those actuators, while the override value of 1 for actuator4 indicates that it has been manually set.

- **GET `/getMeas`**: Retrieves measurement data from the database based on specified query parameters, such as `from`, `to`, `limit`, and `page`.

### Override Model

An override is used to manually set the status of an actuator or to manually take pictures. It is a simple POST request wherein the locally stored set values are sent to the MongoDB server. The next time a measurement is posted, the server will respond with the updated override statuses.

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

- **POST `/setOverride`**: Manually sets the status of the actuators. They can be set individually or all together. For example, to manually turn on actuator 4, send a POST request to `/setOverride` with the following JSON payload:

  ```json
  {
    "actuator4Override": 1
  }
  ```

- **GET `/getOverride`**: Retrieves the current override data from the database.

### Photo Model

Photos are stored in an output directory /uploads with a timestamp.

### Photo Controller

- **POST `/setPhoto`**: Sets the photo capture override. To manually trigger a photo capture, send a POST request to `/setPhoto` with the following JSON payload:

  ```json
  {
    "photoOverride": 1
  }
  ```

  Setting `photoOverride` to 1 will trigger a photo capture every measurement cycle, while setting it to 0 will set it an upload at a predefined interval.

### Preset Model

A preset is a set of defined conditions including humidity, CO2 levels, and temperature. Once a preset is set, it is stored in the database and accessed by the ESP32. The ESP gets the preset values and makes decisions based on them unless an override is set.

The preset data is stored using the following schema:

```javascript
presetSchema = {
  humidity: Number,
  co2: Number,
  temperature: Number
}
```

### Preset Controller

- **POST `/setPreset`**: Sets the new preset data in the database. Humidity, CO2, and temperature should all be changed at the same time.

- **GET `/getPreset`**: Retrieves the current preset data from the database.

## Testing with ReqBin

To test the API using https://reqbin.com/, follow these steps:

1. Open https://reqbin.com/ in your web browser.

2. Set the HTTP method (GET or POST) based on the endpoint you want to test.

3. Enter the API URL in the following format: `http://mykoprisma.com:3603/endpoint`, where `/endpoint` is the desired endpoint (e.g., `/setMeas`, `/getMeas`, `/setOverride`, `/getOverride`, `/setPhoto`, `/setPreset`, `/getPreset`).

4. If sending a POST request, select the "Body" tab and enter the JSON payload in the provided text area.

5. Click the "Send" button to make the API request.

6. The response from the server will be displayed in the "Response" section, including the status code, headers, and body.

You can use ReqBin to test the various endpoints and verify the functionality of the API.
