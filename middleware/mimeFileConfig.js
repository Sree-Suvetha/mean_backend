const path = require('path');
const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    '/image/jpg': 'jpg'
}

//config for multer (where to map the incoming files and how to store them)
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, path.join(__dirname, '../images')); // cb(detected error?, path to store files)
    },
     filename:(req, file, cb) =>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+extension)
     }
});

module.exports = multer({storage: storage}).single("image");