// Load the SDK
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});


var rekognition = new AWS.Rekognition();

require('dotenv').config();
var imageSearch = require('node-google-image-search');

exports.handler = function (event,context,callback)  {
   
    console.log('--------------Calling Celebrity Recognition Api-------------- ');

    var params = {
    Image: { /* required */
      S3Object: {
        Bucket: 'celeb-lamda-function',
        Name: 'saurav.jpg'
      }
    }
  };
    rekognition.recognizeCelebrities(params, function (err, data) {
        if (err) { 
            console.log(err, err.stack); 
            callback(null,err);
        } // an error occurred
        else {
            if (data.CelebrityFaces.length == 0) {
                console.log('---------Celebrity Not Recognized..........');
                
                sightEngineApi();
                
            }
            else {
                
                response.celebName=data.CelebrityFaces[0].Name;
                
                response.probWithUser= data.CelebrityFaces[0].MatchConfidence;
                
                imageSearch(response.celebName, result, 0, 1);
             
            }
        }
    });

var response={
    celebName:"",
    probWithUser:"",
    celebImageLink:""
};
 
function sightEngineApi() {
    console.log('-------------In Sight Engine----------------');

    var sightengine = require('sightengine')("1538590156", "LiKUMaTzuNe2XAXbk66E");

    sightengine.check(['celebrities']).set_url('https://s3.amazonaws.com/celeb-lamda-function/bijaya.jpg').then(function (result) {
        
        response.celebName=result.faces[0].celebrity[0].name;
        response.probWithUser=result.faces[0].celebrity[0].prob;
        
        console.log("celebrity name : " +  response.celebName);
        console.log("celebrity prob : " + response.probWithUser);
        
        imageSearch(response.celebName, result, 0, 1);
        
    }).catch(function (err) {
        // handle the error
        console.log(err.stack);
         callback(null,err);
    });
}

function result(results){
      
        response.celebImageLink=results[0].link;
        
        console.log("response :");
        console.log(response);
         
        callback(null,response);
        
        console.log('-----------------------End--------------------------------');
}

};