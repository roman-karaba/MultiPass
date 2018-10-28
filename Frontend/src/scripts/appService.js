const serverUrl='http://127.0.0.1:3000';

export async function Login(credentials){
  try {
    const response = await fetch(`${serverUrl}/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
};

export async function SignUp(credentials) {
  try {
    const response = await fetch(`${serverUrl}/SignUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
}

export async function IsLoggedIn(){
  try {
    const token = localStorage.getItem('jwt');
    if (token){
      const response = await fetch(`${serverUrl}/Auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token })
      });
      return (response.status === 200);
    } else {
      localStorage.removeItem('jwt');
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function CreateCourse(data){
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn){
      const formData = data;
      formData.append("jwt", localStorage.getItem('jwt'));
      const response = await fetch(`${serverUrl}/CreateCourse`, {
        method: 'POST',
        body: formData
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (err) {
    console.log(err);
    return { status: 500 };
  }
}

export async function GetMyCourseData(){
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/GetMyCourses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
}

export async function GetAllCourseData() {
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/GetAllCourses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
}

export async function GetAssignment(_target) {
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/GetAssignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token, target: _target })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
}

export async function EnrollMe(_course) {
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/EnrollMe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token, course: _course })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (error) {
    console.log(error);
    return { status: 500 }
  } 
}

export async function getStudentData(_courseId, _courseSemester, _students){
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/GetStudentData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          jwt: token,
          courseId: _courseId,
          courseSemester: _courseSemester,
          students: _students
        })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (error) {
    console.log(error);
    return { status: 500 }
  }
}

export async function SubmitStudentEvaluation(_student, _semester, _id){
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/SubmitStudentEvaluation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: _student,
          courseSemester: _semester,
          courseId: _id,
          jwt: token
        })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (err) {
    console.log(err);
    return { status: 500 }
  }
}

export async function SubmitGrade(_studentId, _grade, _semester, _id) {
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/SubmitGrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: _studentId,
          courseSemester: _semester,
          courseId: _id,
          grade: _grade,
          jwt: token
        })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (err) {
    console.log(err);
    return { status: 500 }
  }
}

export async function GetMyCurrentCourseData(_courseId, _courseSemester){
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/GetMyCurrentCourseData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt: token,
          courseId: _courseId,
          courseSemester: _courseSemester
        })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (err) {
    console.log(err);
    return { status: 500 }
  }
}

export async function GetMyData() {
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/GetMyData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (err) {
    console.log(err);
    return { status: 500 }
  }
}

export async function WithdrawMe(_course) {
  try {
    const loggedIn = await IsLoggedIn();
    if (loggedIn) {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${serverUrl}/Withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: token, course: _course })
      });
      return response;
    } else {
      return { status: 401, message: 'Session Expired' }
    }
  } catch (err) {
    console.log(err);
    return { status: 500 }
  }
}