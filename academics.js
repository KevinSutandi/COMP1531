/**
 * @module academics
 */

/**
 * Create your dataStore here. The design is entirely up to you!
 * One possible starting point is
 *
 * let/const dataStore = {
 *   academics: [],
 *   courses: []
 * }
 *
 * and adding to the dataStore the necessary information when the
 * "create" functions are used.
 *
 * You will also need to modify the clear function accordingly
 * - we recommend you complete clear() at the bottom first!
 *
 * Do not export the dataStore. Your tests should not use/rely on
 * how dataStore is structured - only what goes in and out of the
 * defined functions from the interface.
 */

const dataStore = {
  academics: [
    {
      academicId: 1,
      name: "Computer Science",
      hobby: "Coding",
    },
  ],
  courses: [
    {
      academicId: 1,
      courseId: 3,
      name: "Programming",
      description: "description",
      staffMembers: [
        {
          academicId: 1,
          name: "John Doe",
          hobby: "coding",
        },
      ],
      allMembers: [
        {
          academicId: 1,
          name: "John Doe",
          hobby: "coding",
        },
      ],
    },
  ],
};

/**
 * Complete the functions from the interface table.
 * As an optional activity, you can document your functions
 * similar to how academicCreate has been done.
 *
 * A reminder to return { error: 'any relevant error message of your choice' }
 * for error cases.
 */

/**
 * Creates a new academic, returning an object containing
 * a unique academic id
 *
 * @param {string} name
 * @param {string} hobby
 * @returns {{academicId: number}}
 */
export function academicCreate(name, hobby) {
  if (name === "") {
    return { error: "name is required" };
  }
  if (hobby === "") {
    return { error: "hobby is required" };
  }

  let newAcademicId = Math.round(Math.random() * 1000000);

  for (newAcademicId in dataStore.academics) {
    newAcademicId = Math.round(Math.random() * 1000000);
  }

  dataStore.academics.push({
    academicId: newAcademicId,
    name: name,
    hobby: hobby,
  });

  return { academicId: newAcademicId };
}

/**
 * Creates a new course, returning an object containing
 * the course id
 *
 * @param {number} academicId
 * @param {string} name
 * @param {string} description
 * @returns {{courseId: number}}
 */
export function courseCreate(academicId, name, description) {
  function findAId(academics) {
    return academics.academicId === academicId;
  }

  if (academicId === "") {
    return { error: "academicId is required" };
  }

  if (dataStore.academics.find(findAId) === undefined) {
    return {
      error: academicId + " is not in " + "database",
    };
  }

  if (name === "") {
    return { error: "name is required" };
  }
  if (description === "") {
    return { error: "description is required" };
  }

  let newCourseId = Math.round(Math.random() * 10000);

  for (newCourseId in dataStore.courses) {
    newCourseId = Math.round(Math.random() * 10000);
  }

  const userDetails = dataStore.academics.find(findAId);

  dataStore.courses.push({
    courseId: newCourseId,
    name: name,
    description: description,
    staffMembers: [
      {
        academicId: userDetails.academicId,
        name: userDetails.name,
        hobby: userDetails.hobby,
      },
    ],
    allMembers: [
      {
        academicId: userDetails.academicId,
        name: userDetails.name,
        hobby: userDetails.hobby,
      },
    ],
  });

  return { courseId: newCourseId };
}

/**
 * Fucntion returns the data of a partucilar academic student
 *
 *  @param {number} academicId
 * @param {number} academicToViewId
 * @returns {{academicId: number,name: string, hobby: string}}
 *
 */
export function academicDetails(academicId, academicToViewId) {
  function findAId(academics) {
    return academics.academicId === academicId;
  }
  function findAIdView(academics) {
    return academics.academicId === academicToViewId;
  }

  if (academicId === "") {
    return { error: "academicId is required" };
  }
  if (academicToViewId === "") {
    return { error: "academicToViewId is required" };
  }
  if (dataStore.academics.find(findAId) === undefined) {
    return {
      error: academicId + " is not in academics database",
    };
  }
  if (dataStore.academics.find(findAIdView) === undefined) {
    return {
      error: academicToViewId + " is not in academics database",
    };
  }
  const view = dataStore.academics.find(findAIdView);
  return {
    academic: {
      academicId: view.academicId,
      name: view.name,
      hobby: view.hobby,
    },
  };
}

/**
 * Function returns the data of a particular course but makes sure
 * to have valid academicId
 * @param {number} academicId
 * @param {number} courseId
 * @returns {course:[
 *  courseId: number,
 *  name: string,
 *  description: string,
 *  staffMembers:[],
 *  allMembers:[],
 * ]}
 *
 */
export function courseDetails(academicId, courseId) {
  function findAId(academics) {
    return academics.academicId === academicId;
  }
  function findAIdCourse(courses) {
    return courses.courseId === courseId;
  }
  if (dataStore.academics.find(findAId) === undefined) {
    return {
      error: academicId + " is not in academics database",
    };
  }
  if (dataStore.courses.find(findAIdCourse) === undefined) {
    return {
      error: courseId + " is not in courses database",
    };
  }

  const course = dataStore.courses.find(findAIdCourse);

  for (let members in course.allMembers) {
    if (course.allMembers[members].academicId === academicId) {
      return {
        course: {
          courseId: course.courseId,
          name: course.name,
          description: course.description,
          staffMembers: course.staffMembers,
          allMembers: course.allMembers,
        },
      };
    }
  }

  return {
    error: academicId + " is not enrolled in course",
  };
}
/**
 * Function returns an object containing brief details about
 * all the academics in the database
 *
 * @param {number} academicId
 * @returns {academics:[
 *  academicId: number,
 *  academicName: string,
 * ]}
 *
 */
export function academicsList(academicId) {
  function findAId(academics) {
    return academics.academicId === academicId;
  }

  if (dataStore.academics.find(findAId) === undefined) {
    return {
      error: academicId + " is not in academics database",
    };
  }

  const newAcademicArray = [];

  for (let academic in dataStore.academics) {
    newAcademicArray.push({
      academicId: dataStore.academics[academic].academicId,
      academicName: dataStore.academics[academic].name,
    });
  }

  return {
    academics: newAcademicArray,
  };
}

/**
 * Function returns an object containing brief details about
 * all the courses in the database
 *
 * @param {number} academicId
 * @returns {courses:[
 *  courseId: number,
 *  courseName: string,
 * ]}
 *
 */
export function coursesList(academicId) {
  function findAId(academics) {
    return academics.academicId === academicId;
  }

  if (dataStore.academics.find(findAId) === undefined) {
    return {
      error: academicId + " is not in academics database",
    };
  }

  const newCourseArray = [];
  for (let course in dataStore.courses) {
    newCourseArray.push({
      courseId: dataStore.courses[course].courseId,
      courseName: dataStore.courses[course].name,
    });
  }

  return {
    courses: newCourseArray,
  };
}

/**
 * Adds an academic to a course.
 * academic can also be a staff depending on the boolean
 * Members that are already enrolled in the course
 * cannot be re-enrolled
 *
 * @param {number} academicId
 * @param {number} courseId
 * @param {boolean} isStaff
 * @returns {}
 *
 */
export function courseEnrol(academicId, courseId, isStaff) {
  function findAId(academics) {
    return academics.academicId === academicId;
  }
  function findAIdCourse(courses) {
    return courses.courseId === courseId;
  }
  const picked = dataStore.courses.indexOf(
    dataStore.courses.find(findAIdCourse)
  );
  const academic = dataStore.academics.find(findAId);

  if (dataStore.academics.find(findAId) === undefined) {
    return {
      error: academicId + " is not in academics database",
    };
  }
  if (dataStore.courses.find(findAIdCourse) === undefined) {
    return {
      error: courseId + " is not in courses database",
    };
  }

  for (let members in dataStore.courses[picked].allMembers) {
    if (dataStore.courses[picked].allMembers[members].academicId === academicId) {
      return {
        error: academicId + " is already enrolled in course",
      };
    }
  }
  if (isStaff) {
    dataStore.courses[picked].staffMembers.push({
      academicId: academic.academicId,
      name: academic.name,
      hobby: academic.hobby,
    });
  }
  dataStore.courses[picked].allMembers.push({
    academicId: academic.academicId,
    name: academic.name,
    hobby: academic.hobby,
  });
  return {};
}

export function clear() {
  dataStore.academics = [];
  dataStore.courses = [];
  return {};
}
