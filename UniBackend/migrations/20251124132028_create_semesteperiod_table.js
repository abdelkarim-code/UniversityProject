/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// 'CREATE TABLE `semesterperiod` (
//   `period_id` int NOT NULL AUTO_INCREMENT,
//   `semester_id` int NOT NULL,
//   `period_type` enum(''registration'',''add_drop'',''late_registration'') NOT NULL,
//   `start_date` date NOT NULL,
//   `end_date` date NOT NULL,
//   PRIMARY KEY (`period_id`),
//   KEY `semester_id` (`semester_id`),
//   CONSTRAINT `semesterperiod_ibfk_1` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`semester_id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci'
exports.up = async function(knex) {
  const exists=await knex.schema.hasTable("semesterperiod")
  if(!exists){
    await knex.schema.createTable("semesterperiod",table=>{
        table.increments("period_id").primary()
        table.integer("semester_id").notNullable().unsigned()
        table.enum('period_type',['registration','add_drop','late_registration']).notNullable()
        table.date("start_date").notNullable()
        table.date("end_date").notNullable()
        table.foreign("semester_id").references("semester.semester_id").onDelete('CASCADE')
    })
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("semesterperiod")
};
