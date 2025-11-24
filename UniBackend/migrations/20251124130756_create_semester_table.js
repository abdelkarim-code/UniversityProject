/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function(knex) {
  const exists=await knex.schema.hasTable("semester")
  if(!exists){
    await knex.schema.createTable('semester',table=>{
        table.increments("semester_id").primary()
        table.string("name",50).notNullable()
        table.string("academic_year",20).notNullable()
        table.date("start_date").notNullable()
        table.date("end_date").notNullable()
        table.enum("status",['upcoming','active','closed']).defaultTo("upcoming")

    })
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  await knex.schema.dropTableIfExists("semester")
};
