import prisma from "../DB/db.config.js";
import {generateRandomNum, imageValidator} from "../utils/Helpers.js";

export default class ProfileController {

    static async index(req, res) {
        try {
            const user = req.user;
            console.log(user)
            return res.json({ status: 200, user });
        } catch (error) {
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }

    static async update(req, res) {
        try {
            const {id} = req.params;

            if(!req.files && Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "Something went wrong.Please try again.",})
            }

            const profile = req.files.profile;


            const message = imageValidator(profile?.size,profile?.mimetype)
            if (message !=null){
                return res.status(400).json({message });
            }

            const imgExt = profile?.name.split(".");
            const imageName = generateRandomNum() + "." + imgExt[1];
            const uploadPath = process.cwd() + "/public/images/" + imageName;

            profile.mv(uploadPath, (err) => {
                if (err) throw err;
            })

            const resultimageName  = await  prisma.users.update({
                where :{
                    id : Number(id)
                },
                data : {
                    profile : imageName
                }

            })


            return res.json({
                status: 200,
                message: "Profile updated successfully!",
            });


        } catch (error) {

            console.log('this is error '+ error)

            return res.status(500).json({ message: "Something went wrong!" });
        }
    }

}
