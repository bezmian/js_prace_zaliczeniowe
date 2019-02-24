
class NoteList {
    constructor() {
        this.notes = [];

    }

    retrieveNotesFromStorage() {
        let retrievedNotes = window.localStorage.getItem("notes");
        if (retrievedNotes === undefined || retrievedNotes == null) {
            this.notes = [];
        } else {
            this.notes = JSON.parse(retrievedNotes);
        }
    }

    addNote(note) {
        this.notes.push(note);
        this.saveNotes();
    }

    saveNotes() {
        window.localStorage.setItem("notes", JSON.stringify(this.notes));
    }

    generateNoteList() {
        const notesDiv = document.getElementById("notes");
        while (notesDiv.firstChild) {
            notesDiv.removeChild(notesDiv.firstChild);
        }

        let sortedNotes = this.notes.sort(function (a, b) {
            return b.pinned - a.pinned
        });

        sortedNotes.forEach(note => {
            let div = document.createElement("div");
            div.className = "note";
            div.style.background = note.color;
            div.style.color = invertColor(note.color);
            let title = document.createElement("p");
            title.className = "title";
            title.appendChild(document.createTextNode("Tytuł: " + note.title));

            let content = document.createElement("p");
            content.className = "content";
            content.appendChild(document.createTextNode("Treść: " + note.content));

            let createdTime = document.createElement("p");
            createdTime.className = "createdTime";
            const newDate = new Date();
            newDate.setTime(note.createdTime);
            createdTime.appendChild(document.createTextNode("Utworzono: " + newDate.toUTCString()));

            let label = document.createElement("label");
            label.innerHTML = "Przypnij";
            let pin = document.createElement("input");
            pin.setAttribute("type", "checkbox");
            pin.checked = note.pinned;
            pin.addEventListener('change', function () {
                note.pinned = this.checked;
                noteList.saveNotes();
                noteList.generateNoteList();
            });

            label.appendChild(pin);

            div.appendChild(title);
            div.appendChild(content);
            div.appendChild(createdTime);
            div.appendChild(label);

            document.getElementById("notes").appendChild(div);
        })
    }
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    const r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
}