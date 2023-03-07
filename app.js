const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
// const mailchimp = require("@mailchimp/mailchimp_marketing");
const { json } = require("stream/consumers");
const https = require("https");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){

    res.sendFile(__dirname + "/signup.html")
})

app.post("/signup", function(req, res) {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/a5e824145d"

    const options = {
        method: "POST",
        auth: "aryan:a75f9ea6cb3aaaefe7e8276444a371fb-us21"
    }

    const request = https.request(url, options, function(response){

        console.log(response.statusCode);

        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            // console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req, res){

    res.redirect("/");
})

var port = process.env.PORT || 3000;

app.listen(port, function(){

    console.log("Server is running on port 3000")
})

//Api Key : a75f9ea6cb3aaaefe7e8276444a371fb-us21