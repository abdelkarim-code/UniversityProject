/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('course_registrations');
  if (!exists) {
    await knex.schema.createTable('course_registrations', table => {
      table.increments('registration_id').primary();
      table.integer('student_id').unsigned().notNullable();
      table.integer('course_id').unsigned().notNullable();
      table.string('grade', 5).nullable();
      table.enum('status', ['enrolled','completed','dropped'], { useNative: true, enumName: 'registration_status' }).defaultTo('enrolled');
      table.integer('assignment_id').unsigned().nullable();
      table.integer('semester').unsigned().notNullable();

      // Foreign keys
      table.foreign('student_id').references('students.student_id').onDelete('CASCADE');
      table.foreign('course_id').references('courses.course_id').onDelete('CASCADE');
      table.foreign('assignment_id').references('course_assignments.assignment_id').onDelete('CASCADE').onUpdate('CASCADE');
      table.foreign('semester').references('semester.semester_id').onDelete('CASCADE').onUpdate('CASCADE');

    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('course_registrations');
};