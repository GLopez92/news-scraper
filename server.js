var express     = require("express");
var exphbs      = require("express-handlebars");
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
var logger      = require("morgan");

var Comment = require("./models/Comments.js");
var Articles = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));


var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.get("/", function(req, res) {

  Article.find({ 'title': 'Tech' }, function(error, doc) {

    var hbsObject = {
      Acticles: data
    };
    console.log("this is the hbs object" + hbsObject);
    res.render("index", hbsObject);
    // if (error) {
    //   console.log(error);
    // }
   
    // else {
    //   res.render("index.html", doc);
    // }
  });
});

app.get("/scrape", function(req, res) {
  request("https://www.nytimes.com/", function(error, response, html) {
  
    var $ = cheerio.load(html);
    
    $("h2.story-heading").each(function(i, element) {
      
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      var entry = new Article(result);
      
      entry.save(function(err, doc) {
        
        if (err) {
          console.log(err);
        }
       
        else {
          console.log(doc);
        }
      });
    });
  });

  res.send("Scrape Complete");
  console.log(result);


  Article.find({ 'title': 'Tech' }, function(error, doc) {
    var hbsObject = {
      Acticles: data
    };
    console.log("this is the hbs object" + hbsObject);
    res.render("index", hbsObject);
    // if (error) {
    //   console.log(error);
    // }
   
    // else {
    //   res.render("index.html", doc);
    // }
  });
});

app.post("/savearticles/:id", function(req, res) {
  var query = {"_id": req.params.id};
  var update = {"saved": true};
  var options = {new: true};
      Articles.findOneAndUpdate(query, update, options, function(err, doc) {
       
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);

        }
      });

  console.log("saved articles")

});


app.get("/viewArticles", function(req, res) {

   
  Article.find({'title': 'Tech' }, function(error, doc) {
    var hbsObject = {
      Acticles: data
    };
    console.log("this is the hbs object" + hbsObject);
    res.render("index", hbsObject);
  // if (error) {
  //   console.log(error);
  // }
 
  // else {
  //   res.render("saved-articles.html", doc);
  // }

});

app.post("/makeNote/:id", function(req, res) {
  var newComment = new Comment(req.body);

  newComment.save(function(error, doc) {
  
    if (error) {
      console.log(error);
    }

    else {
      Articles.findOneAndUpdate({ "_id": req.params.id }, { "Comment": doc._id })
     
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
  console.log("created note")
});

app.post("/saveNote/:id", function(req, res) {

  console.log("req.body", req.body)
  var newComment = new Comment(req.body);

  var articlesId = req.params.id;

  newComment.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      Articles.findOne({ "_id": articlesId}).then(function(Articles, err){
        console.log(articles)
        Articles.Comment.push(newComment);
        res.send(newComment)
      });
    }
  });
});

app.get("/seeNote/:id", function(req, res) {

  Articles.findOne({ "_id": req.params.id })
  .populate("Comment").exec(function(error, data) {

    if (error) {
      console.log(error);
    }
    else {
      res.json(data.Comment);
    }
  });
});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});
