'use strict';

//odata query keywords
//http://msdn.microsoft.com/en-us/library/windowsazure/gg312156.aspx#SupportedODataFunctionality

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

var hanaServer = "http://10.182.93.212/"; //http://services.odata.org/V3/OData/OData.svc";

function makeGetUrl( resource, things ){
	var v = {};// '$format' : 'json' };
	for (fi in things) v[fi] = things[fi];

	var str = hanaServer + '/' + encodeURI(resource);
	if (v !== {}) str += '?' + $.param(v);
	return str;
}

//entry point
$(document).ready(function(){
	//cache the list of bus routes
	$.ajax({
		url : makeGetUrl('routes', {}),
		dataType : "json",
		success : function( data, textStatus, jqXHR){
			var values = data;//.value;
			for (var vi in values){
				var number = values[vi]["route_short_name"];
				var terminals = values[vi]["router_long_name"];
				var terms = terminals.split(' - ');
				var reverseTerminals = terms[1] + ' - ' + terms[0];

				routeNumberToTerminals[number] = terminals;
				routeNumberToTerminals[terminals] = number;
				routeNumberToTerminals[reverseTerminals] = number;

				$("#route-input-list").append('<option value="' + number + '">');
				$("#route-input-list").append('<option value="' + terminals + '">');
				$("#route-input-list").append('<option value="' + reverseTerminals + '">');
			}
		}
	});
});

function stopsAutocomplete(text, callback){
	//ajax stuff when hana works

}

function onRouteEntryChanged(){
	var text = $("#routeId").val();
	if (text === '' || text.match(/'^\.d+\w?$'/)){ //number and maybe a lett
		//get route data
		
	}
}

function onStopEntryChanged(){
	var text = $("#stop-input").val();

	if (text !== ''){
		//get all the stops that match this name

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

function queryHanaServer( query ){
	var urlQuery = makeQuery( query );
	$.ajax("something.com/query");
	ajax.onComplete( function (){ 
		
	});
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