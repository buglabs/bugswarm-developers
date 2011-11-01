// swarm stuff
var bugstatsSwarm = '0c966d48e16908975ae483642ed7302e7b6ec7d7';
var configurationKey = '53ebd64e50ed786ef13f3e64f0cdbdd6223013bc'
var participationKey = '7a849e6548dbd6f8034bb7cc1a37caa0b1a2654b';
var me = 'fd8d4b5c1113eb5ac8fb846ed4b58ed2db906d6c';

// global vars
var invalidResources = [me, "admin"]; //resources whose presence and message stanzas should not be handled
var memberResources = [];
var availableResources = [];
var resourceNameMap = {"1c85f72ef0a57fc2722540294e349343fccfd1c1": "BUG 1", "1f8757afbd3b814f85e1da02fe6ce1c802abb1a7": "BUG 2", "6a7166dd0f14cdca9b95f260cbee86129aac8991": "BUG 3", 
                       "29f7ba8c5fc61cbf3fc97f43d72b755c55073cfd": "BUG 4", "9cd5ee810ca0f8ed99114ef5e17afa854e3852ea": "BUG 5", "8969c03718274cbb62be0ab056b9d37c6471fe4a": "BUG 6",
                       "b1eb3f1c13b581a1f5b962e4d5378f10f06780dd": "BUG 7", "39525163ebef8bc83dc6fd891e7cea1e8fe21987": "BUG 8", "a540cd12f6e098cdde71404bab964a2302da2f23": "BUG 9",
                       "4588344415bc95e0edd00a51e33452ab70808878": "BUG 10"};
var aggregate = null;
var map = null;

// swarm management
getSwarmInfo = function() {
    getSwarmInfoCORS('http://api.bugswarm.net/swarms/' + bugstatsSwarm, configurationKey, function(data){populateSwarmInfo(data)});
}

getMembers = function() {
    listSwarmResourcesCORS('http://api.bugswarm.net/swarms/' + bugstatsSwarm + '/resources', configurationKey, function(data){populateMemberResources(data)});
};

getSwarmInfoCORS = function(url, key, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        headers: {'x-bugswarmapikey': key},
        success: callback
    });
}

listSwarmResourcesCORS = function(url, key, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        headers: {'x-bugswarmapikey': key},
        success: callback
    });
};

populateSwarmInfo = function(data) {
    console.log(JSON.stringify(data));
    name = data.name;
    owner = data.user_id;
    if (data.public == true) {
        access = "Public";
    } else {
        access = "Private";
    }

    $("#swarm-info").append('<div class=row><div class="span-one-third"><strong class="swarm-info-head">Name: </strong><span class="swarm-info-content">' + name + '</span></div><div class="span-one-third"><strong class="swarm-info-head">Owner: </strong><span class="swarm-info-content">' + owner + '</span></div><div class="span-one-third"><strong class="swarm-info-head">Access: </strong><span class="swarm-info-content">' + access + '</span></div></div>');
}

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
        var $disconnectedResourceDiv = $('<div class="bugstats-resource disconnected" id="' + toAppend + '-disconnected"><h4>Resource: ' + toAppendName + '</h4><h5 class="dc-head">Disconnected...</h5><div class="page-header"></div></div>');
        $("#resources-list").append($disconnectedResourceDiv);
    }  
};

getSwarmInfo();
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
                $("#get-immediate-stats").replaceWith('<input class="btn danger disabled" disabled="disabled" id="get-immediate-stats" type="button" value="Update All" onclick="javascript: getImmediateStats()">');
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
        $("#get-immediate-stats").replaceWith('<input class="btn danger" id="get-immediate-stats" type="button" value="Update All" onclick="javascript: getImmediateStats()">');
    }
};

disconnectedResource = function(toRemove) {
    if (hasName(toRemove)) {
        toRemoveName = getName(toRemove);
    } else {
        toRemoveName = toRemove.slice(0, 24) + '...';
    }
    var $disconnectedResourceDiv = $('<div class="bugstats-resource disconnected" id="' + toRemove + '-disconnected"><h4>Resource: ' + toRemoveName + '</h4><h5 class="dc-head">Disconnected...</h5><div class="page-header"></div></div>');
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

    if (hasName(toAppend)) {
        markerResource = getName(toAppend);
    } else {
        markerResource = toAppend.slice(0,24) + '...';
    }
    
    contentString = 'Resource: ' + markerResource; 
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
    while (currentUsrArray.length >= 5) {
        currentUsrArray.splice(0, 1);
    }

    toPush = {"data": data, "status": status};
    currentUsrArray.push(toPush);
    console.log("Last 5 Usr Logs: " + currentUsrArray);

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
    while (currentNiceArray.length >= 5) {
        currentNiceArray.splice(0, 1);
    }
    
    toPush = {"data": data, "status": status};
    currentNiceArray.push(toPush);
    console.log("Last 5 Nice Logs: " + currentNiceArray);

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
    while (currentSysArray.length >= 5) {
        currentSysArray.splice(0, 1);
    }
    
    toPush = {"data": data, "status": status};
    currentSysArray.push(toPush);
    console.log("Last 5 Sys Logs: " + currentSysArray);

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
    while (currentDatetimeArray.length >= 5) {
        currentDatetimeArray.splice(0, 1);
    }
    
    toPush = {"data": data, "status": status};
    currentDatetimeArray.push(toPush);
    console.log("Last 5 Datetime Logs: " + currentDatetimeArray);

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
    var myLatLng = new google.maps.LatLng(40.73, -73.99);
    var mapOptions = {
        zoom: 8,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
};