function check_streamers(){

  chrome.storage.local.get("all_streamer_data" , function(all_streamer_data) {
  all_streamer_data = all_streamer_data.all_streamer_data
    console.log
  if (typeof all_streamer_data != 'undefined'){
    for (var i = 0; i < all_streamer_data.length; i++){
      console.log("Checking for streamers online");
      request_api_data(all_streamer_data[i]);
    }
  }
  });
}

function request_api_auth(streamer){
  
  let client_id = '4dbwbbkyioqp78t1lmp3rgqst3yfuh';
  let redirect_url = chrome.identity.getRedirectURL() + 'twitch';
  let response_type = 'token';
  let scope = 'viewing_activity_read';

  console.log(redirect_url);
  chrome.identity.launchWebAuthFlow(
    {'url': 'https://id.twitch.tv/oauth2/authorize?client_id=' + client_id + '&redirect_uri=' + redirect_url + '&response_type=' + response_type + '&scope' + scope, 'interactive': true},
    function(redirect_url) { 

      var myUrl = new URL(redirect_url.replace(/#/g,"?"));
      var access_token = myUrl.searchParams.get("access_token");

      chrome.storage.local.set({'access_token' : access_token}, function() {
        console.log('Saved access_token into storage' + access_token);
      });
     });
}

const request_api_data = async (streamer) => {
  try {
    chrome.storage.local.get("access_token", async (access_token) => {
      console.log(access_token);
      const instance = axios.create({
        baseURL: "https://api.twitch.tv/helix/streams?user_login=" + streamer.name,
        timeout: 1000,
        headers: {Authorization: 'Bearer ' + access_token.access_token,
                  'Client-ID': '4dbwbbkyioqp78t1lmp3rgqst3yfuh'}
      }); 
      
      let api_response = await instance.get();
      console.log(api_response);
      notify(api_response, streamer);
    });

  } catch (errors) {
    console.error(errors);
  }
}


function notify(api_json, streamer_data) {
  if (streamer_data.notify && api_json.data.data.lenght != 0){
    chrome.notifications.create('', {
      title: api_json.data.data[0].title,
      message: api_json.data.data[0].user_name  + ' has started streaming ' + api_json.data.data[0].game_name,
      iconUrl: 'notification_image.jpg',
      type: 'basic'
    });
  }
}

function clear_local_data(){
  chrome.storage.local.clear();
}

//clear_local_data()
setInterval(function() { check_streamers(); }, 100000);

