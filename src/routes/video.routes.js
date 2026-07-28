import {Router} from "express"
import {publishAvideo,getAllVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus} from "../controllers/video.controller.js"
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

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(
    verifyJWT,
    upload.fields([
      { name: "videothumbnail", maxCount: 1 }
    ]),
    updateVideo
  )

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus)

export default router