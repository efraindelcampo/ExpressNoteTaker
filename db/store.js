const util = require("util");
const fs = require("fs");
// This dependency will be used to generate our unique ids
const { v1: uuidv1 }  = require('uuid');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  read() {
    return readFileAsync("db/db.json");
  }

  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {
      let parsedNotes;

      try {
        parsedNotes = [].concat(JSON.parse(notes));
      } catch (err) {
        parsedNotes = [];
      }

      return parsedNotes;
    });
  }

  addNote(note) {
    const { title, text } = note;

    // Throw errror if either values of title and text are null
    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    // Add a unique id using dependency we installed (uuid)
    const newNote = { title, text, id: uuidv1() };

    // Get all notes, add the new note, write all the updated notes, return the new note
    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNote(id) {
    // Get all notes, remove the note with the given id, write the filtered notes
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new Store();
