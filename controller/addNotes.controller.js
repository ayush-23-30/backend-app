import mongoose from "mongoose";
import { Notes } from "../models/addNotes.model.js";



// add notes ( title , description ) take out by destructing 
// check they exists or not 
// then await and Notes.create({})
const addNotesController = async (req, res) => {
  try {   
    const { title, content, tags } = req.body;
    const { id } = req.user;
    if (!title || !content ) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Save the new note to the database
    const note = new Notes({
      title,
      content,
      tags: tags || [],
      userId: id,  // Use `id` from the decoded token in req.user
    });

    await note.save();
    console.log("Note successfully saved to DB");

    return res.status(200).json({
      success: true,
      message: "Note saved successfully",
      note
    });
  } catch (error) {
    console.error("Error in Add Notes Controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Notes could not be created",
    });
  }
};

// how to edit a notes 
// find the notes id noteId = params.id; 
// then check it finds or not 
// destructure - title , content and check them 
// find the notes checking findById 
// 


const editNotes = async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note ID not provided or not found",
      });
    }

    const { title, content, tags, isPinned } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: "Content or title not found",
      });
    }

    // Access user id from req.user
    const { id } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    // Find the note by note ID and user ID
    const note = await Notes.findOne({ _id: noteId, userId: id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Update the note fields if provided
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned !== 'undefined') note.isPinned = isPinned;

    // Save the updated note
    const editSaved = await note.save();

    return res.status(200).json({
      success: true,
      editSaved,
      message: "Notes has been edited successfully",
    });
  } catch (error) {
    console.error("Error in Edit Notes Controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Notes could not be edited",
    });
  }
};

const getAllNotesController = async(req,res)=>{
  try {
    const { id } = req.user;

    if (!id){
      return res.status(400).json({
        success: false,
        message: "User id not found!",
      });
    }
    
    const getNote = await Notes.find({
      userId :id
    }).sort({
      isPinned : -1
    })

    if(!getNote){
      return res.status(402).json({
        success : false,
        message : "Don't find the notes!"
      })
    }

    return res.status(201).json({
      success : true, 
      getNote, 
      message : "Successfully gets all the notes"
    })
  } catch (error) {
    console.error("there is an error in getting notes ");
    return res.status(500).json({
      success : false, 
      error : error.message,
      message : "We are failed to get All notes "
    })
  }
}

const deleteNoteController = async (req, res) => {
  try {
    const note_id = req.params.id;
    // Log the note ID and user ID
    // console.log("Note ID:", note_id);
    // console.log("User ID from token:", req.user);

    // Validate the note ID format
    if (!note_id || !mongoose.Types.ObjectId.isValid(note_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    const { id } = req.user; // Extract the user ID from req.user (from the token)

    // Validate the user ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Ensure `note_id` is converted to ObjectId when querying MongoDB
    const note = await Notes.findOne({
      userId: id,
      _id: new mongoose.Types.ObjectId(note_id),  // Convert note_id to ObjectId
    });

    // If the note isn't found, return a 404 error
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Delete the note
    await note.deleteOne();

    return res.status(202).json({
      success: true,
      message: "Note has been deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete note:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

const isPinnedUpdateController = async (req, res) => {
  try {
    const noteId = req.params.id; // Note ID from the request params
    const { isPinned } = req.body; // Pin status from request body
    const { id } = req.user; // User ID from the decoded token
  
    // Validate the noteId and userId
    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: "Note id not provided"
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id not provided"
      });
    }

    // Ensure both `noteId` and `userId` are strings when querying

    const note = await Notes.findOne({ 
      _id: noteId, 
      userId: id
    });
    
    console.log("Note found:", note);  // Log the found note

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found for this user"
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      success: true,
      message: "isPinned is updated"
    });

  } catch (error) {
    console.error("isPinned is not updated", error.message);
    return res.status(500).json({
      success: false,
      message: "isPinned is not updated",
      error: error.message
    });
  }
}

const SearchController = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from request
    const { query } = req.query; // Get query from request query params

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "No query provided",
      });
    }

    // Search for notes belonging to the user that match the title or content
    const matchingNotes = await Notes.find({
      userId: id, // Filter by user's notes
      $or: [
        { title: { $regex: new RegExp(query, "i") } }, // Case-insensitive search
        { content: { $regex: new RegExp(query, "i") } }, // Case-insensitive search
      ],
    });

    if (!matchingNotes.length) {
      return res.status(404).json({
        success: false,
        message: "No matching notes found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notes found",
      matchingNotes,
    });

  } catch (error) {
    console.log("There is an error in search", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred during search",
      error: error.message,
    });
  }
};



export {addNotesController , editNotes , getAllNotesController , deleteNoteController, isPinnedUpdateController , SearchController};
