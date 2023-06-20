import {Router} from 'express';
import LogisticController from '../controllers/logistic.controller.js';
import authentication from '../middlewares/authentication.js';

const router = new Router();
const logisticController = new LogisticController();

router.post('/client/search',
    logisticController.productSearch);

//new changes
router.post('/client/select',
    logisticController.productSelect);

router.post('/client/Init',
    logisticController.productInit);

router.post('/client/confirm',
    logisticController.productConfirm);

router.post('/client/cancel',
    logisticController.productCancel);

router.post('/client/track',
    logisticController.productTrack);

router.post('/client/track',
    logisticController.productStatus);

router.post('/client/support',
    logisticController.productSupport);

export default router;
