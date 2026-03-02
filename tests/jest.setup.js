beforeAll(async () => {
  await pool.query(`
    TRUNCATE TABLE 
      course_progress,
      enrollments,
      favorites,
      courses,
      users
    RESTART IDENTITY CASCADE
  `);
});