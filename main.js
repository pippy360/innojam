'use strict';

//odata query keywords
//http://msdn.microsoft.com/en-us/library/windowsazure/gg312156.aspx#SupportedODataFunctionality


//http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

//SELECT * FROM "SAP_DCODE"."sap.DCODE.data::DCODE.M_DUBLINBUSSTOPS" WHERE STOPID LIKE '6001';


//cache of all the routes
var routeNumberToTerminals = {};
var routeTerminalsToNumber = {};

//cache of closest stops
var closestStops = [];

//global state
var state = {
	routeId : null, //valid, confirmed by the server

	stopId : null, //valid, confirmed by the server
	stops : [], //list of stops as returned by the server

	timeDelay : null,

	geo : [53.294522,-6.426714] //here
};

//http://www.movable-type.co.uk/scripts/latlong.html
function distance(lat1, lon1, lat2, lon2){
	var m = Math.PI / 180;
	var R = 6371; // km
	var dLat = (lat2-lat1) * m;
	var dLon = (lon2-lon1) * m;
	var lat1 = lat1 * m;
	var lat2 = lat2 * m;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	return R * c;
}

function queryHanaServer( resource, args, onSuccess, onFail ){
	var full = { 'resource' : resource, '$format' : 'json' };
	for (var fi in args) full[fi] = args[fi];

	var str = "http://10.182.93.212/query.php"; //'http://54.84.210.109:8000/sap/dev1/dev1.xsodata/' + encodeURI(resource);
	if (full !== {}) str += '?' + $.param(full);

	$.ajax({
		url : str,
		dataType : "json",
		success : onSuccess,
		error : onFail
	});
}

//entry point
$(document).ready(function(){
	//timer
	CreateTimer("countdown-arrival", "countdown-to-leave", "alarm","turn-off", 10, 9);

	//cache the list of bus routes
	queryHanaServer( 'routes', {}, function(data, a, b){
		var values = data.d.results;
		for (var vi in values){
			var number = values[vi]["ROUTESHORTNAME"];
			var terminals = values[vi]["ROUTELONGNAME"];
			var terms = terminals.split(' - ');
			var reverseTerminals = terms[1] + ' - ' + terms[0];

			routeNumberToTerminals[number] = terminals;
			routeNumberToTerminals[terminals] = number;
			routeNumberToTerminals[reverseTerminals] = number;

			$("#route-input-list").append('<option value="' + number + ' | ' + terminals + '">');
			$("#route-input-list").append('<option value="' + terminals + ' | ' + number + '">');
			$("#route-input-list").append('<option value="' + reverseTerminals + ' | ' + number + '">');
		}
	}, function(thing, b, c){
		alert('fail');
	});

	//get the geolocation
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			state.geo = [position.coords.latitude, position.coords.longitude];
		});
	} 

	else {
  		//fake it
  		state.geo = [53.360387,-6.273408];
	}

	//get the stops around the user
	queryHanaServer( 'stops', 
		{'filter' : 'STOPLATITUDE lt ' + (state.geo[0] + 0.1) + ' and STOPLATITUDE gt ' + (state.geo[0] - 0.1) + 
	  ' STOPLONGITUADE lt ' + (state.geo[1] + 0.1) + ' and STOPLONGITUADE gt ' + (state.geo[1] - 0.1), '$top' : 30}, 
	  function(data){
		var stops = data.d.results;
		for (var si in stops){
			var v = { id : stops[si]['STOPID'], lat : stops[si]['STOPLATITUDE'], lon : stops[si]['STOPLONGITUADE'], name : stops[si]['STOPNAME'] };
			v.dist = distance(state.geo[0], state.geo[1], v.lat, v.lon);
			closestStops.push(v);
		}
		closestStops.sort(function(a, b){
			return a.dist - b.dist;
		});

		for (var vi in closestStops){
			var stop = closestStops[vi];
			$("#stop-input-list").append('<option value="' + stop.name + ', ' + stop.dist + 'm away">');
		}
	}, function(a, b, c){
		alert(b);
	});
});

function onRouteEntryChanged(){
	var text = $("#routeId").val();
	var match;
	var good = false;

	//user entered the number
	if ((match = text.match(/^\.d+\w?/)) != null){ //number and maybe a lett
		var number = match[0];
		//make sure the number is there
		var terms;
		if ((terms = routeNumberToTerminals[number]) != null){
			//route is valid
			good = true;
			status.routeId = number;
		}
	}

	else if ((match = text.match(/^(\w+.*) |/))){
		var number;
		if ((number = routeTerminalsToNumber[match[1]])){
			//valid once more
			good = true;
			status.routeId = number;
		}
	}

	$('#stop-input-error').text(error ? 'error' : 'good');
}

function onStopEntryChanged(){
	var text = $("#stop-input").val();

	if (text !== ''){
		//get all the stops that match this name
		queryHanaServer( 'stop_search', { 'partial' : text }, function(data){
			data = data.d.results;

		});
	}
}
/*
//gets route data from server
function getRouteData( callback ){
	$.ajax({
		url : hanaServer + makeGetUrl('routeNumbers', {filter : text}),

	});
}

//gets stop data from server
function getStopData( route ){
	return queryHanaServer( "table:drop;get:route" );
}

//gets buses data from server
function getBusesData( route, stop, time ){
	return queryHanaServer( "table:drop;get:time+route+stop" );
}



function upload(){

}


//turns the input query string into an "OData" url
function makeQuery( query ){
	//TODO:
	return query;
}

function printError( target, outputStr ){
	//use "con" or "console" to print to the console.log
	if ( target == "con" ||  target == "console") {
		console.log( outputStr );
		return;
	}

	$( target ).html( outputStr );
}
*/