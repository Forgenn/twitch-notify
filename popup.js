document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('add_streamer').addEventListener("click", save_streamer);
  document.getElementById('twitch_auth').addEventListener("click", request_api_auth);
});

function save_streamer(){
  let streamer_name = document.getElementById("name_streamer").value;
  let game = document.getElementById("game_streamer").value;

  if (typeof all_streamer_data == 'undefined'){
    all_streamer_data = [];
  }

  save_array_local(streamer_name, game);
  
}

function save_array_local(streamer_name, game){

  chrome.storage.local.get("all_streamer_data" , function(all_streamer_data) { //Get data from storage and push new streamer

    if (typeof all_streamer_data.all_streamer_data == 'undefined'){
      all_streamer_data = [];
    } else {
      all_streamer_data = all_streamer_data.all_streamer_data;
    }


    all_streamer_data.push({
      name: streamer_name,
      game: game,
      notify : true
    });

    chrome.storage.local.set({'all_streamer_data' : all_streamer_data}, function() {
      console.log('Saved ' + all_streamer_data[all_streamer_data.length - 1].name + ' into storage');
    });
  });

}