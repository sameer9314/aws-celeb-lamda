// Load the SDK
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
var rekognition = new AWS.Rekognition();

exports.handler = function (event,context,callback)  {
   
    console.log('--------------Calling Celebrity Recognition Api-------------- ');

    var params = {
    Image: { /* required */
      S3Object: {
        Bucket: 'celeb-lamda-function',
        Name: 'bijaya.jpg'
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
                
                sightEngineApi(imgName);
                callback(null,'Not Recognized');
            }
            else {
                
                console.log(data); // successful response
                callback(null,data);
                console.log('-----------------------End--------------------------------');
            }
        }
    });


function sightEngineApi(imgName) {
    console.log('-------------In Sight Engine----------------');

    var sightengine = require('sightengine')("", "");

    sightengine.check(['celebrities']).set_url('https://s3.amazonaws.com/celeb-lamda-function/bijaya.jpg').then(function (result) {
        // read the output (result)
        console.log('Printing Result');
       console.log(result);
       callback(null,result);
        // console.log("features   : " + result.faces[0].features);
        // console.log("celebrity name : " + result.faces[0].celebrity[0].name);
        // console.log("celebrity prob : " + result.faces[0].celebrity[0].prob);
        // console.log("celebrity name : " + result.faces[0].celebrity[1].name);
        // console.log("celebrity prob : " + result.faces[0].celebrity[1].prob);
        // console.log('-----------------------End--------------------------------');
    }).catch(function (err) {
        // handle the error
        console.log(err.stack);
        console.log(null,err);
    });

}

};