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

//global state
var state = {
	routeId : null, //valid, confirmed by the server

	stopId : null, //valid, confirmed by the server
	stops : [], //list of stops as returned by the server

	timeDelay : null
};

function queryHanaServer( resource, args, onSuccess, onFail ){
	var full = { 'resource' : resource, '$format' : 'json' };
	for (fi in args) full[fi] = args[fi];

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
	//cache the list of bus routes
	queryHanaServer( 'routes', {}, function(data, a, b){
		var values = data;//.value;
		for (var vi in values){
			var number = values[vi]["route_short_name"];
			var terminals = values[vi]["router_long_name"];
			var terms = terminals.split(' - ');
			var reverseTerminals = terms[1] + ' - ' + terms[0];

			routeNumberToTerminals[number] = terminals;
			routeNumberToTerminals[terminals] = number;
			routeNumberToTerminals[reverseTerminals] = number;

			$("#route-input-list").append('<option value="' + number + ' | ' + terminals + '">');
			$("#route-input-list").append('<option value="' + terminals + ' | ' + number + '">');
			$("#route-input-list").append('<option value="' + reverseTerminals + ' | ' + number + '">');
		}
	}, function(thing){
		alert('fail');
	});
});

function onRouteEntryChanged(){
	var text = $("#routeId").val();
	var match;
	var good = false;;

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