import subscriptionNoteService from '../services/subscription-note.service.js';
import asyncHandler from '../utils/async-handler.js';
import ApiResponse from '../utils/api-response.js';

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await subscriptionNoteService.getNotes(req.params.id, req.user._id.toString());
  return ApiResponse.success(res, notes, 'Notes retrieved successfully');
});

export const addNote = asyncHandler(async (req, res) => {
  const note = await subscriptionNoteService.addNote(
    req.params.id,
    req.user._id.toString(),
    req.body.text
  );
  return ApiResponse.created(res, note, 'Note added successfully');
});

export const deleteNote = asyncHandler(async (req, res) => {
  await subscriptionNoteService.deleteNote(req.params.noteId, req.user._id.toString());
  return ApiResponse.success(res, null, 'Note deleted successfully');
});
