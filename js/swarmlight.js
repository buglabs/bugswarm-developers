SWARM.connect({apikey: 'a35c8276f241a967d8bdf59a07d4b5d522447b17',
               resource: '0e3c838394a77cff63f008d9c36f11a1c5921eee',
               swarms: ['d0e0de97f0b1ebe17762654f209b3bd100de6bf6'],
               onmessage: function() {},
               onpresence: function() {},
               onerror: function() {},
               onconnect:
                   function onConnect() {
                       console.log('connected!');
                   }
              });

lighton = function() {
    console.log("on");
    SWARM.send("LIGHTON");
};

lightoff = function() {
    console.log("off");
    SWARM.send("LIGHTOFF");
};
