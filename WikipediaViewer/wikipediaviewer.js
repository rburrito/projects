let linkBox=document.getElementById("two");

$(".random-wiki").on("click", function(event) {
  $(this)
    .css("color", "white")
    .text("Click for another random article");
});

var inputValue = "";
var queryAPI;

var myhandler = function(event) {
  inputValue = $(".search-query").val();
  queryAPI =
    "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&titles=Main%20Page&srsearch=" +
    inputValue;

  $.getJSON(queryAPI, function(data) {
    linkBox.style.paddingTop="3vh";
    var html = "";
    console.log(data);
    for (var i = 0; i < data.query.search.length; i++) {
      searchResult = data.query.search[i];
      html += "<div class='borderColor qbox" + i + "'>";

      html +=
        "<b>" +
        "<a href='http://en.wikipedia.org/?curid=" +
        searchResult.pageid +
        "' target='_blank' class='marge'>" +
        searchResult.title +
        "</a>" +
        "</b>";
      html += "<p class='marge'>" + searchResult.snippet + "..." + "</p>";

      html += "</div>";
    }

    $(".queryBox").html(html);

    $(document).ready(function() {
      $(".search-query").click(function() {
        $(".search-query").val("");
      });
    });
  });
};

$(".btn-info").on("click", myhandler);
