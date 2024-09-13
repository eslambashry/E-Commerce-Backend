import mongoose from 'mongoose'

export const connectionDB = async () => {
    return await mongoose.connect(`mongodb://localhost:27017/amazon`) // ! DB_CONNECTION_URL
    .then((res)=>console.log("DataBase Connection Success"))
    .catch((err)=>console.log("DataBase connection Fail",err))
}
  