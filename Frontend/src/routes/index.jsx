import LoginPage from "views/LoginPage/LoginPage.jsx";
import SignupPage from "views/SignupPage/SignupPage.jsx";
import MyCoursesPage from "views/MyCoursesPage/MyCoursesPage.jsx";
import CreateCoursePage from "views/CreateCoursePage/CreateCoursePage.jsx";
import FindCoursePage from "views/FindCoursePage/FindCoursePage.jsx";
import StudyRecordsPage from "views/StudyRecordsPage/StudyRecordsPage.jsx";

var indexRoutes = [
  { path: "/sign-up", name: "SignupPage", component: SignupPage },
  { path: "/my-courses", name: "MyCourses", component: MyCoursesPage },
  { path: "/create-course", name: "CreateCourse", component: CreateCoursePage },
  { path: "/find-course", name: "FindCourse", component: FindCoursePage },
  { path: "/study-records", name: "StudyRecords", component: StudyRecordsPage},
  { path: "/", name: "LoginPage", component: LoginPage },
];

export default indexRoutes;
