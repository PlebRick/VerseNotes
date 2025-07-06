
import React, { useState, useEffect } from "react";
import { BibleNote } from "@/entities/BibleNote";
import { BiblePassage } from "@/entities/BiblePassage"; // Still used for type definition consistency
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, BookOpen, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import BibleColumn from "../components/bible/BibleColumn";
import NotesColumn from "../components/bible/NotesColumn";
import NoteEditor from "../components/bible/NoteEditor";
import BibleSearchBar from "../components/bible/BibleSearchBar";

export default function BibleStudy() {
  const [currentPassage, setCurrentPassage] = useState({
    book: "John",
    chapter: 1,
    startVerse: 1,
    endVerse: 51 // This range will be dynamically updated by API response verses
  });
  const [bibleText, setBibleText] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to check URL parameters on initial component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const book = params.get("book");
    const chapter = params.get("chapter");

    if (book && chapter) {
      setCurrentPassage({
        book: book,
        chapter: parseInt(chapter),
        startVerse: 1, // Default or dynamically set based on API response
        endVerse: 500 // A sufficiently large number to encompass any chapter
      });
    }
    // If no URL parameters, currentPassage remains its initial state (John 1),
    // which the subsequent useEffect will then use to load data.
  }, []); // Empty dependency array means it runs once on mount

  // Effect to load Bible text and notes whenever currentPassage changes
  useEffect(() => {
    // Only load if book and chapter are valid (not null/undefined from initial state)
    if (currentPassage.book && currentPassage.chapter) {
      loadBibleText();
      loadNotes();
    }
  }, [currentPassage.book, currentPassage.chapter]);

  const loadBibleText = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const passageRef = `${currentPassage.book} ${currentPassage.chapter}`;
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(passageRef)}?translation=web`);

      if (!response.ok) {
        // Attempt to parse JSON error from API, but fall back to status text
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.statusText} (Status: ${response.status})`);
      }
      const data = await response.json();

      if (data.error) {
         throw new Error(data.error);
      }
      
      // Ensure data.verses exists and is an array
      if (!data.verses || !Array.isArray(data.verses) || data.verses.length === 0) {
        throw new Error("No verses found for this passage from the API.");
      }

      const passages = data.verses.map(v => ({
        book: data.reference.split(" ")[0], // Example: "John 1:1" -> "John"
        chapter: v.chapter,
        verse: v.verse,
        text: v.text.replace(/\n/g, ' ').trim(), // Clean up text as per outline
        translation: "WEB" // As per API request
      }));
      setBibleText(passages);

      // Optionally update endVerse based on actual verses received
      if (passages.length > 0) {
        setCurrentPassage(prev => ({
          ...prev,
          endVerse: passages[passages.length - 1].verse
        }));
      }

    } catch (e) {
      console.error("Error loading Bible text:", e);
      setError(`Could not load ${currentPassage.book} ${currentPassage.chapter}. The passage may not exist, or there's a connection issue: ${e.message}`);
      setBibleText([]); // Clear previous Bible text on error
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const userNotes = await BibleNote.filter({
        book: currentPassage.book,
        chapter: currentPassage.chapter
      }, "-created_date");
      setNotes(userNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
      // Continue without notes if there's an error
      setNotes([]);
      // Optionally show an alert for note loading error
      setError(prev => prev || `Error loading notes: ${error.message}`);
    }
  };

  const handleSearchNavigation = (searchResult) => {
    setCurrentPassage(searchResult);
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsFullScreen(true);
  };

  const handleCreateNote = (verseRange) => {
    const newNote = {
      verse_reference: `${currentPassage.book} ${currentPassage.chapter}:${verseRange.start}-${verseRange.end}`,
      book: currentPassage.book,
      chapter: currentPassage.chapter,
      start_verse: verseRange.start,
      end_verse: verseRange.end,
      title: "",
      content: "",
      preview: ""
    };
    setSelectedNote(newNote);
    setIsFullScreen(true);
  };

  const handleNoteSave = async (noteData) => {
    try {
      // Ensure content is a string for the entity
      const dataToSave = { ...noteData, content: String(noteData.content) };
      if (selectedNote.id) {
        await BibleNote.update(selectedNote.id, dataToSave);
      } else {
        await BibleNote.create(dataToSave);
      }
      setIsFullScreen(false);
      setSelectedNote(null);
      loadNotes(); // Reload notes after save to reflect changes
    } catch (error) {
      console.error("Error saving note:", error);
      // You might want to show an error message to the user here
      setError(`Error saving note: ${error.message}`);
    }
  };

  const handleNoteCancel = () => {
    setIsFullScreen(false);
    setSelectedNote(null);
  };

  if (isFullScreen && selectedNote) {
    return (
      <NoteEditor
        note={selectedNote}
        onSave={handleNoteSave}
        onCancel={handleNoteCancel}
        currentPassage={currentPassage}
        bibleText={bibleText}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Bible Column */}
      <div className="flex-1 flex flex-col border-r border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-100">
          <BibleSearchBar onNavigate={handleSearchNavigation} />
          {error && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <BibleColumn
            passage={currentPassage}
            bibleText={bibleText}
            notes={notes}
            isLoading={isLoading}
            onCreateNote={handleCreateNote}
          />
        </div>
      </div>

      {/* Notes Column */}
      <div className="w-96 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Study Notes
            </h2>
            <Button
              onClick={() => handleCreateNote({ start: 1, end: 1 })}
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Note
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NotesColumn
            notes={notes}
            onNoteSelect={handleNoteSelect}
            currentPassage={currentPassage}
          />
        </div>
      </div>
    </div>
  );
}
