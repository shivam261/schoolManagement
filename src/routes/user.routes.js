import { Router } from "express";
const router = Router();

router.route("/register").post();
router.route("/login").post((req, res) => {
  res.status(200).send({ message: "login route" });
});
export default router;
