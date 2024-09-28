const { Router } = require('express');
const controller = require('./controller');
const validation = require('../../../middlewares/validation/admin');
const validationAddress = require('../../../middlewares/validation/address');

const { validateToken, validateSuperAdmin, checkRight, checkRightSave, checkRightDelete, checkRightDetail } = require('../../../middlewares/auth');
const masterAdmin = require('../../../../models/admin');

const router = Router({ mergeParams: true });

router.post('/login', validation.login, controller.login);
router.post('/validate-token', validateToken, controller.validateToken);
router.post('/update-password', validateToken, validation.updatePassword, controller.updatePassword);
router.get('/profile', validateToken, controller.profile);
router.post('/save-profile', validateToken, validation.updateSuperAdmin, controller.saveProfile);
router.post('/change-avatar', validateToken, controller.changeAvatar);

///// Sub-Admin route
// router.get('/sub-admin/list', validateToken/*, checkRight('super-admin-access-list')*/, controller.list);
// router.post('/sub-admin/save', validateToken/*, checkRightSave('super-admin-access-add', 'super-admin-access-edit'), validation.subAdmin*/, controller.save);
// router.post('/sub-admin/delete', validateToken, /*checkRightDelete('super-admin-access-delete'),*/ controller.delete);


router.get('/list-user', validateToken, checkRight('list-user') ,controller.listUser);
router.post('/save-user', validateToken, checkRightSave('add-user', 'edit-user'), controller.saveUser);
// router.get('/details-user/:_id', validateToken/*, checkRightDetail('detail-user'), */,controller.detailsUser);
// router.post('/delete-user', validateToken/*, checkRightDelete('delete-user'),*/, controller.deleteUser);

//// admin save user address route
router.get("/address/list", validateToken/*, checkRight('list-address')*/, controller.listAddress);
// router.get("/address/details/:_id", validateToken/*, checkRightDetail('detail-address')*/, controller.detailsAddress);
router.post("/address/save", validateToken, validationAddress.userAddress,  controller.saveAddress);
router.post("/address/delete", validateToken/*, checkRightDelete('delete-address')*/, controller.deleteAddress);

router.get('/init-admin', async (req, res) => {
    const docData = new masterAdmin();
    docData.firstName = 'parvez';
    docData.lastName = 'Alam';
    docData.email = 'admin@test.com';
    docData.phone = '7532063883';
    docData.password = 'admin';
    docData.type = 'superAdmin';
    await docData.save();

    res.send('success');
});

module.exports = router;