import dotenv from "dotenv";
dotenv.config()
import { app } from "./app.js";
import connectDB from "./db/connectDatabse.js";




connectDB()
.then( () => {
    app.on("error", (error) => {
        console.log("ERROR : ", error);
        throw error 
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`app is running at port : ${process.env.PORT}`);
        
    })
}
)
.catch( (err) => {
    console.log("something went wrong !!!");
    
})

