import { Router } from "express";
import { isTeacher } from "../middlewares/isTeacher.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";
import {isAdmin} from "../middlewares/isAdmin.middleware.js";
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
  registerAdmin,
  loginAdmin,
  logoutAdmin,
    changePassword as changeAdminPassword,
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
router
  .route("/admin/teachers/changepassword")
  .patch(isTeacher, changeTeacherPassword);
router.route("/login/teacher").post(loginTeacher);
router.route("/logout/teacher").post(isTeacher, logoutTeacher);
router.route("/register/admin").post(registerAdmin);
router.route("/login/admin").post(loginAdmin);
router.route("/logout/admin").post(isAdmin, logoutAdmin);
router.route("/admin/changepassword").patch(isAdmin, changeAdminPassword);

export default router;
