const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
}); // <--- this is just an instance of an aws user, it' s an object that has a method that
// allows us to communicate with our S3 bucket

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file :( sth must have gone wrong with multer");
        return res.sendStatus(500);
    }
    // if we make it here, that means there is a file to upload
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "onionxsocialnetworkxmonopoly", // <-- should be spicedling if you are using spiced credentials
            ACL: "public-read", // <-- allows our upload to be accessible by the public
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // all the code above is responsible for handleing our upload to the cloud

    promise
        .then(() => {
            // it worked!!!
            console.log("yayyyy my image is in the cloud ☁️");
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log("oh no we didn't make it to the cloud :(", err);
            return res.sendStatus(500);
        });
};
