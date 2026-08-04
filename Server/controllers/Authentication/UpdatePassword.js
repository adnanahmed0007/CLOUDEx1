

import UserDetaildatabse from "../../models/Usermodel.js";
import generateToken from "../../util/Generatetoken.js";

import bcrypt from "bcrypt"
const updatePassword = async (req, res) => {
    try {
        const { password, newpassword } = req.body;
        if (password && newpassword) {
            const user = req.user;
            const currentpassword = user.password;
            const compare = await bcrypt.compare(password, currentpassword);
            if (!compare) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect."
                });
            }
            user.password = await bcrypt.hash(newpassword, 10);
            await user.save();
            return res
                .status(200)
                .json({
                    success: true,
                    message: "password changed successfully"

                })
        }
        else {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "fill all the credentials"
                }
                )
        }
    }
    catch (e) {
        console.error(e);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
export default updatePassword