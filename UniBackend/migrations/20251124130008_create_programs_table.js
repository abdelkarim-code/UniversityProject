/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('programs');
  if (!exists) {
    await knex.schema.createTable('programs', table => {
      table.increments('program_id').primary();
      table.integer('department_id').unsigned().notNullable();
      table.string('name', 150).notNullable();
      table.integer('duration_years').notNullable();
      table.string('degree_type', 50).nullable();
      table.decimal('credit_price', 10, 2).nullable();
      table.integer('total_credits').nullable();

      // Foreign key
      table.foreign('department_id').references('departments.department_id').onDelete('CASCADE');

      
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('programs');
};
