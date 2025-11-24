/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('prerequisite_courses');
  if (!exists) {
    await knex.schema.createTable('prerequisite_courses', table => {
      table.integer('course_id').unsigned().notNullable();
      table.integer('prerequisite_course_id').unsigned().notNullable();
      table.primary(['course_id', 'prerequisite_course_id']);
      // Foreign keys
      table.foreign('course_id').references('courses.course_id').onDelete('CASCADE');
      table.foreign('prerequisite_course_id').references('courses.course_id').onDelete('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('prerequisite_courses');
};
