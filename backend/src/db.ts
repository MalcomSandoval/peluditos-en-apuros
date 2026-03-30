import { Sequelize, DataTypes, Model } from "sequelize";

const sequelize = new Sequelize("peluditos", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "ADOPTER" },
  volunteerStatus: { type: DataTypes.STRING, defaultValue: "NONE" },
}, { sequelize, modelName: "user" });

class Animal extends Model {}
Animal.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.STRING, allowNull: false },
  breed: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  healthStatus: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  photos: { type: DataTypes.TEXT('long'), allowNull: false }, // Store Base64 strings natively
  status: { type: DataTypes.STRING, defaultValue: "AVAILABLE" },
}, { sequelize, modelName: "animal" });

class AdoptionRequest extends Model {}
AdoptionRequest.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  housingType: { type: DataTypes.STRING, allowNull: false },
  experience: { type: DataTypes.TEXT, allowNull: false },
  questionnaire: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: "PENDING" },
}, { sequelize, modelName: "adoptionRequest" });

class Contract extends Model {}
Contract.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  contractUrl: { type: DataTypes.STRING, allowNull: false },
  signedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: "contract" });

User.hasMany(AdoptionRequest);
AdoptionRequest.belongsTo(User);

Animal.hasMany(AdoptionRequest);
AdoptionRequest.belongsTo(Animal);

AdoptionRequest.hasOne(Contract);
Contract.belongsTo(AdoptionRequest);

export { sequelize, User, Animal, AdoptionRequest, Contract };
