const noteList = new NoteList();

document.addEventListener('DOMContentLoaded', function () {
    noteList.retrieveNotesFromStorage();
    noteList.generateNoteList();
});

document.getElementById('submit').addEventListener('click', () => {
    let note = new Note(document.getElementById("title").value,
        document.getElementById("content").value,
        document.getElementById("color").value,);
    noteList.addNote(note);
    noteList.generateNoteList();
});