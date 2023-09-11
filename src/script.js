window.addEventListener(
  "DOMContentLoaded",
  function() {
    fetch("/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((notes) => {
        document.getElementById("notelist").innerHTML = notes
          .map((note) => {
            return `
                <li id="${note.id}">
                    ID: ${note.id} <br> Name: ${note.name} <br> Author: ${note.author}
                </li>
            `;
          })
          .join("");
      });
  },
  false,
);

const addNewNote = () => {
  const newNote = prompt("Title and Content(separated by a comma)");
  if (newNote) {
    const [title, content] = newNote.split(",");
    fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          document.getElementById("notelist").innerHTML += `
                    <li id="${res.id}">
                        ID: ${res.id} Title: ${title} <br> Content: ${content}
                    </li>
                `;
        }
      });
  }
};

const changeNoteTitle = () => {
  const notePrompt = prompt("Note ID");
  if (!notePrompt) return alert("Invalid note ID");
  const noteId = parseInt(notePrompt);
  if (noteId) {
    const newNote = prompt("Title and Content(separated by a comma)");
    if (newNote) {
      const [title, content] = newNote.split(",");
      fetch(`/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, author }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            document.getElementById(noteId).innerHTML = `
                        ID: ${noteId} <br> Title: ${title} <br> Content: ${content}
                    `;
          }
        });
    }
  }
};

const deleteNote = () => {
  const notePrompt = prompt("Note ID");
  if (!notePrompt) return alert("Invalid note ID");
  const noteId = parseInt(notePrompt);
  if (noteId) {
    fetch(`/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          document.getElementById(noteId).remove();
        }
      });
  }
};
