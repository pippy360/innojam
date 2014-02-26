'use strict';

var fakeData = {
	routes : ['11','12','22','32','42'],
	buses : []
};

//global state
var state = {
	routeId : null, //valid, confirmed by the server
	routes : [], //list of routes as returned by the server

	stopId : null, //valid, confirmed by the server
	stops : [], //list of stops as returned by the server

	timeDelay : null
};

var hanaServer = "http://services.odata.org/V3/OData/OData.svc";

function makeGetUrl( resource, things ){
	var v = { '$format' : 'json' };
	for (fi in things) v[fi] = things[fi];
	var str = '/' + encodeURI(resource) + '?' + $.param(v);
	return str;
}

//entry point
$(document).ready(function(){
	//cache the list of bus routes
	$.ajax({
		url : hanaServer + makeGetUrl('Products', {}), //makeGetUrl('routeNumbers', {filter : text}),
		dataType : "json",
		success : function( data, textStatus, jqXHR){
			var values = data.value;
			for (var vi in values){
				var name = values[vi].Name;
				$("#route-input-list").append('<option value="' + name + '">');
			}
		}
	});
});

function onRouteEntryChanged(){
	var text = $("#routeId").value();
	if (text === '' || text.match(/'^\.d+\w?$'/)){ //number and maybe a lett
		//get route data
		
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