import {Router} from 'express';
import CategoryController from '../controllers/category.controller.js';
import authentication from '../middlewares/authentication.js';

const router = new Router();
const categoryController = new CategoryController();

router.get('/category',
    authentication(),
    categoryController.list);

router.get('/category/:id',
    authentication(),
    categoryController.get);

router.post('/category',
    authentication(),
    categoryController.create);

router.put('/category/:id',
    authentication(),
    categoryController.update);

export default router;
