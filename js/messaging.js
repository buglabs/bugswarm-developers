//<![CDATA[
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function joinSwarm() {
  if (supports_html5_storage()) {
    localStorage.setItem('bugswarm_apikey',
        document.swarmfields.apikey.value);
    localStorage.setItem('bugswarm_swarmID',
        document.swarmfields.swarmID.value);
    localStorage.setItem('bugswarm_resourceID',
        document.swarmfields.resourceID.value);
  }
  console.log('joining');
  SWARM.connect({
        apikey: document.swarmfields.apikey.value + '',
        resource: document.swarmfields.resourceID.value + '',
        swarms: [document.swarmfields.swarmID.value + ''],

        onmessage: function(message) {
          console.log(message);
          console.log('in callback');
           var obj = JSON.parse(message);

          document.swarmfields.muc.value += JSON.stringify(obj, null, '\t') + '\n';
          document.swarmfields.muc.scrollTop = document.swarmfields.muc.scrollHeight;
        },
        onconnect: function() {
          console.log('connected!');
          document.swarmfields.muc.value = 'Connected to swarm' +
            document.swarmfields.swarmID.value +
            ', waiting for messages...\n\n\n';

        },

        onerror: function(error) {
          alert(JSON.stringify(error));
        }
      });
}

function loadValues() {
  if (supports_html5_storage()) {
    if (typeof (localStorage['bugswarm_apikey']) != 'undefined') {
      document.swarmfields.apikey.value = localStorage['bugswarm_apikey'];
    }
    if (typeof (localStorage['bugswarm_swarmID']) != 'undefined') {
      document.swarmfields.swarmID.value = localStorage['bugswarm_swarmID'];
    }
  }
  if (typeof (localStorage['bugswarm_resourceID']) != 'undefined') {
    document.swarmfields.resourceID.value = localStorage['bugswarm_resourceID'];
  }
}
    //]]>
