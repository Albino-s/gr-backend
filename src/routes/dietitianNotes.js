import {Router} from 'express';
import dietitianNoteView from '../views/dietitianNote';
import DietitianNotes from '../models/dietitianNotes';
import universal from '../routes/universal';

const router = new Router();

const routes = universal.router(DietitianNotes);

router.param('id', routes.param('dietitianNote'));

router.route('/:id?')
  .get(...routes.read(dietitianNoteView, 'dietitianNote'))
  .post(...routes.create(dietitianNoteView))
  .put(...routes.update(dietitianNoteView, 'dietitianNote'))
  .delete(...routes.remove('dietitianNote'));

export default router;
