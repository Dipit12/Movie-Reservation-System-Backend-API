import {Request,Response} from 'express'
import {prisma} from "../../../prisma/db"
import dotenv from 'dotenv'
dotenv.config()

// ========== THEATRE CRUD OPERATIONS ==========

// Create Theatre
export const createTheatre = async (req:Request,res:Response) =>{
    const {name,city,address} = req.body;
    if(!name || !city || !address){
        return res.status(400).json({
            msg:"Please enter all the details"
        })
    }
    try{
        const adminID = req.user?.user_id;
        if(!adminID){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            })
        }
        
        const theatre = await prisma.theatre.create({
            data:{
                name:name,
                city:city,
                address:address,
                admin_id:adminID
            }
        })

        return res.status(201).json({
            msg:"Theatre created successfully",
            theatre
        })
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

// Get All Theatres (for current admin)
export const getAllTheatres = async (req:Request,res:Response) =>{
    try{
        const adminID = req.user?.user_id;
        if(!adminID){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            })
        }

        const theatres = await prisma.theatre.findMany({
            where:{
                admin_id:adminID
            },
            include:{
                screens:true
            }
        })

        return res.status(200).json({
            msg:"Theatres retrieved successfully",
            count: theatres.length,
            theatres
        })
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

// Get Theatre By ID
export const getTheatreById = async (req:Request,res:Response) =>{
    try{
        const {theatre_id} = req.params;
        const adminID = req.user?.user_id;
        
        if(!adminID){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            })
        }

        if(!theatre_id){
            return res.status(400).json({
                msg:"Theatre ID is required"
            })
        }

        const theatre = await prisma.theatre.findFirst({
            where:{
                theatre_id:theatre_id,
                admin_id:adminID
            },
            include:{
                screens:true
            }
        })

        if(!theatre){
            return res.status(404).json({
                msg:"Theatre not found or you don't have permission to access it"
            })
        }

        return res.status(200).json({
            msg:"Theatre retrieved successfully",
            theatre
        })
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

// Update Theatre
export const updateTheatre = async (req:Request,res:Response) =>{
   const {theatre_id} = req.params;
   const {name, city, address} = req.body;
   const adminID = req.user?.user_id;
   
   if(!theatre_id){
    return res.status(400).json({
        msg:"Theatre ID is required"
    })
   }
   
   if(!name || !city || !address){
    return res.status(400).json({
        msg:"Please enter all the details"
    })
   }
   
   if(!adminID){
    return res.status(401).json({
        msg:"Unauthorized: No user found in request"
    })
   }
   
   try{
        // First verify the theatre exists and belongs to this admin
        const existingTheatre = await prisma.theatre.findFirst({
            where:{
                theatre_id:theatre_id,
                admin_id:adminID
            }
        })

        if(!existingTheatre){
            return res.status(404).json({
                msg:"Theatre not found or you don't have permission to update it"
            })
        }

        const updatedTheatre = await prisma.theatre.update({
            where:{
                theatre_id:theatre_id
            },
            data:{
                city:city,
                name:name,
                address:address,
            }
        }) 
        
        return res.status(200).json({
            msg:"Theatre details updated successfully",
            theatre: updatedTheatre
        })
   }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        });
   }
}

// Delete Theatre
export const deleteTheatre = async (req:Request,res:Response) =>{
    const {theatre_id} = req.params;
    const adminID = req.user?.user_id;
    
    if(!theatre_id){
        return res.status(400).json({
            msg:"Theatre ID is required"
        })
    }
    
    if(!adminID){
        return res.status(401).json({
            msg:"Unauthorized: No user found in request"
        })
    }
    
    try{
        // First verify the theatre exists and belongs to this admin
        const existingTheatre = await prisma.theatre.findFirst({
            where:{
                theatre_id:theatre_id,
                admin_id:adminID
            },
            include:{
                screens:true
            }
        })

        if(!existingTheatre){
            return res.status(404).json({
                msg:"Theatre not found or you don't have permission to delete it"
            })
        }

        // Check if theatre has screens (cascade delete might be restricted)
        if(existingTheatre.screens.length > 0){
            return res.status(400).json({
                msg:"Cannot delete theatre with existing screens. Please delete all screens first."
            })
        }

        await prisma.theatre.delete({
            where:{
                theatre_id:theatre_id
            }
        })
        
        return res.status(200).json({
            msg:"Theatre deleted successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        });
    }
}

// ========== SCREEN CRUD OPERATIONS ==========

// Create Screen
export const createScreen = async (req:Request,res:Response) =>{
    const {theatre_id, name, screen_type, capacity} = req.body;
    
    if(!theatre_id || !name || !screen_type || !capacity){
        return res.status(400).json({
            msg:"Please enter all the details (theatre_id, name, screen_type, capacity)"
        })
    }

    if(capacity <= 0){
        return res.status(400).json({
            msg:"Capacity must be greater than 0"
        })
    }
    
    try{
        const adminID = req.user?.user_id;
        if(!adminID){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            })
        }

        // Verify the theatre exists and belongs to this admin
        const theatre = await prisma.theatre.findFirst({
            where:{
                theatre_id:theatre_id,
                admin_id:adminID
            }
        })

        if(!theatre){
            return res.status(404).json({
                msg:"Theatre not found or you don't have permission to add screens to it"
            })
        }

        const screen = await prisma.screen.create({
            data:{
                theatre_id:theatre_id,
                name:name,
                screen_type:screen_type,
                capacity:capacity
            }
        })

        return res.status(201).json({
            msg:"Screen created successfully",
            screen
        })
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

// Get All Screens for a Theatre
export const getScreensByTheatre = async (req:Request,res:Response) =>{
    try{
        const {theatre_id} = req.params;
        const adminID = req.user?.user_id;
        
        if(!adminID){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            })
        }

        if(!theatre_id){
            return res.status(400).json({
                msg:"Theatre ID is required"
            })
        }

        // Verify the theatre belongs to this admin
        const theatre = await prisma.theatre.findFirst({
            where:{
                theatre_id:theatre_id,
                admin_id:adminID
            }
        })

        if(!theatre){
            return res.status(404).json({
                msg:"Theatre not found or you don't have permission to access it"
            })
        }

        const screens = await prisma.screen.findMany({
            where:{
                theatre_id:theatre_id
            },
            include:{
                seats:true
            }
        })

        return res.status(200).json({
            msg:"Screens retrieved successfully",
            count: screens.length,
            screens
        })
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

// Get Screen By ID
export const getScreenById = async (req:Request,res:Response) =>{
    try{
        const {screen_id} = req.params;
        const adminID = req.user?.user_id;
        
        if(!adminID){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            })
        }

        if(!screen_id){
            return res.status(400).json({
                msg:"Screen ID is required"
            })
        }

        const screen = await prisma.screen.findUnique({
            where:{
                screen_id:screen_id
            },
            include:{
                theatre:true,
                seats:true
            }
        })

        if(!screen){
            return res.status(404).json({
                msg:"Screen not found"
            })
        }

        // Verify the theatre belongs to this admin
        if(screen.theatre.admin_id !== adminID){
            return res.status(403).json({
                msg:"You don't have permission to access this screen"
            })
        }

        return res.status(200).json({
            msg:"Screen retrieved successfully",
            screen
        })
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

// Update Screen
export const updateScreen = async (req:Request,res:Response) =>{
   const {screen_id} = req.params;
   const {name, screen_type, capacity} = req.body;
   const adminID = req.user?.user_id;
   
   if(!screen_id){
    return res.status(400).json({
        msg:"Screen ID is required"
    })
   }
   
   if(!name || !screen_type || capacity === undefined){
    return res.status(400).json({
        msg:"Please enter all the details (name, screen_type, capacity)"
    })
   }

   if(capacity <= 0){
    return res.status(400).json({
        msg:"Capacity must be greater than 0"
    })
   }
   
   if(!adminID){
    return res.status(401).json({
        msg:"Unauthorized: No user found in request"
    })
   }
   
   try{
        // First verify the screen exists and belongs to admin's theatre
        const existingScreen = await prisma.screen.findUnique({
            where:{
                screen_id:screen_id
            },
            include:{
                theatre:true
            }
        })

        if(!existingScreen){
            return res.status(404).json({
                msg:"Screen not found"
            })
        }

        if(existingScreen.theatre.admin_id !== adminID){
            return res.status(403).json({
                msg:"You don't have permission to update this screen"
            })
        }

        const updatedScreen = await prisma.screen.update({
            where:{
                screen_id:screen_id
            },
            data:{
                name:name,
                screen_type:screen_type,
                capacity:capacity
            }
        }) 
        
        return res.status(200).json({
            msg:"Screen details updated successfully",
            screen: updatedScreen
        })
   }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        });
   }
}

// Delete Screen
export const deleteScreen = async (req:Request,res:Response) =>{
    const {screen_id} = req.params;
    const adminID = req.user?.user_id;
    
    if(!screen_id){
        return res.status(400).json({
            msg:"Screen ID is required"
        })
    }
    
    if(!adminID){
        return res.status(401).json({
            msg:"Unauthorized: No user found in request"
        })
    }
    
    try{
        // First verify the screen exists and belongs to admin's theatre
        const existingScreen = await prisma.screen.findUnique({
            where:{
                screen_id:screen_id
            },
            include:{
                theatre:true,
                seats:true,
                showtimes:true
            }
        })

        if(!existingScreen){
            return res.status(404).json({
                msg:"Screen not found"
            })
        }

        if(existingScreen.theatre.admin_id !== adminID){
            return res.status(403).json({
                msg:"You don't have permission to delete this screen"
            })
        }

        // Check if screen has seats or showtimes (cascade delete might be restricted)
        if(existingScreen.seats.length > 0){
            return res.status(400).json({
                msg:"Cannot delete screen with existing seats. Please delete all seats first."
            })
        }

        if(existingScreen.showtimes.length > 0){
            return res.status(400).json({
                msg:"Cannot delete screen with existing showtimes. Please delete all showtimes first."
            })
        }

        await prisma.screen.delete({
            where:{
                screen_id:screen_id
            }
        })
        
        return res.status(200).json({
            msg:"Screen deleted successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        });
    }
}