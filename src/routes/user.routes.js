import { Router } from "express";
import { isTeacher } from "../middlewares/isTeacher.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";
import {
  changePassword as changeStudentPassword,
  getAllStudents,
  loginStudent,
  logoutStudent,
  registerStudent,
  removeStudent,
} from "../controllers/student.controller.js";
import {
  addSubject,
  getAllSubjects,
  removeSubject,
} from "../controllers/admin.controller.js";
import {
  changePassword as changeTeacherPassword,
  getAllTeachers,
  loginTeacher,
  registerTeacher,
  removeTeacher,
  logoutTeacher,
} from "../controllers/teacher.controller.js";
const router = Router();

router.route("/register/student").post(registerStudent);

router.route("/login/faculty").post(isTeacher, (req, res) => {
  res.status(200).send({ message: "login route of faculty " });
});
router.route("/login/admin").post((req, res) => {
  res.status(200).send({ message: "login route of admin" });
});
router.route("/admin/subject").post(addSubject);
router.route("/admin/subject/remove").delete(removeSubject);
router.route("/admin/subject/getall").get(getAllSubjects);
router.route("/admin/students/remove").delete(removeStudent);
router.route("/admin/students/getall").get(getAllStudents);
router
  .route("/admin/students/changepassword")
  .patch(isStudent, changeStudentPassword);
router.route("/login/student").post(loginStudent);
router.route("/logout/student").post(isStudent, logoutStudent);
router.route("/register/teacher").post(registerTeacher);
router.route("/admin/teachers/getall").get(getAllTeachers);
router.route("/admin/teachers/remove").delete(removeTeacher);
router.route("/admin/teachers/changepassword").patch(changeTeacherPassword);
router.route("/login/teacher").post(loginTeacher);
router.route("/logout/teacher").post(isTeacher, logoutTeacher);

export default router;
