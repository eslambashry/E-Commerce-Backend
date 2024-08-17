import cloudinary from "./cloudinaryConfigrations.js"

export const asynchandler = (API) =>{
    return (req,res,next) => {
         API(req,res,next).catch(async(err)=>{
             console.log(err)
             console.log(req.imagePath)
             if(req.imagePath){
                await cloudinary.api.delete_resources_by_prefix(
                    req.imagePath
                )
                await cloudinary.api.delete_folder(
                    req.imagePath
                    )
             }
            return next(new Error('Fail', {cause:500}))
            })
     }
 } 

export const globalResponse = (err,req,res,next) => {
    if(err){
        if(req.validationErrorArr){
            return res.status(err['cause'] || 400).json({message: req.validationErrorArr})
        }
        return res.status(err['cause'] || 500).json({message:err.message})
    }
}