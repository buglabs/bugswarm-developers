// global vars
var me = "1671ae80f13f60ca93a757b764d3fdceaf6cc9d4";
var availableResources = [];
var bugstatsSwarm = '83537f005a15bc5f65935997ef858461c8f86608';
var firstResource = false;
var aggregate = null;

// main 
SWARM.connect({apikey: 'a35c8276f241a967d8bdf59a07d4b5d522447b17',
               resource: '1671ae80f13f60ca93a757b764d3fdceaf6cc9d4',
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
                       if (presenceObj.presence.from.swarm) {
                           presenceResource = presenceObj.presence.from.resource;
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
                       }                                                                     
                   },
               onmessage:
                   function onMessage(message) {
                       var usr;
                       var nice;
                       var sys;
                       messageObj = JSON.parse(message);                      
                       if (!messageObj.message.from.swarm) {
                           return;
                       }
                       producer = messageObj.message.from.resource;                       
                       data = messageObj.message.payload;                                          
                       
                       // stats message received
                       if (data.sys) {
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
            removeResource(presenceResource);
            
            // remove controls if no resources left
            if (!bugsConnected()) {
                $("#get-immediate-stats").remove();                
                firstResource = false;
            }
        }
    }
};

presenceAvailable = function(presenceResource) {
    console.log("");
    console.log("Presence available message received.");
    var alreadyAvailable = false;
    for (var i=0; i < availableResources.length; i++) {
        if (availableResources[i] == presenceResource) {
            alreadyAvailable = true;
            console.log("Resource already exists in table. Not adding.");
        }
    }
    if (!alreadyAvailable) {
        availableResources.push(presenceResource);
        console.log("Resource " + presenceResource + " added.");
        // DOM
        appendResource(presenceResource);
        
        // create controls if first resource
        if (!firstResource) {
            if (oneBugConnected()) {
                $("#controls").append('<input id="get-immediate-stats" class="btn primary" type="button" value="Get Immediate Stats" onclick="javascript: getImmediateStats()">');                
            }
            firstResource = true;
        }
    }    
};

removeResource = function(toRemove) {
    $("#" + toRemove).remove();

    window[toRemove + '_usr_array'] = null;
    window[toRemove + '_nice_array'] = null;
    window[toRemove + '_sys_array'] = null;
    window[toRemove + '_datetime_array'] = null;
};

appendResource = function(toAppend) {
    // ensure you are not appending a browser instance
    if ((toAppend == me) || (toAppend == "admin")) {
        return;
    }
    
    var $resourceDiv = $('<div class="bugstats-resource" id="' + toAppend + '"><br><h2>Resource: ' + toAppend + '</h2><div class="row"><div class="span-smallstats"><h3>User %</h3><ul class="unstyled" id="' + toAppend + '-usr"><li class="data">Data pending...</li></ul></div><div class="span-smallstats"><h3>Nice %</h3><ul class="unstyled" id="' + toAppend + '-nice"><li class="data">Data pending...</li></ul></div><div class="span-smallstats"><h3>System %</h3><ul class="unstyled" id="' + toAppend + '-sys"><li class="data">Data pending...</li></ul></div><div class="span-datetime"><h3>Datetime</h3><ul class="unstyled" id="' + toAppend + '-datetime"><li class="data">Dada pending...</li></ul></div></div><div class="page-header"></div></div>');
    $("#resources").append($resourceDiv);

    window[toAppend + '_usr_array'] = [];
    window[toAppend + '_nice_array'] = [];
    window[toAppend + '_sys_array'] = [];
    window[toAppend + '_datetime_array'] = [];
};

// message handling
statsMessage = function(producer, data) {
    usr = parseFloat(data.usr);
    nice = parseFloat(data.nice);
    sys = parseFloat(data.sys);                           
    datetime = data.datetime;
    
    console.log("");
    console.log("Stats for resource " + producer + ":");
    console.log("  User Percentage: " + usr);
    console.log("  Nice Percentage: " + nice);
    console.log("  System Percentage: " + sys);
    console.log("  Datetime: " + datetime);
    
    updateProducer(producer, usr, nice, sys, datetime);
    updateAggregate(usr, nice, sys, datetime);    
};

updateProducer = function(producer, usr, nice, sys, datetime) {
    var $usrLogReplace = $(updateUsrLog(producer, usr));
    var $niceLogReplace = $(updateNiceLog(producer, nice));
    var $sysLogReplace = $(updateSysLog(producer, sys));
    var $datetimeLogReplace = $(updateDatetimeLog(producer, datetime));
    $("#" + producer + "-usr").replaceWith($usrLogReplace);
    $("#" + producer + "-nice").replaceWith($niceLogReplace);
    $("#" + producer + "-sys").replaceWith($sysLogReplace);
    $("#" + producer + "-datetime").replaceWith($datetimeLogReplace);
}

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
    
    $("#aggregate-usr").replaceWith('<li class="data" id="aggregate-usr">' + aggregate.usr + '</li>');
    $("#aggregate-nice").replaceWith('<li class="data" id="aggregate-nice">' + aggregate.nice + '</li>');
    $("#aggregate-sys").replaceWith('<li class="data" id="aggregate-sys">' + aggregate.sys + '</li>');
    $("#aggregate-datetime").replaceWith('<li class="data" id="aggregate-datetime">' + datetime + '</li>');
}

updateUsrLog = function(producer, data) {
    currentUsrArray = window[producer + '_usr_array'];
    while (currentUsrArray.length >= 10) {
        currentUsrArray.splice(0, 1);
    }
    currentUsrArray.push(data);
    console.log("Last 10 Usr Logs: " + currentUsrArray);

    usrLogHTML = '<ul class="unstyled" id="' + producer + '-usr">'
    for (var i=1; i < currentUsrArray.length+1; i++) {
        usrLogHTML = usrLogHTML + '<li class="data">' + currentUsrArray[currentUsrArray.length - i] + '</li>';
    }
    usrLogHTML = usrLogHTML + '</ul>';
    return usrLogHTML;
};

updateNiceLog = function(producer, data) {
    currentNiceArray = window[producer + '_nice_array'];
    while (currentNiceArray.length >= 10) {
        currentNiceArray.splice(0, 1);
    }
    currentNiceArray.push(data);
    console.log("Last 10 Nice Logs: " + currentNiceArray);

    niceLogHTML = '<ul class="unstyled" id="' + producer + '-nice">'
    for (var i=1; i < currentNiceArray.length+1; i++) {
        niceLogHTML = niceLogHTML + '<li class="data">' + currentNiceArray[currentNiceArray.length - i] + '</li>';
    }
    niceLogHTML = niceLogHTML + '</ul>';
    return niceLogHTML;  
};

updateSysLog = function(producer, data) {
    currentSysArray = window[producer + '_sys_array'];
    while (currentSysArray.length >= 10) {
        currentSysArray.splice(0, 1);
    }
    currentSysArray.push(data);
    console.log("Last 10 Sys Logs: " + currentSysArray);

    sysLogHTML = '<ul class="unstyled" id="' + producer + '-sys">'
    for (var i=1; i < currentSysArray.length+1; i++) {
        sysLogHTML = sysLogHTML + '<li class="data">' + currentSysArray[currentSysArray.length - i] + '</li>';
    }
    sysLogHTML = sysLogHTML + '</ul>';
    return sysLogHTML;
};

updateDatetimeLog = function(producer, data) {
    currentDatetimeArray = window[producer + '_datetime_array'];
    while (currentDatetimeArray.length >= 10) {
        currentDatetimeArray.splice(0, 1);
    }
    currentDatetimeArray.push(data);
    console.log("Last 10 Datetime Logs: " + currentDatetimeArray);

    datetimeLogHTML = '<ul class="unstyled" id="' + producer + '-datetime">'
    for (var i=1; i < currentDatetimeArray.length+1; i++) {
        datetimeLogHTML = datetimeLogHTML + '<li class="data">' + currentDatetimeArray[currentDatetimeArray.length - i] + '</li>';
    }
    datetimeLogHTML = datetimeLogHTML + '</ul>';
    return datetimeLogHTML;
};

getImmediateStats = function() {
    console.log("Requesting stats from all resources.");
    SWARM.send("stats");
};

bugsConnected = function() {
    for (var i=0; i < availableResources.length; i++) {
        if ((availableResources[i] != me) && (availableResources[i] != "admin")) {
            return true;
        }          
    }
    return false;
}

oneBugConnected = function() {
    var count = 0;
    for (var i=0; i < availableResources.length; i++) {
        if ((availableResources[i] != me) && (availableResources[i] != "admin")) {
            count++;
        }
    }
    console.log("Count is " + count);
    if (count == 1) {
        return true;
    } else {
        return false;
    }
}