document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // LOAD QUESTIONS AU CHARGEMENT
    // =========================
    loadQuestions();

    // =========================
    // ENVOYER UNE QUESTION
    // =========================
    const form = document.getElementById("questionForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            patientId: 1, // plus tard : dynamique via login
            sujet: document.getElementById("subject").value,
            message: document.getElementById("question").value
        };

        try {
            const res = await fetch("http://localhost:3000/api/question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            document.getElementById("message").innerText = result.message;

            form.reset();

            loadQuestions();

        } catch (error) {
            console.error("Erreur:", error);
            document.getElementById("message").innerText =
                "Erreur lors de l'envoi";
        }
    });

});

// =========================
// CHARGER QUESTIONS PATIENT
// =========================
async function loadQuestions() {

    try {
        const res = await fetch("http://localhost:3000/api/questions");
        const data = await res.json();

        const container = document.getElementById("questionsList");
        container.innerHTML = "";

        data.forEach(q => {
            container.innerHTML += `
                <div class="question">
                    <strong>${q.sujet}</strong>
                    <p>${q.message}</p>

                    <div class="status">
                        Statut : ${q.status}
                    </div>

                    <hr>

                    <p>
                        <b>Réponse :</b> 
                        ${q.reponse ? q.reponse : "Pas encore répondu"}
                    </p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Erreur loadQuestions:", error);
    }
}