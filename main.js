var fakeData = {
	routes : ['11','12','22','32','42'],
	buses : []
};

var state = {
	routeId : null,
	stopId : null,
	timeDelay : null
};

function validateNumber(text){
	//something
	{
		return parsedNumberer;
	}
	else return null; //if invalid
}

function makeGetUrl(resource, things){
	return '/' + JSON.stringify(resource) + '?' + JSON.stringify(things);
}

function onRouteEntryChanged(){
	var text = $("#routeId").value();
	if (text.match(/'^\.d+\w?$'/)){ //number and maybe a lett
		$.ajax({
			url : hanaServer + makeGetUrl('routeNumbers', {filter : text}),
			
			
		});
	}
}

//gets route data from server
function getRouteData(){
	return queryHanaServer( {table:'drop', get:'route'} );
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