document.getElementById("registerForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const data = {
        nom: document.querySelector('input[type="text"]').value,
        age: document.querySelector('input[type="number"]').value,
        sexe: document.querySelector('select').value,
        wilaya: document.querySelectorAll('input[type="text"]')[1].value,
        telephone: document.querySelector('input[type="tel"]').value,
        profession: document.querySelectorAll('input[type="text"]')[2].value,
        maladies: document.querySelector('textarea').value
    };

    const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    document.getElementById("message").innerText = result.message;

    console.log(result);
});