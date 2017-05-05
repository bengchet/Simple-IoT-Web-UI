# Simple-IoT-Web-UI
Simple Web UI backbone for IoT projects 

## Requirement
 - MQTT is main component

## How to get started
Simply download the repo, double click `index.html` and enjoy!

## Configuration 
`userConfig.js` is the file where you configure your MQTT broker settings, add Google Map API Key, etc.

## Device payload
 - In order to show your IoT devices, each of your device must connect to same MQTT broker as in `userConfig.js` and deliver the **stringified** payload in JSON format below. Note that payload is up to 1 nested level, like GPS.
```
{
  id: your_device_id (decided by user)
  name: your_device_name (decided by user)
  ts : timestamp your device send the data (optional)
  payload: {
    temperature: ... ,
    humidity: ... ,
    GPS:{
      lat: ... ,
      lng: ... ,
    },
    ...
  }
}
```
 - for advanced users, you can deliver your payload in hexstring form, then setup javascript function in `userConfig.js` to convert the payload to the form shown as above.
 
## Web Application Deployment
It is possible to deploy this into public web application. You can use any platform and any server configuration. Here I prefer to use [ExpressJS](https://expressjs.com/), which is pretty easy to setup (I simply use ExpressJS generator, paste the content of this repo into public folder and deploy). And I deploy it to Heroku.

[Example Heroku Application Deploy](https://simple-iot-web-ui.herokuapp.com/)

Feel free to use it for your payload test. Below is the MQTT configuration for your devices.
```
  Broker: iothardware.cc
  Port: 1883/8883(SSL)/8083(SSL Websocket)
  Topic: bengchet/simple-iot-web-ui
```

## Feel free to make better!
This is just a backbone for creating a web UI for your IoT Project with MQTT. You are free to make it nicer. You can even post an issue or pull request here. Have fun!

## Todo:
 - added feature to show charts or graphs
 - apply dark theme
 - font-awesome icon for more interactive display
