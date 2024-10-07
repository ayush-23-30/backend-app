import e from "express";
import authenticateToken from "../utils.js";
import {addNotesController , deleteNoteController, editNotes, getAllNotesController, isPinnedUpdateController, SearchController } from "../controller/addNotes.controller.js";


const NoteRouter = e.Router(); 

NoteRouter.post("/addNotes", authenticateToken, addNotesController); 
NoteRouter.put("/editNotes/:id", authenticateToken, editNotes);
NoteRouter.get("/getNotes", authenticateToken, getAllNotesController);
NoteRouter.delete("/note-delete/:id", authenticateToken, deleteNoteController)
NoteRouter.put("/isPinned/:id", authenticateToken, isPinnedUpdateController)
NoteRouter.get("/search-note",authenticateToken, SearchController)

export default NoteRouter; 
