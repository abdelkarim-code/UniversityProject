/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('faculties');
  if (!exists) {
    await knex.schema.createTable('faculties', (table) => {
      table.increments('faculty_id').primary();
      table.string('name', 150).notNullable();
      table.text('description').nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('faculties');
};
