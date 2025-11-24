/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('courses');
  if (!exists) {
    await knex.schema.createTable('courses', (table) => {
      table.increments('course_id').primary();
      table.integer('department_id').unsigned().notNullable();
      table.string('code', 50).notNullable();
      table.string('name', 150).notNullable();
      table.text('description').nullable();
      table.integer('credit_hours').notNullable();
      table.integer('level').notNullable();
      table.integer('semester').notNullable();
      table.integer('program_id').unsigned().notNullable();
      table.enu('course_category', ['major', 'major_elective', 'elective', 'remedial', 'lab', 'graduation_project']).defaultTo('major');

      // Foreign keys
      table.foreign('department_id').references('departments.department_id').onDelete('CASCADE');
      table.foreign('program_id').references('programs.program_id').onDelete('CASCADE').onUpdate('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('courses');
};
