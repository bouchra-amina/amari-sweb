let selectedQuestionId = null;

document.addEventListener("DOMContentLoaded", () => {
    loadQuestions();
});


// =========================
// CHARGER QUESTIONS (API)
// =========================
async function loadQuestions() {
    try {
        const res = await fetch("http://localhost:3000/api/questions");
        const questions = await res.json();

        const container = document.getElementById("questionsContainer");
        container.innerHTML = "";

        questions.forEach(q => {
            container.innerHTML += `
                <div class="card">
                    <h3>Patient ID: ${q.patientId}</h3>

                    <p><strong>Sujet :</strong> ${q.sujet}</p>
                    <p>${q.message}</p>

                    <div class="status">
                        Statut : ${q.status}
                    </div>

                    <p><b>Réponse :</b> ${
                        q.reponse ? q.reponse : "Pas encore répondu"
                    }</p>

                    <button class="btn" onclick="openModal(${q.id}, \`${q.message}\`)">
                        Répondre
                    </button>
                </div>
            `;
        });

    } catch (err) {
        console.error("Erreur loadQuestions:", err);
    }
}


// =========================
// OUVRIR MODAL
// =========================
function openModal(id, message) {
    selectedQuestionId = id;

    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("questionText").innerText = message;
}


// =========================
// FERMER MODAL
// =========================
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("responseText").value = "";
}


// =========================
// ENVOYER RÉPONSE
// =========================
async function sendResponse() {

    const response = document.getElementById("responseText").value;

    if (!response) return alert("Écris une réponse");

    try {
        const res = await fetch("http://localhost:3000/api/repondre", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                questionId: selectedQuestionId,
                reponse: response
            })
        });

        const result = await res.json();

        alert(result.message);

        closeModal();
        loadQuestions();

    } catch (err) {
        console.error("Erreur sendResponse:", err);
    }
}