import express from 'express';

const router = express.Router();

// GET home page
router.get('/', (req, res) => {
  res.render('pages/root', { title: 'Home' });
});

export { router as rootRouter };
