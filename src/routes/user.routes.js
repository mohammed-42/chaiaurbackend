import {Router} from "express";
import { loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken, 
  changeCurrentPassword, 
  getCurrentUser, 
  updateAccountDetails, 
  updateAvatar, 
  updateCoverImage ,
  getUserChannelProfile
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/register").post(
  upload.fields([
    {
      name:"avatar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
    }
  ]),
  registerUser)
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
route.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("/coverImage"),updateCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)


export default router;