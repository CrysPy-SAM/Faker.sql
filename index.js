import mysql from "mysql2";
import express from "express";
import { faker } from "@faker-js/faker";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Satyam@123",
    database: "delta_app",
});

connection.connect((err) => {
    if (err) console.error("Database Connection Failed:", err);
    else console.log("✅ Connected to MySQL Database.");
});

app.get("/", (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 5;
    let offset = (page - 1) * limit;

    let countQuery = "SELECT COUNT(*) AS userCount FROM user";
    let dataQuery = "SELECT id, username, email FROM user LIMIT ? OFFSET ?";

    connection.query(countQuery, (err, countResult) => {
        if (err) return res.send("DB Error");

        connection.query(dataQuery, [limit, offset], (err, users) => {
            if (err) return res.send("Error fetching users");

            let totalUsers = countResult[0].userCount;
            let totalPages = Math.ceil(totalUsers / limit);

            res.render("index", { userCount: totalUsers, users, page, totalPages });
        });
    });
});

app.get("/search", (req, res) => {
    let query = req.query.q?.trim();
    if (!query) return res.json([]);

    let searchQuery = `
        SELECT id, username, email FROM user 
        WHERE username LIKE ? OR email LIKE ? 
        LIMIT 10
    `;
    connection.query(searchQuery, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) return res.json([]);
        res.json(results);
    });
});

app.post("/add-user", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.json({ success: false });

    const q = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";

    connection.query(q, [username, email, password], (err, result) => {
        if (err) return res.json({ success: false });

        connection.query("SELECT id, username, email FROM user WHERE id = ?", [result.insertId], (err, user) => {
            if (err) return res.json({ success: false });
            res.json({ success: true, user: user[0] });
        });
    });
});

app.post("/delete-user/:id", (req, res) => {
    let userId = req.params.id;
    const deleteQuery = "DELETE FROM user WHERE id = ?";

    connection.query(deleteQuery, [userId], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

app.listen(8080, () => console.log("🚀 Server running at http://localhost:8080"));
