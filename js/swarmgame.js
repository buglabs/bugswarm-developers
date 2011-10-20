SWARM.connect({apikey: 'a35c8276f241a967d8bdf59a07d4b5d522447b17',
               resource: 'd339b0c7d52fa3fb5a0a7b6add02a8fa06f8c0c7',
               swarms: ['d0e0de97f0b1ebe17762654f209b3bd100de6bf6'],
               onmessage: function() {},
               onpresence: function() {},
               onerror: function() {},
               onconnect:
                   function onConnect() {
                       console.log('connected!');
                   },
               onmessage:
                   function onMessage(message) {
                       var button;
                       var action;
                       messageObj = JSON.parse(message);
                       data = messageObj.message.payload;
                       for (var key in data) {
                           if (key == "Button") {
                               button = data[key];
                               console.log(button);
                           } else if (key == "Action") {
                               action = data[key]
                               console.log(action)
                           }
                       }
                       if (button == 'Y' && action == 'FORWARD') {
                           $('#dpad-up').replaceWith('<li id=\"dpad-up\"> Up <div class=\"button-on\"></div></li>');
                       } else if (button == 'Y' && action == 'BACKWARD') {
                           $('#dpad-down').replaceWith('<li id=\"dpad-down\"> Down <div class=\"button-on\"></div></li>');
                       } else if (button == 'Y' && action == 'STOP') {
                           $('#dpad-up').replaceWith('<li id=\"dpad-up\"> Up <div class=\"button\"></div></li>');
                           $('#dpad-down').replaceWith('<li id=\"dpad-down\"> Down <div class=\"button\"></div></li>');
                       } else if (button == 'X' && action == 'FORWARD') {
                           $('#dpad-right').replaceWith('<li id=\"dpad-right\"> Right <div class=\"button-on\"></div></li>');
                       } else if (button == 'X' && action == 'BACKWARD') {
                           $('#dpad-left').replaceWith('<li id=\"dpad-left\"> Left <div class=\"button-on\"></div></li>');
                       } else if (button == 'X' && action == 'STOP') {
                           $('#dpad-right').replaceWith('<li id=\"dpad-right\"> Right <div class=\"button\"></div></li>');
                           $('#dpad-left').replaceWith('<li id=\"dpad-left\"> Left <div class=\"button\"></div></li>');
                       } else if (button == '1' && action == 'DOWN') {
                           $('#button-1').replaceWith('<li id=\"button-1\"> 1 <div class=\"button-on\"></div></li>');
                       } else if (button == '1' && action == 'UP') {
                           $('#button-1').replaceWith('<li id=\"button-1\"> 1 <div class=\"button\"></div></li>');
                       } else if (button == '2' && action == 'DOWN') {
                           $('#button-2').replaceWith('<li id=\"button-2\"> 2 <div class=\"button-on\"></div></li>');
                       } else if (button == '2' && action == 'UP') {
                           $('#button-2').replaceWith('<li id=\"button-2\"> 2 <div class=\"button\"></div></li>');
                       } else if (button == '3' && action == 'DOWN') {
                           $('#button-3').replaceWith('<li id=\"button-3\"> 3 <div class=\"button-on\"></div></li>');
                       } else if (button == '3' && action == 'UP') {
                           $('#button-3').replaceWith('<li id=\"button-3\"> 3 <div class=\"button\"></div></li>');
                       } else if (button == '4' && action == 'DOWN') {
                           $('#button-4').replaceWith('<li id=\"button-4\"> 4 <div class=\"button-on\"></div></li>');
                       } else if (button == '4' && action == 'UP') {
                           $('#button-4').replaceWith('<li id=\"button-4\"> 4 <div class=\"button\"></div></li>');
                       } else if (button == '5' && action == 'DOWN') {
                           $('#button-5').replaceWith('<li id=\"button-5\"> 5 <div class=\"button-on\"></div></li>');
                       } else if (button == '5' && action == 'UP') {
                           $('#button-5').replaceWith('<li id=\"button-5\"> 5 <div class=\"button\"></div></li>');
                       } else if (button == '6' && action == 'DOWN') {
                           $('#button-6').replaceWith('<li id=\"button-6\"> 6 <div class=\"button-on\"></div></li>');
                       } else if (button == '6' && action == 'UP') {
                           $('#button-6').replaceWith('<li id=\"button-6\"> 6 <div class=\"button\"></div></li>');
                       } else if (button == '7' && action == 'DOWN') {
                           $('#button-7').replaceWith('<li id=\"button-7\"> 7 <div class=\"button-on\"></div></li>');
                       } else if (button == '7' && action == 'UP') {
                           $('#button-7').replaceWith('<li id=\"button-7\"> 7 <div class=\"button\"></div></li>');
                       } else if (button == '8' && action == 'DOWN') {
                           $('#button-8').replaceWith('<li id=\"button-8\"> 8 <div class=\"button-on\"></div></li>');
                       } else if (button == '8' && action == 'UP') {
                           $('#button-8').replaceWith('<li id=\"button-8\"> 8 <div class=\"button\"></div></li>');
                       } else if (button == '9' && action == 'DOWN') {
                           $('#button-9').replaceWith('<li id=\"button-9\"> 9 <div class=\"button-on\"></div></li>');
                       } else if (button == '9' && action == 'UP') {
                           $('#button-9').replaceWith('<li id=\"button-9\"> 9 <div class=\"button\"></div></li>');
                       } else if (button == '10' && action == 'DOWN') {
                           $('#button-10').replaceWith('<li id=\"button-10\"> 10 <div class=\"button-on\"></div></li>');
                       } else if (button == '10' && action == 'UP') {
                           $('#button-10').replaceWith('<li id=\"button-10\"> 10 <div class=\"button\"></div></li>');
                       }
                   }
              });



//var playground = $("#playground").playground({refreshRate: 30});

//playground.addSprite("sprite1");
//playground.startGame();