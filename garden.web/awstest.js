var fs = require('fs');
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// Set your region for future requests.
AWS.config.region = '';

// Create a bucket using bound parameters and put something in it.
// Make sure to change the bucket name from "myBucket" to something unique.

fs.readFile('./test.jpeg', function (err, data) {
  if (err) {
    console.log("There was an error opening the file");
  } else {
    var s3bucket = new AWS.S3({params: {Bucket: 'garden-baj'}});
    s3bucket.createBucket(function () {
      s3bucket.putObject({
        Key:"test-image",
        ContentType: 'image/jpeg',
        ContentLength: data.length,
        Body: data
      }, function (err, data) {
        if (err) {
          console.log("There was an error writing the data to S3:");
          console.log(err);
        } else {
          console.log("Your data has been written to S3:");
          console.log(data);
          var params = {Key: 'test-image'};
          s3bucket.getSignedUrl('getObject', params, function (err, url) {
            console.log("The URL is", url);
          });
        }
      });
    });


  }

});