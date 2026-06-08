const express = require("express");
const cors = require("cors");
const path = require("path");

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

/* =========================
   FAKE DATABASE (TEMPORAIRE)
========================= */
let patients = [];
let questions = [];

/* =========================
   ROUTES
========================= */

/* --- INSCRIPTION PATIENT --- */
app.post("/api/register", (req, res) => {
    try {
        const { nom, age, sexe, wilaya, telephone, profession, maladies } = req.body;

        if (!nom || !age || !sexe) {
            return res.status(400).json({ message: "Champs obligatoires manquants" });
        }

        const patient = {
            id: patients.length + 1,
            nom,
            age,
            sexe,
            wilaya,
            telephone,
            profession,
            maladies
        };

        patients.push(patient);

        res.json({
            message: "Compte créé avec succès",
            patient
        });

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* --- ENVOI QUESTION PATIENT --- */
app.post("/api/question", (req, res) => {
    try {
        const { patientId, sujet, message } = req.body;

        if (!sujet || !message) {
            return res.status(400).json({ message: "Question invalide" });
        }

        const question = {
            id: questions.length + 1,
            patientId,
            sujet,
            message,
            status: "En attente",
            reponse: ""
        };

        questions.push(question);

        res.json({
            message: "Question envoyée",
            question
        });

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* --- GET QUESTIONS (MEDECIN) --- */
app.get("/api/questions", (req, res) => {
    res.json(questions);
});

/* --- REPONSE MEDECIN --- */
app.post("/api/repondre", (req, res) => {
    try {
        const { questionId, reponse } = req.body;

        const question = questions.find(q => q.id == questionId);

        if (!question) {
            return res.status(404).json({ message: "Question introuvable" });
        }

        question.reponse = reponse;
        question.status = "Répondu";

        res.json({
            message: "Réponse enregistrée",
            question
        });

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
