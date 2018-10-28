import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import { DecodeToken, VerifyToken, StrToHex, HexToStr } from './helpers';
import { Course } from './dataClasses/Course';

const assignmentsDir = path.resolve(__dirname, 'MultiPassData', 'Assignments');
const multichainOptions = require('./multichainOptions');
const multichain = require('multichain-node')(multichainOptions);

// Gets course from the course data stream (multichain)
const getCourse = async (_key) => {
  const course = await multichain.listStreamKeyItems({ stream: 'courses', key: _key });
  if (course.length === 0) return false;
  return JSON.parse(HexToStr(course[course.length - 1].data));
};

// Creates new course in the course data stream (multichain)
// eslint-disable-next-line
const setCourse = async (courseId, dataObj) => {
  return multichain.publish({
    stream: 'courses',
    key: courseId,
    data: StrToHex(JSON.stringify(dataObj))
  });
};

// Gets user data object from the users data stream  (multichain)
const getUser = async (_key) => {
  const user = await multichain.listStreamKeyItems({ stream: 'users', key: _key });
  if (user.length === 0) return false;
  return JSON.parse(HexToStr(user[user.length - 1].data));
};

// eslint-disable-next-line
const setUser = async (userId, userObj) => {
  return multichain.publish({
    stream: 'users',
    key: userId,
    data: StrToHex(JSON.stringify(userObj))
  });
};

// Sets property on the user data object in the user data stream  (multichain)
/* eslint-disable */
const setChainUserData = async (userId, key, value) => {
  const user = await getUser(userId);
  if (!user[key]) user[key] = {};
  user[key] = value;

  return multichain.publish({
    stream: 'users',
    key: userId,
    data: StrToHex(JSON.stringify(user))
  });
};

// Pushes value into an array in the user object (multichain)
const userPushObjToArr = async (userId, arrayObj, value) => {
  const user = await getUser(userId);
  if (user.arrayObj && user.arrayObj.includes(value)) return `${value} already exists`;
  if (!user[arrayObj]) user[arrayObj] = [];
  user[arrayObj].push(value);

  return multichain.publish({
    stream: 'users',
    key: userId,
    data: StrToHex(JSON.stringify(user))
  });
};
/* eslint-enable */

// Save assignment file to the filesystem (C:/MultiPassData/Assignments/)
const saveAssignment = async (file, courseId) => {
  await mkdirp(`${assignmentsDir}\\${courseId}`, (err) => {
    if (err) console.log('Could not Write file');
    fs.rename(file.path, `${assignmentsDir}\\${courseId}\\${file.name}`, (wErr) => {
      if (wErr) throw wErr;
    });
  });
};

// Get data for study records page
module.exports.GetMyData = async (request, response) => {
  try {
    const { jwt } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const client = DecodeToken(jwt);

      // Get user from chain
      const chainUser = await getUser(client.matriculationId);

      // Get courses that the student is enrolled in
      const courseIDs = Object.keys(chainUser.courses);
      const coursePromises = [];
      for (let i = 0; i < courseIDs.length; i++) coursePromises.push(getCourse(courseIDs[i]));
      const courses = await Promise.all(coursePromises);

      // Construct response data object
      const responseData = {};
      for (let i = 0; i < courses.length; i++) {
        const {
          id, type, name, semester, ects, nameAbr
        } = courses[i].course;

        const courseObj = {
          id,
          type,
          name,
          semester,
          ects,
          nameAbr,
          grade: chainUser.courses[courseIDs[i]].evaluation
        };
        responseData[courseIDs[i]] = courseObj;
      }

      response.status(200).send({ message: 'OK', data: responseData });
    } else {
      response.status(401).send({ message: 'Unauthorized attempt' });
      return;
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
};

// Get course data from student user to show evaluation and feedbacks
module.exports.GetMyCurrentCourseData = async (request, response) => {
  try {
    const { jwt, courseId, courseSemester } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const client = DecodeToken(jwt);

      // Get user from chain
      const chainUser = await getUser(client.matriculationId);
      const _courseId = `${courseId}-${courseSemester}`;

      // Construct response data object
      const _data = chainUser.courses[_courseId];

      response.status(200).send({ message: 'OK', data: _data });
    } else {
      response.status(401).send({ message: 'Unauthorized attempt' });
      return;
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
};

// Grade Student
module.exports.SubmitGrade = async (request, response) => {
  try {
    const {
      jwt, studentId, courseId, courseSemester, grade
    } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const clientUser = DecodeToken(jwt);
      if (clientUser.userType !== 'teacher') {
        response.status(401).send({ message: 'Unauthorized attempt' });
        return;
      }
      // Get course and user from the chain
      const _courseId = `${courseId}-${courseSemester}`;
      const chainUser = await getUser(studentId);
      const chainCourse = await getCourse(_courseId);

      // Check if the student has been evaluated for everything
      const assignmentEvaluations = Object.keys(chainUser.courses[_courseId].assignmentPoints);
      const testEvaluations = Object.keys(chainUser.courses[_courseId].testPoints);
      if ((assignmentEvaluations.length + testEvaluations.length) !==
        (chainCourse.course.assignmentCount + chainCourse.course.testCount)) {
        response.status(403).send({ message: 'Submit points and feedbacks first' });
        return;
      }

      // Check if the student has been already graded
      if (chainUser.courses[_courseId].evaluation !== 0) {
        response.status(403).send({ message: 'Student has been already graded' });
        return;
      } else {
        // If not, grade the student and save the grade into chain
        chainUser.completedCourses.push(chainCourse.course.nameAbr);
        chainUser.courses[_courseId].evaluation = grade;
      }
      const txId = await setUser(studentId, chainUser);
      console.log(txId);
      response.status(200).send({ message: 'Grade successfully submitted' });
    } else {
      response.status(401).send({ message: 'Unauthorized attempt' });
      return;
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
};

// Save feedbacks and points into chain
module.exports.EvaluateStudent = async (request, response) => {
  try {
    const {
      jwt, student, courseId, courseSemester
    } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const clientUser = DecodeToken(jwt);
      if (clientUser.userType !== 'teacher') {
        response.status(401).send({ message: 'Unauthorized attempt' });
        return;
      }
      // Get user from the chain
      const _courseId = `${courseId}-${courseSemester}`;
      const chainUser = await getUser(student.matriculationId);

      // Check if the student has been already graded
      if (chainUser.courses[_courseId].evaluation !== 0) {
        response.status(403).send({ message: 'Student has been already graded' });
        return;
      }

      // If not, save the evaluation into the chain
      chainUser.courses[_courseId] = student.eval;
      const txId = await setUser(student.matriculationId, chainUser);
      console.log(txId);
      response.status(200).send({ message: 'Evaluation Successful' });
    } else {
      response.status(401).send({ message: 'Unauthorized attempt' });
      return;
    }
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
};

// Retrieve Student data for the course card students section (userType = teacher)
module.exports.GetStudentData = async (request, response) => {
  try {
    const {
      jwt, courseId, courseSemester, students
    } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const clientUser = DecodeToken(jwt);
      if (clientUser.userType !== 'teacher') {
        response.status(401).send({ message: 'Unauthorized attempt' });
        return;
      }

      // Get course from chain
      const _courseId = `${courseId}-${courseSemester}`;
      const chainCourseObj = await getCourse(_courseId);
      const chainCourse = chainCourseObj.course;

      // Get all student data of the course
      const studentsPromised = [];
      for (let i = 0; i < students.length; i++) {
        studentsPromised.push(getUser(chainCourse.students[i]));
      }
      const studentsArray = await Promise.all(studentsPromised);

      // Construct student data response object
      const _data = [];
      for (let i = 0; i < students.length; i++) {
        const { firstName, lastName } = studentsArray[i];
        _data.push({
          firstName,
          lastName,
          matriculationId: students[i],
          eval: studentsArray[i].courses[_courseId]
        });
      }
      response.status(200).send({ data: _data });
    } else {
      response.status(401).send({ message: 'Token expired/invalid' });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: 'Internal server error' });
  }
};

module.exports.WithdrawMe = async (request, response) => {
  try {
    const { jwt, course } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const clientUser = DecodeToken(jwt);
      if (clientUser.userType !== 'student') {
        response.status(401).send({ message: 'you are not authorized to do this action' });
        return;
      }

      // Get course from chain
      const _courseId = `${course.id}-${course.semester}`;
      const chainCourseObj = await getCourse(_courseId);
      const chainCourse = chainCourseObj.course;

      // Check if student is withdrawing within the deadline
      const enrollmentDate = new Date(chainCourse.enrollmentDate);
      if (enrollmentDate < Date.now()) {
        response.status(400).send({ message: 'Its past the withdrawal deadline for this course' });
        return;
      }

      // Get user from chain
      const chainUser = await getUser(clientUser.matriculationId);

      // Delete student from the students array of the chainCourse
      const oldStudents = chainCourse.students;
      const newStudents = [];
      for (let i = 0; i < oldStudents.length; i++) {
        if (oldStudents[i] !== clientUser.matriculationId) newStudents.push(oldStudents[i]);
      }

      // Delete course from the courses object of the chainUser
      const studentCourses = chainUser.courses;
      delete studentCourses[_courseId];

      // Set the changed objects
      chainCourse.students = newStudents;
      chainUser.courses = studentCourses;
      chainCourseObj.course = chainCourse;

      // Save changes into chain
      let txId = await setUser(clientUser.matriculationId, chainUser);
      console.log(txId);
      txId = await setCourse(_courseId, chainCourseObj);
      console.log(txId);

      response.status(200).send({ message: 'Sucessfully withdrawed from course' });
    } else {
      response.status(401).send({ message: 'Token Expired/Invalid' });
    }
  } catch (err) {
    console.log('===== WITHDRAWAL ERROR =====');
    request.status(500).send({ message: 'Internal server error' });
  }
};

// Handle course enrollment request
module.exports.EnrollMe = async (request, response) => {
  try {
    const { jwt, course } = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(jwt);
    if (isValid) {
      // Decode token to get client user data
      const clientUser = DecodeToken(jwt);
      if (clientUser.userType !== 'student') {
        response.status(401).send({ message: 'you are not authorized for course enrollment' });
        return;
      }

      // Get user from chain,
      const chainUser = await getUser(clientUser.matriculationId);

      // Get course from chain
      const _courseId = `${course.id}-${course.semester}`;
      const chainCourseObj = await getCourse(_courseId);
      const chainCourse = chainCourseObj.course;

      // Check if student is enrolling within the deadline
      const enrollmentDate = new Date(chainCourse.enrollmentDate);
      if (enrollmentDate < Date.now()) {
        response.status(400).send({ message: 'Its past the enrollment deadline for this course' });
        return;
      }

      // Check if student meets course requirements
      if (chainCourse.requirements.length !== 0) {
        for (let i = 0; i < chainCourse.requirements.length; i++) {
          if (!chainUser.completedCourses.includes(chainCourse.requirements[i])) {
            response.status(400).send({ message: 'Requirements for enrollment not met' });
            return;
          }
        }
      }

      // Check if student enrolled less than 3 times to the selected course
      if (chainUser.courseEntries[course.id] === undefined) chainUser.courseEntries[course.id] = 0;
      if (chainUser.courseEntries[course.id] < 3) {
        chainUser.courseEntries[course.id]++;
      } else {
        response.status(400).send({ message: 'Cant enroll more than 3 times to a course' });
        return;
      }

      // Check for available slot
      if ((chainCourse.students.length >= chainCourse.studentCount)) {
        response.status(400).send({ message: 'Course is full' });
        return;
      }

      // Send notification to teacher for validation?

      // create course entry for student
      if (chainUser.courses[_courseId] === undefined) {
        chainUser.courses[_courseId] = {
          feedbacks: {},
          assignmentPoints: {},
          testPoints: {},
          evaluation: 0
        };
      } else {
        response.status(400).send({ message: 'You are already enrolled in the selected course' });
        return;
      }

      chainCourse.students.push(clientUser.matriculationId);
      chainCourseObj.course = chainCourse;
      // save changes to chain
      let txId = await setUser(clientUser.matriculationId, chainUser);
      console.log(txId);
      txId = await setCourse(_courseId, chainCourseObj);
      console.log(txId);

      response.status(200).send({ message: 'OK' });
    } else {
      response.status(401).send({ message: 'Token Expired/Invalid' });
    }
  } catch (err) {
    console.log(err);
    response.status(500).send({ message: 'Internal server error' });
  }
};

// Respond with the assignment pdf file
module.exports.GetAssignment = async (request, response) => {
  try {
    const data = request.body;
    const { target } = data;
    // Check for validity of passed JWT
    const isValid = VerifyToken(data.jwt);
    if (isValid) {
      response.status(200).sendFile(`${assignmentsDir}\\${target.id}\\${target.file}`);
    } else {
      response.status(401).send({ message: 'Token Expired/Invalid' });
    }
  } catch (err) {
    console.log(err);
    response.status(500).send({ message: 'Internal server error' });
  }
};

// Retrieve all courses from chain (for find courses page)
module.exports.GetAllCourses = async (request, response) => {
  try {
    const data = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(data.jwt);
    if (isValid) {
      // Get all course keys from the courses data stream
      const coursesChain = await multichain.listStreamKeys({ stream: 'courses' });

      // Get all courses via ^ course keys
      const coursePromises = [];
      for (let i = 0; i < coursesChain.length; i++) {
        coursePromises.push(getCourse(coursesChain[i].key));
      }
      const coursesArray = await Promise.all(coursePromises);

      // Delete unwanted data (teacherID) from courses
      for (let i = 0; i < coursesArray.length; i++) delete coursesArray[i].id;

      response.status(200).send({ message: 'ok', courses: coursesArray });
    } else {
      response.status(401).send({ message: 'token expired/invalid' });
    }
  } catch (error) {
    console.log('===== GET-ALL-COURSES ERROR =====');
    console.log(error);
    response.status(500).send();
  }
};

// Responds with user specific generall course data
module.exports.GetMyCourses = async (request, response) => {
  try {
    const data = request.body;
    // Check for validity of passed JWT
    const isValid = VerifyToken(data.jwt);
    if (isValid) {
      const tokenPayload = DecodeToken(data.jwt);
      const { matriculationId, userType } = tokenPayload;
      const id = matriculationId;

      // Get user from chain, get course IDs from course array (key of arrayObj === semester)
      const user = await getUser(id);

      const userCourses = Object.keys(user.courses);
      if (userCourses.length === 0) {
        response.status(200).send({ message: 'ok', courses: [] });
        return;
      }

      const coursePromises = [];

      for (let i = 0; i < userCourses.length; i++) {
        coursePromises.push(getCourse(userCourses[i]));
      }
      const coursesArray = await Promise.all(coursePromises);

      // Check userType to filter out unwanted data (teacherID)
      if (userType === 'student') {
        for (let i = 0; i < coursesArray.length; i++) {
          delete coursesArray[i].id;
          delete coursesArray[i].course.students;
        }
      }

      response.status(200).send({ message: 'ok', courses: coursesArray });
    } else {
      response.status(401).send({ message: 'token expired/invalid' });
    }
  } catch (error) {
    console.log('===== GET-MY-COURSES ERROR =====');
    console.log(error);
    response.status(500).send();
  }
};

// Creates publishes new course to data stream, saves assignment files if they exist
module.exports.CreateCourse = async (request, response) => {
  try {
    const { fields, files } = request;
    // Check for validity of passed JWT
    const isValid = VerifyToken(fields.jwt);
    if (isValid) {
      const tokenPayload = DecodeToken(fields.jwt);
      if (tokenPayload.userType !== 'teacher') {
        response.status(401).send({ message: 'you are not authorized to create a course' });
        return;
      }
      const course = new Course(fields);
      let txId = '';
      const _courseId = `${course.id}-${course.semester}`;
      // Check if course already exists
      const courseCheck = await getCourse(_courseId);
      if (courseCheck) {
        response.status(400).send({ message: 'course already exists' });
        return;
      }

      // store assignment Files on the filesystem (C:\MultiPassData\Assignments\courseIdSemester)
      if ((files.length !== 0) && (files !== undefined)) {
        course.assignments = [];
        for (const file in files) {
          if (files[file]) {
            saveAssignment(files[file], _courseId);
            course.assignments.push(files[file].name);
          }
        }
      }

      // // Create course data object
      const dataObj = {
        course,
        id: tokenPayload.matriculationId,
        firstName: tokenPayload.firstName,
        lastName: tokenPayload.lastName
      };

      // // Publish course data object into the 'courses' data stream
      txId = await setCourse(_courseId, dataObj);
      console.log(`Insert ${_courseId} into courses stream`);
      console.log(txId);

      // // Get teacher data and update his/her courses
      const teacher = await getUser(tokenPayload.matriculationId);
      if (teacher.courses === undefined) teacher.courses = {};
      teacher.courses[_courseId] = true;
      txId = await setUser(tokenPayload.matriculationId, teacher);
      // txId = await userPushObjToArr(dataObj.id, course.semester, course.id);
      console.log(`Update user ${dataObj.id} (${_courseId})`);
      console.log(txId);

      response.status(200).send();
    } else {
      response.status(401).send({ message: 'token invalid/expired' });
    }
  } catch (error) {
    console.log('===== CREATE COURSE ERROR =====');
    console.log(error);
    response.status(500).send();
  }
};
