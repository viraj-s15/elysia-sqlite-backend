import { Database } from "bun:sqlite";

export interface Note {
  id?: number;
  title: string;
  content: string;
}

export class NotesDb {
  private db: Database;
  constructor() {
    this.db = new Database("notes.sqlite");

    this.init()
      .then(() => console.log("Database Init"))
      .catch(console.error);
  }

  async getAllNotes() {
    return this.db.query(`SELECT * FROM notes`).all();
  }

  async addNote(note: Note) {
    return this.db
      .query(`INSERT INTO notes (title,content) VALUED (?,?) RETURNING id`)
      .get(note.title, note.content) as Note;
  }

  async changeTitle(id: number, note: Note) {
    return this.db.query(
      `UPDATE notes SET name = '${note.title}', content = '${note.content}' WHERE id = ${id}`,
    );
  }

  async removeNote(id: number) {
    return this.db.run(`DELETE FROM notes WHERE  id = ${id}`);
  }

  async init() {
    return this.db.run(
      `CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT,content TEXT)`,
    );
  }
}
