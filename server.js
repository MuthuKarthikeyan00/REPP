import express from 'express';
import "dotenv/config";
import fileUpload from 'express-fileupload';

const app = express();
const PORT = process.env.PORT ;

app.use(fileUpload({
    createParentPath: true
}))




app.get('/',(req,res)=>{
     res.json({message:"Hello mk"});
})


import api from "./routes/api.js";
app.use('/api', api);

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})