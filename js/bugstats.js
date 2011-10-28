// swarm stuff
var bugstatsSwarm = '83537f005a15bc5f65935997ef858461c8f86608';
var configurationKey = 'b92464a8d6d803ed881f4dee8a0d5b45bf20f0f1'
var participationKey = 'a35c8276f241a967d8bdf59a07d4b5d522447b17';
var me = "1671ae80f13f60ca93a757b764d3fdceaf6cc9d4";

// global vars
var invalidResources = [me, "admin"]; //resources whose presence and message stanzas should not be handled
var memberResources = [];
var availableResources = [];
var resourceNameMap = {"7ebaf88e69998588f961c2aaf9950e8f1409371a": "Freebie 1", "a3992d35a9dc8f841dbc45e809d5c5b892d8e6d6": "Freebie 2"};
var aggregate = null;
var map = null;

// swarm management
getMembers = function() {
    membersCORS('http://api.bugswarm.net/swarms/' + bugstatsSwarm + '/resources', configurationKey, function(data){populateMemberResources(data)});
};

membersCORS = function(url, key, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        headers: {'x-bugswarmapikey': key},
        success: callback
    });
};

populateMemberResources = function(data) {
    for (var i=0; i < data.length; i++) {
        if ((data[i].resource_type) == "producer" && (!isInvalid(data[i].resource_id))) {
            resource = data[i].resource_id;
            console.log("Producer Member: " + resource);
            memberResources.push(resource);
        }
    }
    console.log("Member Resources: " + memberResources);
    appendMembers();
};

appendMembers = function() {
    for (var i=0; i < memberResources.length; i++) {
        toAppend = memberResources[i];
        if (hasName(toAppend)) {
            toAppendName = getName(toAppend);
        } else {
            toAppendName = toAppend.slice(0, 24) + '...';
        }
        var $disconnectedResourceDiv = $('<div class="bugstats-resource disconnected" id="' + toAppend + '-disconnected"><h4>Resource: ' + toAppendName + '</h4><h5>Disconnected...</h5><div class="page-header"></div></div>');
        $("#resources-list").append($disconnectedResourceDiv);
    }  
};

getMembers();

// main (connect to swarm and event callbacks)
SWARM.connect({apikey: participationKey,
               resource: me,
               swarms: [bugstatsSwarm],
               onmessage: function() {},
               onpresence: function() {},
               onerror: function() {},

               // callbacks
               onconnect:
                   function onConnect() {
                       console.log('I have connected to swarm ' + bugstatsSwarm + '!');                       
                   },
               onpresence:
                   function onPresence(presence) {
                       presenceObj = JSON.parse(presence);
                       
                       // exit if not swarm presence
                       if (!isSwarmPresence(presenceObj)) {
                           return;
                       }

                       presenceResource = presenceObj.presence.from.resource;

                       // exit if invalid resource
                       if (isInvalid(presenceResource)) {
                           return;
                       }
                           
                       status = presenceObj.presence.type;
                           
                       // presence unavailable received
                       if (status && (status == "unavailable")) {
                           presenceUnavailable(presenceResource);                          
                           
                       // presence available received
                       } else {
                           presenceAvailable(presenceResource);                               
                       }
                       
                       console.log("Available Resources:");
                       console.log(availableResources);
                       console.log("");
                   },
               onmessage:
                   function onMessage(message) {
                       messageObj = JSON.parse(message);                      
                     
                       // exit if not swarm message
                       if (!isSwarmMessage(messageObj)) {
                           return;
                       }
                       
                       producer = messageObj.message.from.resource;                       

                       // exit if invalid resource
                       if (isInvalid(producer)) {
                           return;
                       }

                       data = messageObj.message.payload;                                          
                       
                       // stats message received
                       if (isStatsMessage(data)) {
                           statsMessage(producer, data);
                       }
                   }
              });

// presence handling
presenceUnavailable = function(presenceResource) {
    console.log("");
    console.log("Presence unavailable message received.");    

    for (var i=0; i < availableResources.length; i++) {
        if (availableResources[i] == presenceResource) {
            availableResources.splice(i, 1);
            console.log("Resource " + presenceResource + " removed.");

            // DOM
            disconnectedResource(presenceResource);                                    

            // remove controls if no resources left            
            if (availableResources.length <= 0) {
                $("#get-immediate-stats").replaceWith('<input class="btn primary disabled" disabled="disabled" id="get-immediate-stats" type="button" value="Update All" onclick="javascript: getImmediateStats()">');
            }            
        } 
    }
};

presenceAvailable = function(presenceResource) {
    console.log("");
    console.log("Presence available message received.");
    
    if (alreadyAvailable(presenceResource)) {
        console.log("Sender is already available. Not handling.");
        return;
    }    
    
    availableResources.push(presenceResource);
    console.log("Resource " + presenceResource + " added.");
    
    // DOM
    connectedResource(presenceResource);        

    // add controls if only one resource
    if (availableResources.length == 1) {
        $("#get-immediate-stats").replaceWith('<input class="btn primary" id="get-immediate-stats" type="button" value="Update All" onclick="javascript: getImmediateStats()">');
    }
};

disconnectedResource = function(toRemove) {
    if (hasName(toRemove)) {
        toRemoveName = getName(toRemove);
    } else {
        toRemoveName = toRemove.slice(0, 24) + '...';
    }
    var $disconnectedResourceDiv = $('<div class="bugstats-resource disconnected" id="' + toRemove + '-disconnected"><h4>Resource: ' + toRemoveName + '</h4><h5>Disconnected...</h5><div class="page-header"></div></div>');
    $("#" + toRemove).replaceWith($disconnectedResourceDiv);

    window[toRemove + '_usr_array'] = null;
    window[toRemove + '_nice_array'] = null;
    window[toRemove + '_sys_array'] = null;
    window[toRemove + '_datetime_array'] = null;

    
    window[toRemove + '_marker'].setMap(null);

    window[toRemove + '_color'] = null;
    window[toRemove + '_latitude'] = null;
    window[toRemove + '_longitude'] = null;
    window[toRemove + '_latlng'] = null;
    window[toRemove + '_marker'] = null;
    window[toRemove + '_infowindow'] = null;
};

connectedResource = function(toAppend) {
    if (hasName(toAppend)) {
        toAppendName = getName(toAppend);
    } else {
        toAppendName = toAppend.slice(0, 24) + '...';
    }
    var $connectedResourceDiv = $('<div class="bugstats-resource" id="' + toAppend + '"><h4>Resource: ' + toAppendName + '</h4><strong>Location: </strong><span id="' + toAppend + '-location">Pending</span><div class="row"><div class="span-smallstats"><h5>User %</h5><ul class="unstyled" id="' + toAppend + '-usr"><li class="data">Pending</li></ul></div><div class="span-smallstats"><h5>Nice %</h5><ul class="unstyled" id="' + toAppend + '-nice"><li class="data">Pending</li></ul></div><div class="span-smallstats"><h5>System %</h5><ul class="unstyled" id="' + toAppend + '-sys"><li class="data">Pending</li></ul></div><div class="span-datetime"><h5>Datetime</h5><ul class="unstyled" id="' + toAppend + '-datetime"><li class="data">Pending</li></ul></div></div><div class="page-header"></div></div>');
    
    $("#" + toAppend + "-disconnected").replaceWith($connectedResourceDiv);

    window[toAppend + '_usr_array'] = [];
    window[toAppend + '_nice_array'] = [];
    window[toAppend + '_sys_array'] = [];
    window[toAppend + '_datetime_array'] = [];
    
    window[toAppend + '_color'] = true;
    window[toAppend + '_latitude'] = null;
    window[toAppend + '_longitude'] = null;
    window[toAppend + '_latlng'] = new google.maps.LatLng(0,0);
    window[toAppend + '_marker'] = new google.maps.Marker({position: window[toAppend + '_latlng'], map: null, title: toAppend});
    
    contentString = 'Resource: ' + toAppend.slice(0,24) + '...'; 
    window[toAppend + '_infowindow'] = new google.maps.InfoWindow({content: contentString});
    google.maps.event.addListener(window[toAppend + '_marker'], 'click', function() {
        window[toAppend + '_infowindow'].open(map, window[toAppend + '_marker']);
    });
};

// message handling
statsMessage = function(producer, data) {
    latitude = data.position.lat;
    longitude = data.position.lon;
    usr = parseFloat(data.usr);
    nice = parseFloat(data.nice);
    sys = parseFloat(data.sys);                           
    datetime = data.datetime;
    isImmediate = data.immediate;
    
    console.log("");
    console.log("Stats for resource " + producer + ":");
    console.log("  Latitude: " + latitude);
    console.log("  Longitude: " + longitude);
    console.log("  User Percentage: " + usr);
    console.log("  Nice Percentage: " + nice);
    console.log("  System Percentage: " + sys);
    console.log("  Datetime: " + datetime);
    console.log("  isImmediate: " + isImmediate);
    
    if (isImmediate) {
        status = "immediate";
    } else if (window[producer + '_color'] == true) {
        status = "even";
        window[producer + '_color'] = !window[producer + '_color'];
    } else {
        status = "odd";
        window[producer + '_color'] = !window[producer + '_color'];
    }

    updateProducer(producer, latitude, longitude, usr, nice, sys, datetime, status);
    updateAggregate(usr, nice, sys, datetime);    
};

updateProducer = function(producer, latitude, longitude, usr, nice, sys, datetime, status) {
    updateLocation(producer, latitude, longitude);
    var $usrLogReplace = $(updateUsrLog(producer, usr, status));
    var $niceLogReplace = $(updateNiceLog(producer, nice, status));
    var $sysLogReplace = $(updateSysLog(producer, sys, status));
    var $datetimeLogReplace = $(updateDatetimeLog(producer, datetime, status));
    $("#" + producer + "-usr").replaceWith($usrLogReplace);
    $("#" + producer + "-nice").replaceWith($niceLogReplace);
    $("#" + producer + "-sys").replaceWith($sysLogReplace);
    $("#" + producer + "-datetime").replaceWith($datetimeLogReplace);
};

updateAggregate = function(usr, nice, sys, datetime) {
    if (!aggregate) {
        aggregate = {"usr":usr, "total_usr":usr, "nice":nice, "total_nice":nice, "sys":sys, "total_sys":sys, "count":1};
    } else {
        aggregate.count++;

        aggregate.total_usr += usr;
        aggregate.total_nice += nice;
        aggregate.total_sys += sys;

        aggregate.usr = aggregate.total_usr/aggregate.count;
        aggregate.nice = aggregate.total_nice/aggregate.count;
        aggregate.sys = aggregate.total_sys/aggregate.count;
    }
    
    $("#aggregate-usr").replaceWith('<li class="aggregate-data" id="aggregate-usr">' + aggregate.usr.toPrecision(5) + '</li>');
    $("#aggregate-nice").replaceWith('<li class="aggregate-data" id="aggregate-nice">' + aggregate.nice.toPrecision(5) + '</li>');
    $("#aggregate-sys").replaceWith('<li class="aggregate-data" id="aggregate-sys">' + aggregate.sys.toPrecision(5) + '</li>');
    $("#aggregate-datetime").replaceWith('<li class="aggregate-data" id="aggregate-datetime">' + datetime.slice(0,19) + '</li>');
};

updateLocation = function(producer, latitude, longitude) {
    if (!positionChanged(producer, latitude, longitude)) {
        return;
    }
    var $locationReplace = '<span id="' + producer + '-location">' + latitude + ' , ' + longitude + '</span>';
    $("#" + producer + "-location").replaceWith($locationReplace);
    window[producer + '_latlng'] = new google.maps.LatLng(latitude, longitude);
    window[producer + '_marker'].setPosition(window[producer + '_latlng']);
    window[producer + '_marker'].setMap(map);
};

updateUsrLog = function(producer, data, status) {
    currentUsrArray = window[producer + '_usr_array'];
    while (currentUsrArray.length >= 10) {
        currentUsrArray.splice(0, 1);
    }

    toPush = {"data": data, "status": status};
    currentUsrArray.push(toPush);
    console.log("Last 10 Usr Logs: " + currentUsrArray);

    usrLogHTML = '<ul class="unstyled" id="' + producer + '-usr">';
    
    for (var i=1; i < currentUsrArray.length+1; i++) {
        content = currentUsrArray[currentUsrArray.length - i];
        usrLogHTML = usrLogHTML + '<li class="data ' + content.status + '">' + content.data.toPrecision(5) + '</li>';    
    }

    usrLogHTML = usrLogHTML + '</ul>';
    return usrLogHTML;
};

updateNiceLog = function(producer, data, status) {
    currentNiceArray = window[producer + '_nice_array'];
    while (currentNiceArray.length >= 10) {
        currentNiceArray.splice(0, 1);
    }
    
    toPush = {"data": data, "status": status};
    currentNiceArray.push(toPush);
    console.log("Last 10 Nice Logs: " + currentNiceArray);

    niceLogHTML = '<ul class="unstyled" id="' + producer + '-nice">';
    
    for (var i=1; i < currentNiceArray.length+1; i++) {
        content = currentNiceArray[currentNiceArray.length - i];
        niceLogHTML = niceLogHTML + '<li class="data ' + content.status + '">' + content.data.toPrecision(5) + '</li>';    
    }

    niceLogHTML = niceLogHTML + '</ul>';
    return niceLogHTML;
};

updateSysLog = function(producer, data) {
    currentSysArray = window[producer + '_sys_array'];
    while (currentSysArray.length >= 10) {
        currentSysArray.splice(0, 1);
    }
    
    toPush = {"data": data, "status": status};
    currentSysArray.push(toPush);
    console.log("Last 10 Sys Logs: " + currentSysArray);

    sysLogHTML = '<ul class="unstyled" id="' + producer + '-sys">';
    
    for (var i=1; i < currentSysArray.length+1; i++) {
        content = currentSysArray[currentSysArray.length - i];
        sysLogHTML = sysLogHTML + '<li class="data ' + content.status + '">' + content.data.toPrecision(5) + '</li>';    
    }

    sysLogHTML = sysLogHTML + '</ul>';
    return sysLogHTML;   
};

updateDatetimeLog = function(producer, data) {
    currentDatetimeArray = window[producer + '_datetime_array'];
    while (currentDatetimeArray.length >= 10) {
        currentDatetimeArray.splice(0, 1);
    }
    
    toPush = {"data": data, "status": status};
    currentDatetimeArray.push(toPush);
    console.log("Last 10 Datetime Logs: " + currentDatetimeArray);

    datetimeLogHTML = '<ul class="unstyled" id="' + producer + '-datetime">';
    
    for (var i=1; i < currentDatetimeArray.length+1; i++) {
        content = currentDatetimeArray[currentDatetimeArray.length - i];
        datetimeLogHTML = datetimeLogHTML + '<li class="data ' + content.status + '">' + content.data.slice(0,19) + '</li>';    
    }

    datetimeLogHTML = datetimeLogHTML + '</ul>';
    return datetimeLogHTML;   
};

// conditionals
isSwarmPresence = function(presenceObj) {
    if (presenceObj.presence.from.swarm) {
        return true;
    } else {
        return false;
    }    
};

isSwarmMessage = function(messageObj) {
    if (messageObj.message.from.swarm) {
        return true;
    } else {
        return false;
    }
};

isInvalid = function(resource) {
    for (var i=0; i < invalidResources.length; i++) {
        if (resource == invalidResources[i]) {
            return true
        }
    }
    return false;
};

isStatsMessage = function(data) {
    if (data.sys) {
        return true;
    } else {
        return false;
    }
}; 

alreadyAvailable = function(resource) {
    for (var i=0; i < availableResources.length; i++) {
        if (availableResources[i] == presenceResource) {
            return true;
            console.log("Resource already exists in table. Not adding.");
        }
    }
    return false;
};

hasName = function(resource) {
    for (var i in resourceNameMap) {
        if (i == resource) {
            return true;
        }
    }
    return false;
};

positionChanged = function(resource, latitude, longitude) {
    if ((latitude != window[resource + '_latitude']) || (longitude != widnow[resource + '_longitude'])) {
        return true;
    } else {
        return false;
    }
};


// get/set
getName = function(resource) {
    for (var i in resourceNameMap) {
        if (i == resource) {
            return resourceNameMap[i];
        }
    }
};

// UI functions
getImmediateStats = function() {
    console.log("Requesting stats from all resources.");
    SWARM.send("stats");
};

// map
mapInitialize = function() {    
    var myLatLng = new google.maps.LatLng(39, -95);
    var mapOptions = {
        zoom: 8,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
};