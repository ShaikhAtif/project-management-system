import app from "express";
const router = app.Router();

import { create, get } from "../controllers/student.js";

router.post("/", create);
router.get("/:id", get);

export default router;
