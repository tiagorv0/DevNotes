const notesContainer = document.querySelector("#notes-container");

const noteInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

// funcoes
function addNote(){
    const notes = getNotes();
    const noteObject = {
        id: generateId(),
        content: noteInput.value,
        fixed: false
    };

    createNote(noteObject.id, noteObject.content, noteObject.fixed);

    notes.push(noteObject);

    saveNotes(notes);

    noteInput.value = "";
}

function createNote(id, content, fixed){
    const element = document.createElement("div");
    element.classList.add("note");

    const textArea = createTextArea(content);
    element.appendChild(textArea);

    const pinIcon = document.createElement("i");
    pinIcon.classList.add(...["bi", "bi-pin"]);
    element.appendChild(pinIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add(...["bi", "bi-x-lg"]);
    element.appendChild(deleteIcon);

    const duplicatedIcon = document.createElement("i");
    duplicatedIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicatedIcon);

    if(fixed){
        element.classList.add("fixed");
    }

    //evento do elemento
    element.querySelector(".bi-pin").addEventListener("click", () =>{
        toggleFixNote(id);
    });

    element.querySelector(".bi-x-lg").addEventListener("click", () =>{
        deleteNote(id, element);
    });

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () =>{
        copyNote(id);
    });

    notesContainer.appendChild(element);
}

function copyNote(id){
    const notes = getNotes();
    const targeNote = notes.filter((note) => note.id === id)[0];

    const noteObject = {
        id: generateId(),
        content: targeNote.content,
        fixed: false,
    };

    createNote(noteObject.id, noteObject.content, noteObject.fixed);

    notes.push(noteObject);
    saveNotes();
}

function deleteNote(id, element){
    const notes = getNotes().filter((note) => note.id !== id);

    saveNotes(notes);

    notesContainer.removeChild(element);
}

function createTextArea(content){
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.placeholder = "Adicione algum texto...";

    return textArea;
}

function toggleFixNote(id){
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);

    showNotes();
}

function generateId(){
    return Math.floor(Math.random() * 5000);
}

//localstorage
function cleanNotes(){
    notesContainer.replaceChildren([]);
}

function showNotes(){
    cleanNotes();

    getNotes().forEach(element => {
        createNote(element.id, element.content, element.fixed);
    });
}

function getNotes(){
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed) ? -1 : 1);

    return orderedNotes;
}

function saveNotes(notes){
    localStorage.setItem("notes", JSON.stringify(notes));
}

// eventos
addNoteBtn.addEventListener("click", () => addNote());

//inicialização
showNotes();