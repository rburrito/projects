var quotesAPI =
  "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
var citation = "";
var qotd = "";
var author = "";
var newQuote = "";

$("#get-quote").on("click", function(event) {
  $.ajax({
    dataType: "json",
    url: quotesAPI,
    success: function(quote) {
      // retrieves JSON data from a quote API
      qotd = quote[0].content;
      author = quote[0].title;
      citation = $(".quoteMessage").html(qotd + "-" + author);
      newQuote=citation.text();
    },
    cache: false
  });

  $("#get-quote").css("background-color", "LightSlateGrey").text("New Quote");
});

$("#tweet-box").click(function(event) {
  var tweetlink = "https://twitter.com/intent/tweet?text=LA%20CITATION%20DU%20JOUR: " + encodeURIComponent(newQuote);
  window.open(tweetlink, "_blank");
});

/*
$("#get-quote").on("click", function(event) {
  $.getJSON(quotesAPI, function(quote) {  // retrieves JSON data from a quote API
    citation= $(".quoteMessage").html(quote[0].content + "-" + quote[0].title);
  });
  $("#get-quote").css("background-color", "LightSlateGrey").text("New Quote");
  $.ajaxSetup({   //
    cache: false   // disables cache globally for getJSON request so that new data is loaded. Use $.ajax for specific instances. However, you would also have to retrieve data with Ajax instead of getJSON.
  })
});
  */
