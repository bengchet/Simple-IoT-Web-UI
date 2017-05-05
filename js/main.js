var app = angular.module('myApp', ['angularMoment', 'ngMap', 'highcharts-ng','ui.bootstrap','angularPaho']);

app.controller('MainController', function($window, $scope, $http, $timeout, $interval, moment, MqttClient) {
	console.log('Get started!');

	// Devices allocation

	$scope.identifiers = [];
	$scope.devices = [];
	$scope.markers = [];
	$scope.connected = 0;
	var connectionTimeout = $scope.connectionTimeout | 60000; 

	var test;
     	var index = 0;
     	var checkID = function(array, ID){
     		var isTrue = false;
        	array.forEach(function(item){
			if(item.id === ID)
				isTrue = true;
		});
		return isTrue;
     	}
     	var updateConnectionStatus = function(){
       		var numberOfConnections = 0;
		numberOfConnections = $scope.identifiers.reduce(function(prevVal, item) {
    			if($scope.devices[item.id].connected)
		 		return prevVal + 1;
                	else
                 		return prevVal;
		}, 0);
		$scope.connected = numberOfConnections;
     	}

	var onMessageArrivedCb = function(msg){
		console.log("[INFO] [", msg.destinationName, "]", msg.payloadString);
		var data = JSON.parse(msg.payloadString);

		/* 
		 * There is simpler method using indexOf to trace the device ids
		 * but it will give difficulty of arranging the devices according to names
		 * Push json {id:data.id, name:data.name} to identifiers will simplify the work
		 * using this method ensures ascending order of devices name
                 */

		if (!checkID($scope.identifiers, data.id)) {
		      index++;
		      $scope.identifiers.push({id:data.id,name:data.name});
		      $scope.markers[data.id] = {
		           //url: 'img/lora' + index + '.png'
		      }
		}

		// This is simpler method if arranging device in order is not important
		/*
		if ($scope.identifiers.indexOf(data.id)) {
		      index++;
		      $scope.identifiers.push(data.id);
		      $scope.markers[data.id] = {
		           //url: 'img/lora' + index + '.png'
		      }
		}
		*/

		// update the timestamp if there isn't any
		if(!data.ts){
			data.ts = new Date().getTime();
		}

		data.convertedPayload = convertData(data.payload);
		$scope.devices[data.id] = data;

		// update the device connection status

		stopTest();

          	var currentTime = new Date().getTime();
          	$scope.identifiers.forEach(function(item) {
               		//console.log($scope.devices[item].id, currentTime - $scope.devices[item].ts)
               		$scope.devices[item.id].connected = (currentTime - $scope.devices[item.id].ts < connectionTimeout);
	       		updateConnectionStatus();
          	})

          	testConnection();
	};

	var stopTest = function(){
     	  if (angular.isDefined(test)) {
            $interval.cancel(test);
            test = undefined;
          }
     	}

     	var testConnection = function(){
          $interval(function(){
		var currentTime = new Date().getTime();
         	$scope.identifiers.forEach(function(item) {
               		$scope.devices[item.id].connected = (currentTime - $scope.devices[item.id].ts < connectionTimeout);
          	})
		updateConnectionStatus();

          }, 20000) 
     	}

     	test = testConnection();

	// utils
	// helper method to check if a field is a nested object
	$scope.is_object = function (something) {
    		return typeof (something) == 'object' ? true : false;
	};

	// search for config file, if not use the default settings here
	// Default MQTT Settings
	var config = {};
	console.log(configuration);

	if(!angular.isDefined(configuration)){
		config = {
			title: "Simple Sensor Monitoring System",
			author: "Ng Beng Chet",
			MQTTbroker: "mqtt.espert.io",
			MQTTport: "8000",
			MQTTssl: false,
			googleMapApiKey: null
		}
	}
	else
		config = configuration;

     	$scope.title = config.title;
        $scope.author = config.author;
	$scope.MQTTbroker = config.MQTTbroker;
	$scope.MQTTport = config.MQTTport;
	$scope.MQTTsubTopic = config.MQTTsubTopic ? config.MQTTsubTopic:(config.author+'/'+config.title+'/Monitor');

	var options = {
		useSSL: config.MQTTssl,
		onSuccess: successCallback,
		onFailure: function (message) {
			console.log("[ERROR] Connection failed, ERROR: " + message.errorMessage);
			//wait 5 seconds before trying to connect again.
			$timeout(reconnect, 5000);
		}
	};

	MqttClient.init($scope.MQTTbroker, $scope.MQTTport, "myclientid_" + parseInt(Math.random() * 100, 10));
	reconnect();

	function successCallback() {
	      console.log("[INFO] Connection successful!");
	      MqttClient.on($scope.MQTTsubTopic, {qos:1}, onMessageArrivedCb);
	      //MqttClient.subscribe($scope.MQTTsubTopic, {qos:1});
	      /*message = new Paho.MQTT.Message("Testing Mqtt Connection");
	      message.destinationName = "outTopic";
	      console.log("[INFO] Sending text as test");
	      MqttClient.send(message);*/
	}

	function reconnect(){
	      console.log("[INFO] Attempting MQTT connection...");
	      MqttClient.connect(options);
	}
        
	var onConnectionLostCb = function(resp){
	      console.log("[INFO] Connection lost with error code: ", resp);
	      $timeout(reconnect, 5000);
	}
	
	MqttClient.onConnectionLost(onConnectionLostCb);

	// testing disconnect function
	//$timeout(function(){MqttClient.disconnect()}, 10000);
	
	// give google map uri
	$scope.googleMapApiKey = function(){
		var uri = 'https://maps.google.com/maps/api/js';
		if(config.googleMapApiKey){
			uri = uri.concat('?key=').concat(config.googleMapApiKey);
		}	
		return uri;	
	}
	
});
