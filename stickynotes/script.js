const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
renderNotes();

addBtn.addEventListener("click", () => {
    const noteText = noteInput.value.trim();
    if (!noteText) return;

    const newNote = {
        text: noteText,
        x: 50 + Math.random() * 200,
        y: 100 + Math.random() * 200
    };
    notes.push(newNote);
    noteInput.value = "";
    saveNotes();
    renderNotes();
});

function renderNotes() {
    document.querySelectorAll(".note").forEach(n => n.remove());

    notes.forEach((note, index) => {
        const noteEl = document.createElement("div");
        noteEl.classList.add("note");
        noteEl.style.left = note.x + "px";
        noteEl.style.top = note.y + "px";
        noteEl.innerHTML = `
            <span>${note.text}</span>
            <button onclick="deleteNote(${index})">✖</button>
        `;

        makeDraggable(noteEl, index);
        document.body.appendChild(noteEl);
    });
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function makeDraggable(el, index) {
    let offsetX, offsetY, isDown = false;

    el.addEventListener("mousedown", (e) => {
        isDown = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.cursor = "grabbing";
        el.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        el.style.left = x + "px";
        el.style.top = y + "px";

        notes[index].x = x;
        notes[index].y = y
        saveNotes();
    });

    document.addEventListener("mouseup", () => {
        if (!isDown) return;
        isDown = false;
        el.style.cursor = "grab";
    });
}
