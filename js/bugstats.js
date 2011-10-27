var me = '1671ae80f13f60ca93a757b764d3fdceaf6cc9d4';
var availableResources = [];

SWARM.connect({apikey: 'a35c8276f241a967d8bdf59a07d4b5d522447b17',
               resource: '1671ae80f13f60ca93a757b764d3fdceaf6cc9d4',
               swarms: ['83537f005a15bc5f65935997ef858461c8f86608'],
               onmessage: function() {},
               onpresence: function() {},
               onerror: function() {},

               // callbacks
               onconnect:
                   function onConnect() {
                       console.log('connected!');
                   },
               onpresence:
                   function onPresence(presence) {
                       presenceObj = JSON.parse(presence);
                       if (presenceObj.presence.from.swarm) {
                           presenceResource = presenceObj.presence.from.resource;
                           status = presenceObj.presence.type;

                           // presence unavailable received
                           if (status && (status == 'unavailable')) {
                               presenceUnavailable(presenceResource);

                           // presence available received
                           } else {
                               presenceAvailable(presenceResource);
                           }
                       }

                       console.log('Available Resources:');
                       console.log(availableResources);
                       console.log('');
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
                       if (data.sys) {
                           usr = parseFloat(data.usr);
                           nice = parseFloat(data.nice);
                           sys = parseFloat(data.sys);
                           console.log('');
                           console.log('Stats for resource ' + producer + ':');
                           console.log('User Percentage: ' + usr);
                           console.log('Nice Percentage: ' + nice);
                           console.log('System Percentage: ' + sys);
                           console.log('');
                           $('#' + producer + '-usr').replaceWith('<h4>' + usr + '</h4>');
                           $('#' + producer + '-nice').replaceWith('<h4>' + nice + '</h4>');
                           $('#' + producer + '-sys').replaceWith('<h4>' + sys + '</h4>');
                       }
                   }

              });

presenceUnavailable = function(presenceResource) {
    console.log('');
    console.log('Presence unavailable message received.');
    for (var i = 0; i < availableResources.length; i++) {
        if (availableResources[i] == presenceResource) {
            availableResources.splice(i, 1);
            console.log('Resource ' + presenceResource + ' removed.');
            // DOM
            removeResource(presenceResource);
        }
    }
};

presenceAvailable = function(presenceResource) {
    console.log('');
    console.log('Presence available message received.');
    var alreadyAvailable = false;
    for (var i = 0; i < availableResources.length; i++) {
        if (availableResources[i] == presenceResource) {
            alreadyAvailable = true;
            console.log('Resource already exists in table. Not adding.');
        }
    }
    if (!alreadyAvailable) {
        availableResources.push(presenceResource);
        console.log('Resource ' + presenceResource + ' added.');
        // DOM
        appendResource(presenceResource);
    }
};

removeResource = function(toRemove) {
    $('#' + toRemove).remove();
};

appendResource = function(toAppend) {
    // ensure you are not appending a browser instance
    if ((toAppend == me) || (toAppend == 'admin')) {
        return;
    }

    var $resourceDiv = $('<br><div class="bugstats-resource" id="' + toAppend + '"><h2>Resource: ' + toAppend + '</h2><div class="row"><div class="span-one-third"><h3>User %</h3><h4 id="' + toAppend + '-usr">N/A</h4></div><div class="span-one-third"><h3>Nice %</h3><h4 id="' + toAppend + '-nice">N/A</h4></div><div class="span-one-third"><h3>System %</h3><h4 id="' + toAppend + '-sys">N/A</h4></div></div></div><br><div class="page-header"></div>');
    $('#resources').append($resourceDiv);
};

getStats = function() {
    console.log('Requesting stats from all resources.');
    SWARM.send('stats');
};

