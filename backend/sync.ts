import { sequelize } from "./src/db";
sequelize.sync({ alter: true }).then(() => {
  console.log("Database altered on the fly.");
  process.exit();
}).catch(console.error);
