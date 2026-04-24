// scripts/setup.js
const fs = require("fs");
const path = require("path");

console.log("Запуск настройки...");

const envPath = path.join(__dirname, "..", ".env");
const examplePath = path.join(__dirname, "..", ".env.example");


if (fs.existsSync(envPath)) {
  console.log("- (!) Файл .env уже существует — создание пропущено.");
  process.exit(0);
}

// Загрузить файл .env.example
if (!fs.existsSync(examplePath)) {
  console.error("- Файл .env.example не найден. Не удается создать файл .env.");
  process.exit(1);
}

let exampleContent = fs.readFileSync(examplePath, "utf8");

// Сгенерировать безопасные значения по умолчанию
const generatedEnv = exampleContent
  .replace(/DATABASE_URL=.*/g, 'DATABASE_URL="postgresql://neondb_owner:npg_NOeqdAJV5K2b@ep-dawn-voice-amf2z5e4-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"')
  .replace(/JWT_SECRET=.*/g, `JWT_SECRET="${generateRandomSecret()}"`)
  .replace(/PORT=.*/g, "PORT=3000");


fs.writeFileSync(envPath, generatedEnv);

console.log("- Файл .env создан успешно.");
console.log("- Теперь вы можете выполнить: npm install && npm run dev");




function generateRandomSecret() {
  return [...Array(32)]
    .map(() => Math.random().toString(36)[2])
    .join("");
}
