export default {
  async calculateAverages(data: any) {
    const { grades } = data;
    let averageGradePoints = 0;
    let averageGradePercentages = 0;

    if (grades && grades.homework) {
      const homeworkGrades = Object.keys(grades.homework)
        .filter((key) => key.startsWith('hN'))
        .map((key) => grades.homework[key])
        .filter((grade) => typeof grade === 'number');
      averageGradePoints = homeworkGrades.length
        ? Math.round(
            homeworkGrades.reduce((a: number, b: number) => a + b, 0) / homeworkGrades.length
          )
        : 0;
    }

    if (grades && grades.tests) {
      const testGrades = Object.keys(grades.tests)
        .filter((key) => key.startsWith('testN'))
        .map((key) => grades.tests[key])
        .filter((grade) => typeof grade === 'number');
      averageGradePercentages = testGrades.length
        ? Math.round(
            (testGrades.reduce((a: number, b: number) => a + b, 0) / testGrades.length) * 100
          )
        : 0;
    }

    return { averageGradePoints, averageGradePercentages };
  },
};
