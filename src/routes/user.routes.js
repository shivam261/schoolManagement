import { Router } from "express";
import { isTeacher } from "../middlewares/isTeacher.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
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
  addClass,
  getClasses,
  addStudentInClass,
  feePayment,
  scholarship,
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

router.route("/register/student").post(isAdmin, registerStudent);
router.route("/admin/subject").post(isAdmin, addSubject);
router.route("/admin/subject/remove").delete(isAdmin, removeSubject);
router.route("/admin/subject/getall").get(isAdmin, getAllSubjects);
router.route("/admin/students/remove").delete(isAdmin, removeStudent);
router.route("/admin/students/getall").get(isAdmin, getAllStudents);
router
  .route("/admin/students/changepassword")
  .patch(isStudent, changeStudentPassword);
router.route("/login/student").post(loginStudent);
router.route("/logout/student").post(isStudent, logoutStudent);
router.route("/register/teacher").post(isAdmin, registerTeacher);
router.route("/admin/teachers/getall").get(isAdmin, getAllTeachers);
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
router.route("/admin/addclass").post(isAdmin, addClass);
router.route("/admin/getClasses").get(isAdmin, getClasses);
router.route("/admin/class/addstudent").post(isAdmin, addStudentInClass);
router.route("/admin/paymentfees").post(isAdmin, feePayment);
router.route("/admin/scholarship").patch(isAdmin, scholarship);

export default router;
