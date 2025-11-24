/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('doctors');
  if (!exists) {
    await knex.schema.createTable('doctors', (table) => {
      table.increments('doctor_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.string('employee_code', 50).notNullable().unique();
      table.integer('department_id').unsigned().notNullable();
      table.string('specialization', 100).nullable();
      table.boolean('Active').defaultTo(false);

      // Foreign keys
      table.foreign('user_id').references('users.user_id').onDelete('CASCADE');
      table.foreign('department_id').references('departments.department_id').onDelete('CASCADE');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('doctors');
};
