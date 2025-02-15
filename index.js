import mysql from "mysql2";
import { faker } from "@faker-js/faker";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "delta_app",
});

connection.connect((err) => {
    if (err) {
        console.error("MySQL connection failed: ", err);
        return;
    }
    console.log("Connected to MySQL successfully!");

    connection.query("SHOW TABLES", (err, result) => {
        if (err) {
            console.error("Error fetching tables: ", err);
        } else {
            console.log("Tables: ", result);
        }

        connection.end();
    });
});

const getRandomUser = () => ({
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
});

console.log("Generated User: ", getRandomUser());
