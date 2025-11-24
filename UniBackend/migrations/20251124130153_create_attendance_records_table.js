/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('attendance_records');
  if (!exists) {
    await knex.schema.createTable('attendance_records', table => {
      table.increments('attendance_id').primary();
      table.integer('assignment_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.date('date').notNullable();
      table.enum('status', ['present', 'absent']).notNullable();

      // Foreign keys
      table.foreign('assignment_id').references('course_assignments.assignment_id').onDelete('CASCADE').onUpdate('CASCADE');
      table.foreign('student_id').references('students.student_id').onDelete('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('attendance_records');
};
