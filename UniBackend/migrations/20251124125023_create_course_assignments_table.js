/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('course_assignments');
  if (!exists) {
    await knex.schema.createTable('course_assignments', table => {
      table.increments('assignment_id').primary();
      table.integer('course_id').unsigned().notNullable();
      table.integer('doctor_id').unsigned().notNullable();
      table.integer('semester').unsigned().notNullable();
      table.string('section', 10).nullable();
      table.string('schedule_time', 50).nullable();
      table.integer('room_id').unsigned().nullable();

      // Foreign keys
      table.foreign('course_id').references('courses.course_id').onDelete('CASCADE');
      table.foreign('doctor_id').references('doctors.doctor_id').onDelete('CASCADE');
      table.foreign('room_id').references('rooms.id').onDelete('SET NULL').onUpdate('CASCADE');
      table.foreign('semester').references('semester.semester_id');

    });
  }
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('course_assignments');
};