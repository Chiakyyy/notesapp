const API_BASE = `http://${window.location.hostname}:5000`;

const statusEl = document.getElementById("status");
const formEl = document.getElementById("note-form");
const inputEl = document.getElementById("note-input");
const listEl = document.getElementById("notes-list");

function setStatus(msg) {
    statusEl.textContent = msg || "";
}

async function fetchNotes() {
    try {
        setStatus("Chargement des notes...");
        const res = await fetch(`${API_BASE}/notes`);
        const data = await res.json();
        renderNotes(data);
        setStatus("");
    } catch (err) {
        console.error(err);
        setStatus("Erreur lors du chargement des notes 😢");
    }
}

function renderNotes(notes) {
    listEl.innerHTML = "";
    if (!notes || notes.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucune note pour le moment.";
        listEl.appendChild(li);
        return;
    }

    notes.forEach((note) => {
        const li = document.createElement("li");

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";
        contentDiv.textContent = note.content;

        const metaDiv = document.createElement("div");
        metaDiv.className = "note-meta";
        metaDiv.textContent = new Date(note.created_at).toLocaleString();

        const leftDiv = document.createElement("div");
        leftDiv.appendChild(contentDiv);
        leftDiv.appendChild(metaDiv);

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "Supprimer";
        delBtn.onclick = () => deleteNote(note.id);

        li.appendChild(leftDiv);
        li.appendChild(delBtn);
        listEl.appendChild(li);
    });
}

async function addNote(content) {
    try {
        setStatus("Ajout de la note...");
        const res = await fetch(`${API_BASE}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });
        if (!res.ok) {
            throw new Error("Erreur API");
        }
        inputEl.value = "";
        await fetchNotes();
    } catch (err) {
        console.error(err);
        setStatus("Erreur lors de l'ajout de la note 😢");
    }
}

async function deleteNote(id) {
    try {
        setStatus("Suppression en cours...");
        const res = await fetch(`${API_BASE}/delete/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Erreur API");
        }
        await fetchNotes();
    } catch (err) {
        console.error(err);
        setStatus("Erreur lors de la suppression 😢");
    }
}

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = inputEl.value.trim();
    if (!value) {
        setStatus("La note ne peut pas être vide.");
        return;
    }
    addNote(value);
});

fetchNotes();