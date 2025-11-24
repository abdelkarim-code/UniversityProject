/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('rooms');
  if (!exists) {
    await knex.schema.createTable('rooms', table => {
      table.increments('id').primary();
      table.string('room_number', 20).notNullable();
      table.string('block', 50).nullable();
      table.integer('floor').nullable();
      table.string('campus', 100).nullable();
      table.boolean('available').defaultTo(true);
      table.integer('capacity').defaultTo(30);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('rooms');
};