import {Router} from 'express';
import userView from '../views/user';
import Users from '../models/users';
import universal from '../routes/universal';
import formidable from 'formidable';
import {bodyType} from '../middlewares/validation';
import AWS from "aws-sdk";
import {s3config} from 'config';
import {promisify} from '../utils/functions';
import {jail, invalidInputError} from '../utils/errors';

const router = new Router();

const routes = universal.router(Users);

router.route('/upload_file').post(bodyType('Object'), jail((req, res, next) => {
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields) => {
    if (err) {
      next(invalidInputError);
    }
    AWS.config.update(s3config);
    const bucket = new AWS.S3({params: {Bucket: '3peas'}});
    var params = {
      Key: "avatar/" + fields.fileName,
      ContentType: 'binary/octet-stream',
      Body: new Buffer(fields.file, 'base64'),
      ACL: "public-read"
    };
    var options = {partSize: 5 * 1024 * 1024, queueSize: 1};
    res.send(await promisify(cb => bucket.upload(params, options, cb)));
  });
}));

router.route('/remove_file').post(bodyType('Object'), jail(async (req, res) => {
  AWS.config.update(s3config);
  const bucket = new AWS.S3({params: {Bucket: '3peas'}});
  res.send(await promisify(cb => bucket.deleteObject({Key: "avatar/" + req.body.filename}, cb)));
}));

router.param('id', routes.param('userData'));

router.route('/:id?')
  .get(...routes.read(userView, 'userData'))
  .post(...routes.create(userView))
  .put(...routes.update(userView, 'userData'))
  .delete(...routes.remove('userData'));

export default router;
