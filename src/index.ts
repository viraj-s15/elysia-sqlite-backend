import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { NotesDb } from "../db.js";

const app = new Elysia()
  .use(html())
  .decorate("db", new NotesDb())
  .get("/", () => Bun.file("index.html").text)
  .get("/script.js", () => Bun.file("script.js").text())
  .get("/notes", ({ db }) => db.getAllNotes())
  .post(
    "/notes",
    async ({ db, body }) => {
      console.log(body);
      const id = (await db.addNote(body)).id;
      console.log(id);
      return { success: true, id };
    },
    {
      schema: {
        body: t.Object({
          title: t.String(),
          content: t.String(),
        }),
      },
    },
  )
  .put(
    "/notes/:id",
    ({ db, params, body }) => {
      try {
        db.changeTitle(parseInt(params.id), body);
        return { success: true };
      } catch (e) {
        return { success: false };
      }
    },
    {
      schema: {
        body: t.Object({
          title: t.String(),
          content: t.String(),
        }),
      },
    },
  )
  .delete("/notes/:id", ({ db, params }) => {
    try {
      db.removeNote(parseInt(params.id));
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  })

  .listen(3000);
