/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up =async function(knex) {
  await knex.schema.table("students",table=>{
    table.integer("max_allowed_credit").notNullable().defaultTo(19)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.table("students",table=>{
    table.dropColumn("max_allowed_credit")
  })
};
