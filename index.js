import mysql from "mysql2";
import { faker } from "@faker-js/faker";

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Satyam@123",
    database: "delta_app",
});

const getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),  // Fixed deprecated method
        faker.internet.email(),
        faker.internet.password(),
    ];
};

const q = "INSERT INTO user (id, username, email, password) VALUES ?";
const data = [];

for (let i = 0; i < 100; i++) { // Loop should start from 0 to get 100 entries
    data.push(getRandomUser());
}

connection.query(q, [data], (err, result) => {
    if (err) {
        console.error("Error inserting data:", err);
    } else {
        console.log("Data inserted successfully:", result);
    }
    connection.end();  // Close connection after query finishes
});
