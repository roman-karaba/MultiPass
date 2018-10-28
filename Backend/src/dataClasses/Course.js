module.exports.Course = class {
  constructor(obj) {
    this.id = obj.courseId;
    this.type = obj.courseType;
    this.name = obj.courseName;
    this.studentCount = parseInt(obj.studentCount, 10);
    this.semester = obj.courseSemester;
    this.ects = parseInt(obj.courseEcts, 10);
    this.description = obj.courseDescription;
    this.enrollmentDate = obj.courseEnrollmentDate;
    this.nameAbr = obj.courseNameAbr;
    this.grade1 = parseInt(obj.grade1, 10);
    this.grade2 = parseInt(obj.grade2, 10);
    this.grade3 = parseInt(obj.grade3, 10);
    this.grade4 = parseInt(obj.grade4, 10);
    this.assignmentCount = parseInt(obj.assignmentCount, 10);
    this.assignmentGradePercentage = parseInt(obj.assignmentGradePercentage, 10);
    this.testCount = parseInt(obj.testCount, 10);
    this.testGradePercentage = parseInt(obj.testGradePercentage, 10);
    this.students = [];

    const _requirements = obj.courseRequirements.replace(new RegExp(' ', 'g'), '').split(',');
    if ((_requirements.length === 1) && (_requirements[0] === '')) {
      this.requirements = [];
    } else {
      this.requirements = _requirements;
    }

    for (let i = 1; i < (this.assignmentCount + 1); i++) {
      this[`assignmentPoints${i}`] = parseInt(obj[`assignmentPoints${i}`], 10);
      this[`assignmentDate${i}`] = obj[`assignmentDate${i}`];
    }
    for (let i = 1; i < (this.testCount + 1); i++) {
      this[`testPoints${i}`] = parseInt(obj[`testPoints${i}`], 10);
    }
  }
};
