/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('exams');
  if (!exists) {
    await knex.schema.createTable('exams', table => {
      table.increments('exam_id').primary();
      table.integer('course_id').unsigned().notNullable();
      table.integer('semester_id').unsigned().notNullable();
      table.enum('exam_type', ['midterm', 'final', 'quiz', 'assignment']).notNullable();
      table.date('date').notNullable();
      table.integer('duration_minutes').nullable();
      table.integer('total_marks').notNullable();
      table.boolean('publish_exam').notNullable().defaultTo(false);

      // Foreign keys
      table.foreign('course_id').references('courses.course_id').onDelete('CASCADE');
      table.foreign('semester_id').references('semester.semester_id').onDelete('CASCADE');

    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('exams');
};

