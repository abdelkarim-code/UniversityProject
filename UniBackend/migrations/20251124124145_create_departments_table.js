/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('departments');
  if (!exists) {
    await knex.schema.createTable('departments', (table) => {
      table.increments('department_id').primary();
      table.integer('faculty_id').unsigned().notNullable();
      table.string('name', 150).notNullable();
      table.string('code', 20).notNullable();
      table.text('description').nullable();

      // Foreign key
      table.foreign('faculty_id').references('faculties.faculty_id').onDelete('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('departments');
};
