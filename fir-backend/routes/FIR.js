const { Router } = require('express');
const verifyToken = require('../middleware/authMiddleware');
const FIRModel = require('../models/fir.model');
const UserModel = require('../models/user.model');

const firRouter = Router()

firRouter.post('/police',verifyToken, async (req,res)=>{
    try{
        const {citizenEmail, description, typeOfCrime, location, placeOfCrime} = req.body;
        if(req.user.role!=="POLICE"){
            return res.status(403).json({ error: "Only police can file FIRS" })
        }

        let citizen = await UserModel.findOne({email: citizenEmail})

        if(!citizen){
            return res.status(403).json({ error: "Citizen not found. Ensure they are registered." })
        }

        const newFIR = await FIRModel.create({
            citizen: citizen._id,  // ✅ Correct citizen assignment
            assignedPolice: req.user.id,  // ✅ Authenticated police officer's ID
            typeOfCrime,
            description,
            placeOfCrime,
            location,
            status: "Under Investigation",
        })

        res.status(201).json({ message: "FIR filed successfully by police", fir: newFIR });
    }catch(error){
        console.log("Error filing Fir:", error);
        res.status(500).json({message: "Error! internal server error"})
    };
})

firRouter.post('/citizen',verifyToken, async (req,res)=>{
    try{
        const {citizenEmail, description, typeOfCrime, location, placeOfCrime} = req.body;
        if(req.user.role!=="CITIZEN"){
            return res.status(403).json({ error: "Only police can file FIRS" })
        }

        let citizen = await UserModel.findOne({email: citizenEmail})

        if(!citizen){
            return res.status(403).json({ error: "Citizen not found. Ensure they are registered." })
        }

        const newFIR = await FIRModel.create({
            citizen: citizen._id,
            typeOfCrime,
            description,
            placeOfCrime,
            location,
            status: "Filed",
        })

        res.status(201).json({ message: "FIR filed successfully by citizen", fir: newFIR });
    }catch(error){
        console.log("Error filing Fir:", error);
        res.status(500).json({message: "Error! internal server error"})
    };
})

firRouter.put('/police/updateStatus/:id',verifyToken,async (req,res)=>{
    try{
        const id = req.params.id;
        const {role} = req.user;
        const userId = req.user.id;
        const {status} = req.body

        if(role!=="POLICE"){
            return res.status(403).json({"message": "Error! only police can update the status"})
        }

        const police = await UserModel.findOne({_id: userId});

        const fir = await FIRModel.findById(id);

        if(!fir){
            return res.status(403).json({ error: "FIR not found "})
        }

        if(!police || police.location!== fir.location){
            return res.status(403).json({error : "Unauthorized user"})
        }

        const updatedFIR = await FIRModel.findByIdAndUpdate(id,
            {
                status,
                assignedPolice: userId,
            },
            {new: true},
        );

        res.status(201).json({ "message": "Status Updated!", fir: updatedFIR})

    }catch(error){
        console.log("Error filing Fir:", error);
        res.status(500).json({message: "Error! internal server error"})
    }
})

firRouter.get('/police',verifyToken,async (req,res)=>{
    try{
        const {location, role} = req.user;

        if(role!=="POLICE"){
            return res.status(403).json({"message": "Error! only police can update the status"})
        }

        const FIRs = await FIRModel.find({location: location});

        res.status(200).json({FIRs})
    }catch(error){
        console.log("Error fetcing Fir:", error);
        res.status(500).json({message: "Error! internal server error"})
    }
})

firRouter.get('/police/:id',verifyToken, async (req,res)=>{
    try{
        const {location, role, id} = req.user;
        const firId = req.params.id

        if(role!=="POLICE"){
            return res.status(403).json({"message": "Error! only police can access this"})
        }

        const police = await UserModel.findById({_id:id})

        const Fir = await FIRModel.findById({_id: firId})

        if(!Fir){
            return res.status(403).json({Error: "There is no such FIR filed in"})
        }

        if(!police || location!==Fir.location){
            return res.status(403).json({Error: "No such Fir exists"})
        }

        res.status(200).json({Fir})
    }catch(error){
        console.log("Error fetching Fir: ", error)
        res.status(500).json({"Error":"internal server Error"})
    }
})

firRouter.get('/citizen/:id',verifyToken, async (req,res)=>{
    try{
        const {role, id} = req.user;
        const firId = req.params.id

        if(role!=="CITIZEN"){
            return res.status(403).json({"message": "Error! only police can access this"})
        }

        const citizen = await UserModel.findById({_id:id})

        const Fir = await FIRModel.findById({_id: firId})

        if(!Fir){
            return res.status(403).json({Error: "There is no such FIR filed in"})
        }

        if(!citizen || id!==Fir.citizen){
            return res.status(403).json({Error: "No such Fir exists"})
        }

        res.status(200).json({Fir})
    }catch(error){
        console.log("Error fetching Fir: ", error)
        res.status(500).json({"Error":"internal server Error"})
    }
})

firRouter.get('/citizen',verifyToken,async (req,res)=>{
    try{
        const {id, role} = req.user;

        if(role!=="CITIZEN"){
            return res.status(403).json({"message": "Error! only police can update the status"})
        }

        const FIRs = await FIRModel.find({citizen: id});

        res.status(200).json({FIRs})
    }catch(error){
        console.log("Error fetcing Fir:", error);
        res.status(500).json({message: "Error! internal server error"})
    }
})

module.exports = firRouter;