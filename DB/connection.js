import mongoose from 'mongoose'

export const connectionDB = async () => {
    return await mongoose.connect(process.env.DB_CONNECTION_URL) // ! DB_CONNECTION_URL
    .then((res)=>console.log("DataBase Connection Success 🔑"))  
    .catch((err)=>console.log("DataBase connection Fail 💩",err))
}
  