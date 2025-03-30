const { Router } = require('express');
const verifyToken = require('../middleware/authMiddleware');
const FIRModel = require('../models/fir.model');
const UserModel = require('../models/user.model');
const authorizeRoles = require('../middleware/roleMiddleware');
const { citizen, police, statusUpdate, citizenfiledFIRs, citizenfiledFIR, policefiledFIRs, policefirs } = require('../controllers/firController');

const router = Router()

router.post('/police',verifyToken,authorizeRoles('POLICE'),police)

router.post('/citizen',verifyToken, authorizeRoles('CITIZEN'), citizen)

router.put('/police/updateStatus/:id',verifyToken,authorizeRoles('POLICE'), statusUpdate)

router.get('/police',verifyToken,authorizeRoles('POLICE'), policefirs)

router.get('/police/:id',verifyToken, authorizeRoles('POLICE'), policefiledFIRs)

router.get('/citizen/:id',verifyToken, authorizeRoles('CITIZEN'), citizenfiledFIR)

router.get('/citizen',verifyToken, authorizeRoles('CITIZEN'), citizenfiledFIRs)

module.exports = router;