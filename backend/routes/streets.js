const express =  require('express');
const router=express.Router();

const streetController=require('../controllers/street');
const checkAuth= require("../middleware/check-auth");

router.get('/total',streetController.getStreetsTotalcount);
router.get('/search',checkAuth,streetController.searchStreet);
router.get('/streetonly',checkAuth,streetController.getStreetsOnly);
router.get('',streetController.getStreets);
router.get('/:id',streetController.getStreet);
router.post('',checkAuth,streetController.createStreet)
router.put('/:id',checkAuth,streetController.updateStreet);
router.delete('/:id',checkAuth,streetController.deleteStreet);

module.exports=router;
