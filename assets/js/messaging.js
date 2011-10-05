//<![CDATA[
   function supports_html5_storage() {
        try {
    return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
    return false;
    }
    }

    function joinSwarm(){
            if (supports_html5_storage()){
               localStorage.setItem("bugswarm_apikey", document.swarmfields.apikey.value);
               localStorage.setItem("bugswarm_swarmID", document.swarmfields.swarmID.value);
            }
            SWARM.join({apikey: document.swarmfields.apikey.value +'', 
                        swarms: [document.swarmfields.swarmID.value +''],
                        callback: function(message) {
                            document.swarmfields.muc.value+=JSON.stringify(message, null, '\t');
                            document.swarmfields.muc.scrollTop = document.swarmfields.muc.scrollHeight;
                        }
            });
        }
       
    
        function loadValues(){
		if (supports_html5_storage()){
			if (typeof(localStorage["bugswarm_apikey"])!="undefined"){
	        		document.swarmfields.apikey.value = localStorage["bugswarm_apikey"];
			}
			if (typeof(localStorage["bugswarm_swarmID"])!="undefined"){
	        		document.swarmfields.swarmID.value = localStorage["bugswarm_swarmID"];
			}
        	}
	}
    //]]>
