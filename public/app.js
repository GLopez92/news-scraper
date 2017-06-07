
$(".saveActicles").on("click", function() {

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/saveActicles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
    });
});

$(".makeNote").on("click", function() {

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/makeNote/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
    });
});

$(".makeNote").on("click", function() {
  
  var thisId = $(this).attr("data-id");
 
  $.ajax({
    method: "Post",
    url: "/makeNote/" + thisId
  })
 
    .done(function(data) {
      console.log(data);
      
      $("#comments").append("<h2>" + data.title + "</h2>");

      $("#comments").append("<input id='titleinput' name='title' >");
     
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
    
      if (data.comment) {
   
        $("#titleinput").val(data.comment.title);
  
        $("#bodyinput").val(data.comment.body);
      }
    });
});

$(".seeNote").on("click", function() {
  console.log("see note")
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/seeNote/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log("DATA"+data.body);
        $("#notes").append("<h2>" + data.Comment + "</h2><br>");

  });
});

$(document).on("click", ".savenote", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/saveNote/" + thisId,
    data: {
   
      title: $("#titleinput").val(),
     
      body: $("#bodyinput").val()
    }
  })

    .done(function(data) {
    
      console.log(data);
      
      $("#comments").empty();
    });
  
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
