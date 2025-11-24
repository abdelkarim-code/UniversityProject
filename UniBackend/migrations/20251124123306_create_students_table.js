/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('students');
  if (!exists) {
    await knex.schema.createTable('students', (table) => {
      table.increments('student_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('student_code', 50).notNullable().unique();
      table.integer('department_id').unsigned().notNullable();
      table.integer('program_id').unsigned().notNullable();
      table.decimal('gpa', 2, 1).defaultTo(0.0);
      table.integer('current_year').defaultTo(1);

      // Foreign keys
      table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
      table.foreign('department_id').references('departments.department_id').onDelete('CASCADE');
      table.foreign('program_id').references('programs.program_id').onDelete('CASCADE');

      // Check constraint for GPA
      table.check('gpa >= 0.0 AND gpa <= 4.0');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  await knex.schema.dropTableIfExists('students');
};
