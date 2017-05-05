var configuration = {
	"title": "Simple Sensor Monitoring System",
        "author": "Ng Beng Chet",
	"MQTTbroker":"broker.mqttdashboard.com",
	"MQTTssl":false,
	"MQTTport":"8000",
	"MQTTsubTopic":"bengchet/simple-iot-web-ui",
	/*"googleMapApiKey": Put your google map api key here */
};

// Payload processing 
var convertData = function(data) {
	// conversion can be done here
	// no convert, simply return data
	return data;
}

var hexToBytes = function(hex) {
	for (var bytes = [], c = 0; c < hex.length; c += 2)
		bytes.push(parseInt(hex.substr(c, 2), 16));
	return bytes;
}

