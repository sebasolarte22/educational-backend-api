beforeAll(async () => {
  await pool.query(`
    TRUNCATE TABLE
      lesson_progress,
      lessons,
      sections,
      enrollments,
      favorites,
      refresh_tokens,
      courses,
      users
    RESTART IDENTITY CASCADE;
  `);
});