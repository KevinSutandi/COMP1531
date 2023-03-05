/**
 * NOTE: The only functions that you should write tests for are those defined
 * in the specification's interface (README.md).
 *
 * Your dataStore or any "helper" function you define should NOT be imported or
 * tested - your tests must work even if it is run against another student's
 * solution to this lab.
 */

import {
  academicCreate,
  academicDetails,
  academicsList,
  clear,
  courseCreate,
  courseDetails,
  courseEnrol,
  coursesList,
} from "./academics";

const ERROR = { error: expect.any(String) };
const AIdPASS = { academicId: expect.any(Number) };
const CIdPASS = { courseId: expect.any(Number) };

// It is important to clear the data store so that no tests will rely on the result of another.
// This beforeEach will run before every test in this test suite!
// This saves us from having to repeatedly clear the data store every time we start a new, independent test
// See [Jest's Setup and Teardown](https://jestjs.io/docs/setup-teardown) for more information
beforeEach(() => {
  clear();
});

// Testing the academicCreate function
describe("testing academicCreate", () => {
  test.each([
    { name: "", hobby: "dancing" },
    { name: "", hobby: "golf" },
    { name: "Kevin", hobby: "" },
    { name: "Dongo", hobby: "" },
    { name: "", hobby: "" },
  ])("error: ('$name', '$hobby')", ({ name, hobby }) => {
    expect(academicCreate(name, hobby)).toStrictEqual(ERROR);
  });
  test.each([
    { name: "Kevin", hobby: "dancing" },
    { name: "Nash", hobby: "golf" },
    { name: "AE420", hobby: "Fixing Cars" },
    { name: "Wiselly", hobby: "working 21" },
  ])("working: ('$name', '$hobby')", ({ name, hobby }) => {
    expect(academicCreate(name, hobby)).toStrictEqual(AIdPASS);
  });
});

// Testing the courseCreate function
describe("testing courseCreate", () => {
  // Variety of no names or no desc or both
  test.each([
    { name: "", desc: "something" },
    { name: "", desc: "something else" },
    { name: "2041COMP", desc: "" },
    { name: "", desc: "best course ever" },
    { name: "MATH1023", desc: "" },
    { name: "", desc: "" },
  ])("error: ('$name', '$desc') [no name or desc]", ({ name, desc }) => {
    const academic = academicCreate("Kevin", "Plants");
    expect(courseCreate(academic.academicId, name, desc)).toStrictEqual(ERROR);
  });

  // Invalid academicId
  test.each([
    { academicId: 3, name: "Kevin", desc: "something" },
    { academicId: 4, name: "Nash", desc: "something else" },
  ])(
    "error: ('$academicId' ,'$name', '$desc') [invalid academicId]",
    ({ academicId, name, desc }) => {
      expect(courseCreate(academicId, name, desc)).toStrictEqual(ERROR);
    }
  );

  test.each([
    { name: "COMP1531", desc: "yes" },
    { name: "2211MA", desc: "wise" },
    { name: "13PROIPH", desc: "good" },
    { name: "14PROMAX", desc: "best course ever" },
    { name: "AIRPORT3", desc: "GOOD33" },
    { name: "plane23", desc: "23 planes" },
  ])("working: ('$name', '$desc')", ({ name, desc }) => {
    const academic = academicCreate("Kevin", "Platypus");
    expect(courseCreate(academic.academicId, name, desc)).toStrictEqual(
      CIdPASS
    );
  });
});

describe("testing academicDetails", () => {
  // We can also use beforeEach inside of describe blocks.
  // This will only run before the tests written inside this describe block. Note that this
  // 'beforeEach' will run after the 'beforeEach' that we've written at the top of the file,
  // so it isn't necessary to call the 'clear' function again here.
  let academic;
  beforeEach(() => {
    academic = academicCreate("Kevin", "Golf");
  });

  test("invalid academicId test 1", () => {
    expect(
      academicDetails(academic.academicId + 1, academic.academicId)
    ).toStrictEqual(ERROR);
  });

  test("invalid academicId test 2", () => {
    expect(academicDetails("", academic.academicId)).toStrictEqual(ERROR);
  });

  test("invalid viewId test 1", () => {
    expect(
      academicDetails(academic.academicId, academic.academicId + 1)
    ).toStrictEqual(ERROR);
  });

  test("invalid viewId test 2", () => {
    expect(academicDetails(academic.academicId, "")).toStrictEqual(ERROR);
  });

  test("view self details", () => {
    expect(
      academicDetails(academic.academicId, academic.academicId)
    ).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: "Kevin",
        hobby: "Golf",
      },
    });
  });

  test("view other academics' details", () => {
    const academic2 = academicCreate("Wiselly", "Working");
    expect(
      academicDetails(academic.academicId, academic2.academicId)
    ).toStrictEqual({
      academic: {
        academicId: academic2.academicId,
        name: "Wiselly",
        hobby: "Working",
      },
    });
    expect(
      academicDetails(academic2.academicId, academic.academicId)
    ).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: "Kevin",
        hobby: "Golf",
      },
    });
  });
});

describe("testing courseDetails", () => {
  let academic;
  let academic2;
  let course;
  let course2;
  beforeEach(() => {
    academic = academicCreate("Kevin", "Golf");
    academic2 = academicCreate("Wiselly", "Working");
    course = courseCreate(academic.academicId, "COMP1531", "yes");
    course2 = courseCreate(academic2.academicId, "2211MA", "wise");
  });
  test("invalid academicId test", () => {
    expect(
      courseDetails(academic.academicId + 1, course.courseId)
    ).toStrictEqual(ERROR);
  });
  test("invalid courseId test", () => {
    expect(
      courseDetails(academic.academicId, course.courseId + 1)
    ).toStrictEqual(ERROR);
  });
  test("academicId not enrolled test 1", () => {
    expect(courseDetails(academic2.academicId, course.courseId)).toStrictEqual(
      ERROR
    );
  });

  test("academicId not enrolled test 2", () => {
    expect(courseDetails(academic.academicId, course2.courseId)).toStrictEqual(
      ERROR
    );
  });
  test("view details test 1", () => {
    expect(courseDetails(academic.academicId, course.courseId)).toStrictEqual({
      course: {
        courseId: course.courseId,
        name: "COMP1531",
        description: "yes",
        staffMembers: [
          {
            academicId: academic.academicId,
            name: "Kevin",
            hobby: "Golf",
          },
        ],
        allMembers: [
          {
            academicId: academic.academicId,
            name: "Kevin",
            hobby: "Golf",
          },
        ],
      },
    });
  });
  test("view details test 2", () => {
    expect(courseDetails(academic2.academicId, course2.courseId)).toStrictEqual(
      {
        course: {
          courseId: course2.courseId,
          name: "2211MA",
          description: "wise",
          staffMembers: [
            {
              academicId: academic2.academicId,
              name: "Wiselly",
              hobby: "Working",
            },
          ],
          allMembers: [
            {
              academicId: academic2.academicId,
              name: "Wiselly",
              hobby: "Working",
            },
          ],
        },
      }
    );
  });
});

describe("testing academicsList", () => {
  let academic;
  let academic2;
  let academic3;
  beforeEach(() => {
    academic = academicCreate("Kevin", "Golf");
    academic2 = academicCreate("Magnus", "chess");
    academic3 = academicCreate("Wiselly", "Working");
  });

  test("invalid academicId test", () => {
    expect(academicsList(academic.academicId + 1)).toStrictEqual(ERROR);
  });
  test("no academicId test", () => {
    expect(academicsList("")).toStrictEqual(ERROR);
  });
  test("valid test, return should be academic list", () => {
    expect(academicsList(academic.academicId)).toStrictEqual({
      academics: [
        {
          academicId: academic.academicId,
          academicName: "Kevin",
        },
        {
          academicId: academic2.academicId,
          academicName: "Magnus",
        },
        {
          academicId: academic3.academicId,
          academicName: "Wiselly",
        },
      ],
    });
  });
});

describe("testing coursesList", () => {
  let academic;
  let academic2;
  let academic3;
  let course1;
  let course2;
  let course3;
  beforeEach(() => {
    academic = academicCreate("Kevin", "Golf");
    academic2 = academicCreate("Magnus", "chess");
    academic3 = academicCreate("Wiselly", "Working");
    course1 = courseCreate(academic.academicId, "COMP1531", "yes");
    course2 = courseCreate(academic2.academicId, "2211MA", "wise");
    course3 = courseCreate(academic3.academicId, "AIRP2032", "Airport Moments");
  });

  test("invalid academicId test", () => {
    expect(coursesList(academic.academicId + 1)).toStrictEqual(ERROR);
  });
  test("no academicId test", () => {
    expect(coursesList("")).toStrictEqual(ERROR);
  });
  test("valid test 1, return should be simplified course list", () => {
    expect(coursesList(academic.academicId)).toStrictEqual({
      courses: [
        {
          courseId: course1.courseId,
          courseName: "COMP1531",
        },
        {
          courseId: course2.courseId,
          courseName: "2211MA",
        },
        {
          courseId: course3.courseId,
          courseName: "AIRP2032",
        },
      ],
    });
  });
  test("valid test 2, return should be simplified course list", () => {
    expect(coursesList(academic2.academicId)).toStrictEqual({
      courses: [
        {
          courseId: course1.courseId,
          courseName: "COMP1531",
        },
        {
          courseId: course2.courseId,
          courseName: "2211MA",
        },
        {
          courseId: course3.courseId,
          courseName: "AIRP2032",
        },
      ],
    });
  });
  test("valid test 3, return should be simplified course list", () => {
    expect(coursesList(academic3.academicId)).toStrictEqual({
      courses: [
        {
          courseId: course1.courseId,
          courseName: "COMP1531",
        },
        {
          courseId: course2.courseId,
          courseName: "2211MA",
        },
        {
          courseId: course3.courseId,
          courseName: "AIRP2032",
        },
      ],
    });
  });
});

describe("testing courseEnrol", () => {
  let academic, academic2, academic3, academic4;
  let course1, course2, course3;
  beforeEach(() => {
    academic = academicCreate("Kevin", "Golf");
    academic2 = academicCreate("Magnus", "chess");
    academic3 = academicCreate("Wiselly", "Working");
    academic4 = academicCreate("Bongo", "Coding");
    course1 = courseCreate(academic.academicId, "COMP1531", "yes");
    course2 = courseCreate(academic2.academicId, "2211MA", "wise");
    course3 = courseCreate(academic3.academicId, "AIRP2032", "Airport Moments");
  });
  test("invalid academicId test", () => {
    expect(
      courseEnrol(academic.academicId + 1, course2.courseId, false)
    ).toStrictEqual(ERROR);
  });
  test("invalid courseId test", () => {
    expect(
      courseEnrol(academic.academicId, course3.courseId + 1, false)
    ).toStrictEqual(ERROR);
  });
  test("academicId already enrolled test 1", () => {
    expect(
      courseEnrol(academic.academicId, course1.courseId, false)
    ).toStrictEqual(ERROR);
  });
  test("academicId already enrolled test 2", () => {
    expect(
      courseEnrol(academic2.academicId, course2.courseId, false)
    ).toStrictEqual(ERROR);
  });
  test("Enroll academic only as member", () => {
    expect(
      courseEnrol(academic.academicId, course2.courseId, false)
    ).toStrictEqual({});
  });
  test("Enroll academic  as staff", () => {
    expect(
      courseEnrol(academic2.academicId, course3.courseId, true)
    ).toStrictEqual({});
  });
});

describe("testing clear", () => {
  test("returns empty data", () => {
    expect(clear()).toStrictEqual({});
  });
});
