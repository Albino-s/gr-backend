import {Router} from 'express';
import formidable from 'formidable';
import {bodyType} from '../middlewares/validation';
import AWS from "aws-sdk";
import {s3config} from 'config';
import {promisify} from '../utils/functions';
import {jail, invalidInputError} from '../utils/errors';

const router = new Router();

router.route('/upload_file').post(bodyType('Object'), jail((req, res, next) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) {
      next(invalidInputError);
    }
    AWS.config.update(s3config);
    const bucket = new AWS.S3({params: {Bucket: '3peas'}});
    const buf = new Buffer(fields.file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    var params = {
      Key: fields.fileName,
      ContentType: 'image/xyz',
      Body: buf,
      ACL: "public-read"
    };
    var options = {partSize: 5 * 1024 * 1024, queueSize: 1};
    res.send(await promisify(cb => bucket.upload(params, options, cb)));
  });
}));

router.route('/remove_file').post(bodyType('Object'), jail(async (req, res) => {
  AWS.config.update(s3config);
  const bucket = new AWS.S3({params: {Bucket: '3peas'}});
  res.send(await promisify(cb => bucket.deleteObject({Key: req.body.filename}, cb)));
}));

export default router;
