document.getElementsByTagName("h1")[0].style.fontSize = "55px";
$("h1").addClass("animated rubberBand");
$("body").addClass("animated bounce");
$(".like").addClass("fa fa-thumbs-up");
$(".info-link").addClass("text-info");
$("#para")
  .addClass("zoomIn")
  .addClass("animated zoomOut");
function clickedButton(event) {
  $(this)
    .css("background-color", "DodgerBlue")
    .text("Liked");
}

$(".like").on("click", clickedButton);
