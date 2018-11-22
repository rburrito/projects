var channels = [
  { channel: "channels/ninja?callback=?" },
  { channel: "channels/freecodecamp?callback=?" },
  { channel: "channels/stumptgamers?callback=?" }
];
var streams = [
  { stream: "streams/ninja?callback=?" },
  { stream: "streams/freecodecamp?callback=?" },
  { stream: "streams/stumptgamers?callback=?" }
];

var twitchAPI = "https://wind-bow.gomix.me/twitch-api/";

for (j = 0; j < channels.length; j++) {
  var HTML =
    "<div class='row'> <div class='channel-info" +
    j +
    "'> </div>" +
    "<div class='stream-info" +
    j +
    "'> </div> </div>";
  $(".box-info").append(HTML);
}

for (let i = 0; i < channels.length; i++) {
  let channelsAPI = "";
  let streamsAPI = "";

  channelsAPI = twitchAPI + channels[i].channel;
  streamsAPI = twitchAPI + streams[i].stream;

  $.getJSON(channelsAPI).done(function(data) {
    // channels
    console.log(data);
    var channelHTML =
      "<div class='col-xs-6'>" +
      "<img src='" +
      data.logo +
      "' class='logo'>" +
      " " +
      data.display_name +
      "<br> Click <a href=' " +
      data.url +
      "' target='_blank'> here </a>" +
      " to visit " +
      data.display_name +
      "'s site." +
      "</div>";
    $(".channel-info" + i).html(channelHTML);

    console.log("requesting", streamsAPI);
    $.getJSON(streamsAPI).done(function(data) {
      //streams
      console.log(data);

      if (data.stream === null) {
        var streamHTML =
          "<div class='col-xs-6'>" +
          "<p><b>Status</b>: Currently offline.</p> </div> ";
        $(".stream-info" + i).html(streamHTML);
      } else {
        var streamHTML =
          "<div class='col-xs-6'><p><b>Status</b>: " +
          data.stream.channel.status +
          "</p></div>";
        $(".stream-info" + i).html(streamHTML);
      }
    });
  });
}
