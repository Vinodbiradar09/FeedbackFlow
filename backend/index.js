import { app } from "./app.js";
import { connectDB } from "./src/db.config/db.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000 , ()=>{
      console.log(`server is running at local host ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.error(error.message);
    console.log("connection failed to database" , error);
})