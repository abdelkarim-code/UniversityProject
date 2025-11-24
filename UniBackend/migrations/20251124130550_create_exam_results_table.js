/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('exam_results');
  if (!exists) {
    await knex.schema.createTable('exam_results', table => {
      table.increments('result_id').primary();
      table.integer('exam_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.decimal('marks_obtained', 5, 2).nullable();
      table.timestamp('graded_at').defaultTo(knex.fn.now()).nullable();

      // Foreign keys
      table.foreign('exam_id').references('exams.exam_id').onDelete('CASCADE');
      table.foreign('student_id').references('students.student_id').onDelete('CASCADE');

    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('exam_results');
};
