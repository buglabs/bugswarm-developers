function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function createKeys(){
    if (supports_html5_storage()){
        localStorage.setItem("bugswarm_username", document.account_fields.login.value);
        localStorage.setItem("bugswarm_password", document.account_fields.pass.value);
    }
    postCORS('http://api.bugswarm.net/keys', document.account_fields.login.value, document.account_fields.pass.value, function(data){showKeysPost(data)});
}
function getKeys(){
    getCORS('http://api.bugswarm.net/keys', document.account_fields.login.value, document.account_fields.pass.value, function(data){showKeysGet(data)});
}
     
function showKeysPost(data){
    console.log(JSON.stringify(data));
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 'configuration'){
            document.api_key_fields.configuration.value = data[i].key.replace(/['"]/g,'');
    }
        else if (data[i].type == 'participation'){
            document.api_key_fields.participation.value = data[i].key.replace(/['"]/g,'');
    }
}
}
     
function showKeysGet(data){
    console.log(JSON.stringify(data));
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 'configuration'){
            document.api_key_fields.configuration.value = data[i].key.replace(/['"]/g,'');
    }
        else if (data[i].type == 'participation'){
            document.api_key_fields.participation.value = data[i].key.replace(/['"]/g,'');
    }
}
     }
        
     
        
function postCORS(url, username, password, callback, type){
    $.ajax({
        url : url,
        type : 'POST',
        headers: {'Authorization': 'Basic ' +Base64.encode(username + ":" + password)},
        success: callback,
        error:function(xhr, error){alert(xhr.responseText);}
    });
}
function getCORS(url, username, password, callback, type){
    $.ajax({
        url : url,
        type : 'GET',
        headers: {'Authorization': 'Basic ' +Base64.encode(username + ":" + password)},
        success: callback
    });
}  
    
function loadValues(){
    if (supports_html5_storage()){
        if (typeof(localStorage["bugswarm_username"])!="undefined"){
            document.account_fields.login.value = localStorage["bugswarm_username"];
        }
        if (typeof(localStorage["bugswarm_password"])!="undefined"){
            document.account_fields.pass.value = localStorage["bugswarm_password"];
        }
    }
}