SWARM.connect({apikey: 'a35c8276f241a967d8bdf59a07d4b5d522447b17',
               resource: '971abb0d2ec4807248f700f7e139dbbf1ca03d25',
               swarms: ['d0e0de97f0b1ebe17762654f209b3bd100de6bf6'],
               onmessage: function() {},
               onpresence: function() {},
               onerror: function() {},
               onconnect:
                   function onConnect() {
                       console.log('connected!');
                   }
              });

xmaslightson = function() {
    console.log("xmaslights on");
    SWARM.send("XMASON");
};

xmaslightsoff = function() {
    console.log("xmaslights off");
    SWARM.send("XMASOFF");
};

redon = function() {
    console.log("red on");
    SWARM.send("REDON");
}

redoff = function() {
    console.log("red off");
    SWARM.send("REDOFF");
}

greenon = function() {
    console.log("green on");
    SWARM.send("GREENON");
}

greenoff = function() {
    console.log("green off");
    SWARM.send("GREENOFF");
}

yellowon = function()  {
    console.log("yellow on");
    SWARM.send("YELLOWON");
}

yellowoff = function()  {
    console.log("yellow off");
    SWARM.send("YELLOWOFF");
}