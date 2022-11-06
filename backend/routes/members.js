const express =  require('express');
const router=express.Router();

const MemberController=require('../controllers/member');
const checkAuth= require("../middleware/check-auth");


router.get('/groupbyList',MemberController.getMembersListgroupByStreet);
router.get('/groupby',MemberController.getMembersgroupByStreet);
router.get('/total',MemberController.getMembersTotalcount);
// getMembersListgroupByStreet

router.get('',MemberController.getMembers);
router.get('/search',checkAuth,MemberController.searchMember);
router.get('/searchName',checkAuth,MemberController.searchMemberName);
router.get('/:id',MemberController.getMember);
router.post('',checkAuth,MemberController.createMember)
router.put('/:id',checkAuth,MemberController.updateMember);
router.delete('/:id',checkAuth,MemberController.deleteMember);

module.exports=router;
