const UserModel = require('../models/user.model');
const FIRModel = require('../models/fir.model');

exports.police = async (req,res,next)=>{
    try{
        const {citizenEmail, description, typeOfCrime, location, placeOfCrime} = req.body;

        let citizen = await UserModel.findOne({email: citizenEmail})

        if(!citizen){
            return res.status(403).json({ error: "Citizen not found. Ensure they are registered." })
        }

        const newFIR = await FIRModel.create({
            citizen: citizen._id,  
            citizenEmail,
            assignedPolice: req.user.id,  
            typeOfCrime,
            description,
            placeOfCrime,
            location,
            status: "Under Investigation",
        })

        res.status(201).json({ message: "FIR filed successfully by police", fir: newFIR });
    }catch(err){
        console.error("Error in registration:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    };
}

exports.citizen = async (req,res)=>{
        try{
            const {citizenEmail, description, typeOfCrime, location, placeOfCrime} = req.body;
    
            let citizen = await UserModel.findOne({email: citizenEmail})
    
            if(!citizen){
                return res.status(403).json({ error: "Citizen not found. Ensure they are registered." })
            }
    
            const newFIR = await FIRModel.create({
                citizen: citizen._id,
                citizenEmail,
                typeOfCrime,
                description,
                placeOfCrime,
                location,
                status: "Filed",
            })
    
            res.status(201).json({ message: "FIR filed successfully by citizen", fir: newFIR });
        }catch(err){
            console.error("Error in registration:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        };
}


exports.statusUpdate = async (req,res)=>{
    try{
        const id = req.params.id;
        const userId = req.user.id;
        const {status} = req.body

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

    }catch(err){
        console.error("Error in registration:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.policefirs = async (req,res)=>{
    try{
        const { location } = req.user;

        const FIRs = await FIRModel.find({location: location});

        res.status(200).json({FIRs})
    }catch(error){
        console.log("Error fetcing Fir:", error);
        res.status(500).json({message: "Error! internal server error"})
    }
} 

exports.policefiledFIRs = async (req,res)=>{
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
    }catch(err){
        console.error("Error in registration:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.citizenfiledFIR = async (req,res)=>{
    try{
        const {id} = req.user;
        const firId = req.params.id

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
        console.error("Error in registration:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.citizenfiledFIRs = async (req,res)=>{
    try{
        const { id } = req.user;

        const FIRs = await FIRModel.find({citizen: id});

        res.status(200).json({FIRs})
    }catch(err){
        console.log("Error fetcing Fir:", err);
        res.status(500).json({message: "Error! internal server error"})
    }
}