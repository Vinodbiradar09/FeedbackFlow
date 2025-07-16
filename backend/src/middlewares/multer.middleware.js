import multer from "multer";

const storage = multer.diskStorage({
    destination : (req , file , cb)=>{
        cb(null , "./public/temp");
    },

    filename : (req ,  file , cb)=>{
        const filename = file.originalname;
        cb(null , filename);
    }
})

export const upload = multer({storage : storage});