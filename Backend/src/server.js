import express from 'express';
import cors from 'cors';
import formidable from 'express-formidable';
import authHandler from './authHandler';
import dataHandler from './dataHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Listening on 3000');
});

// ===== Auth handler routes =====

app.post('/Login', (request, response) => {
  authHandler.Login(request, response);
});

app.post('/SignUp', (request, response) => {
  authHandler.SignUp(request, response);
});

app.post('/Auth', (request, response) => {
  authHandler.Authenticate(request, response);
});

// ===== Data handler routes =====

app.post('/GetMyCourses', (request, response) => {
  dataHandler.GetMyCourses(request, response);
});

app.post('/GetAllCourses', (request, response) => {
  dataHandler.GetAllCourses(request, response);
});

app.post('/CreateCourse', formidable(), (request, response) => {
  dataHandler.CreateCourse(request, response);
});

app.post('/GetAssignment', (request, response) => {
  dataHandler.GetAssignment(request, response);
});

app.post('/EnrollMe', (request, response) => {
  dataHandler.EnrollMe(request, response);
});

app.post('/Withdrawal', (request, response) => {
  dataHandler.WithdrawMe(request, response);
});

app.post('/GetStudentData', (request, response) => {
  dataHandler.GetStudentData(request, response);
});

app.post('/SubmitStudentEvaluation', (request, response) => {
  dataHandler.EvaluateStudent(request, response);
});

app.post('/SubmitGrade', (request, response) => {
  dataHandler.SubmitGrade(request, response);
});

app.post('/GetMyCurrentCourseData', (request, response) => {
  dataHandler.GetMyCurrentCourseData(request, response);
});

app.post('/GetMyData', (request, response) => {
  dataHandler.GetMyData(request, response);
});
