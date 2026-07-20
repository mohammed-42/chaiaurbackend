import {Router} from "express"
import {publishAvideo,getAllVideo} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middlewares.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router();
router.route("/publish").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "videothumbnail", maxCount: 1 }
  ]),
  publishAvideo
)

router.route("/get-vedios").get(getAllVideo);
console.log("Registered video routes:", router.stack.map(r => r.route?.path))

export default router;