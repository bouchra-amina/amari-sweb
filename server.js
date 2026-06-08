const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg"); // Import du connecteur PostgreSQL

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FRONTEND
========================= */
app.use(express.static(path.join(__dirname)));

// Redirection automatique vers la page d'accueil (login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

/* =========================
   CONNEXION POSTGRESQL
========================= */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Obligatoire pour la sécurité sur Railway
    }
});

/* =========================
   ROUTES
========================= */

/* --- INSCRIPTION PATIENT --- */
app.post("/api/register", async (req, res) => {
    try {
        const { nom, age, sexe, wilaya, telephone, profession, maladies } = req.body;

        if (!nom || !age || !sexe) {
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }

        const queryText = `
            INSERT INTO patients (nom, age, sexe, wilaya, telephone, profession, maladies) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *;
        `;
        const values = [nom, age, sexe, wilaya, telephone, profession, maladies];
        
        const result = await pool.query(queryText, values);

        res.json({
            message: "Compte créé avec succès",
            patient: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
    }
});

/* --- ENVOI QUESTION PATIENT --- */
app.post("/api/question", async (req, res) => {
    try {
        const { patientId, sujet, message } = req.body;

        if (!sujet || !message) {
            return res.status(400).json({ message: "Question invalide" });
        }

        const queryText = `
            INSERT INTO questions (patient_id, sujet, message) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const values = [patientId || null, sujet, message];

        const result = await pool.query(queryText, values);

        res.json({
            message: "Question envoyée",
            question: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de l'envoi de la question" });
    }
});

/* --- GET QUESTIONS (MEDECIN) --- */
app.get("/api/questions", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM questions ORDER BY id DESC;");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la récupération" });
    }
});

/* --- REPONSE MEDECIN --- */
app.post("/api/repondre", async (req, res) => {
    try {
        const { questionId, reponse } = req.body;

        const queryText = `
            UPDATE questions 
            SET reponse = $1, status = 'Répondu' 
            WHERE id = $2 
            RETURNING *;
        `;
        const result = await pool.query(queryText, [reponse, questionId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question introuvable" });
        }

        res.json({
            message: "Réponse enregistrée",
            question: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de la réponse" });
    }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
