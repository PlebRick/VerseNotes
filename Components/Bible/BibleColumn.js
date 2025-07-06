
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Plus, MessageSquare, AlertCircle } from "lucide-react";

export default function BibleColumn({ 
  passage, 
  bibleText, 
  notes, 
  isLoading, 
  onCreateNote 
}) {
  const [selectedVerses, setSelectedVerses] = useState([]);

  const notesMeta = useMemo(() => {
    const meta = {};
    if (!notes || notes.length === 0) return meta;

    notes.forEach(note => {
      // Mark the start of the note
      if (!meta[note.start_verse]) meta[note.start_verse] = {};
      meta[note.start_verse].isNoteStart = true;
      if (!meta[note.start_verse].startingNotes) meta[note.start_verse].startingNotes = [];
      meta[note.start_verse].startingNotes.push(note);
      
      // Mark the end of the note
      if (!meta[note.end_verse]) meta[note.end_verse] = {};
      meta[note.end_verse].isNoteEnd = true;

      // Mark all verses that are part of this note
      for (let i = note.start_verse; i <= note.end_verse; i++) {
        if (!meta[i]) meta[i] = {};
        meta[i].partOfNote = true;
      }
    });

    return meta;
  }, [notes]);

  const handleVerseClick = (verseNumber) => {
    setSelectedVerses(prev => {
      if (prev.includes(verseNumber)) {
        return prev.filter(v => v !== verseNumber);
      } else {
        return [...prev, verseNumber].sort((a, b) => a - b);
      }
    });
  };

  const handleCreateNoteFromSelection = () => {
    if (selectedVerses.length === 0) return;
    
    const start = Math.min(...selectedVerses);
    const end = Math.max(...selectedVerses);
    onCreateNote({ start, end });
    setSelectedVerses([]);
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-6 flex-shrink-0" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!bibleText || bibleText.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {passage.book} {passage.chapter}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Text Available</h3>
          <p className="text-slate-500 mb-4">
            Unable to load Bible text for this passage. Please try a different chapter or check your connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {passage.book} {passage.chapter}
        </h1>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-slate-100">
            {bibleText.length} verses
          </Badge>
          {selectedVerses.length > 0 && (
            <Button
              onClick={handleCreateNoteFromSelection}
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Note on {selectedVerses.length} verse{selectedVerses.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-0">
        {bibleText.map((verse) => {
          const verseMeta = notesMeta[verse.verse] || {};
          const isSelected = selectedVerses.includes(verse.verse);
          const startingNotes = verseMeta.startingNotes || [];

          let blueLineClasses = "absolute left-0 top-0 bottom-0 w-1 bg-blue-400";
          if (verseMeta.isNoteStart) blueLineClasses += " rounded-t-lg";
          if (verseMeta.isNoteEnd) blueLineClasses += " rounded-b-lg";
          
          return (
            <div
              key={verse.verse}
              className={`group flex gap-3 py-2.5 px-4 transition-all duration-200 cursor-pointer relative hover:bg-slate-50 ${
                isSelected ? 'bg-amber-50' : ''
              }`}
              onClick={() => handleVerseClick(verse.verse)}
            >
              {verseMeta.partOfNote && <div className={blueLineClasses}></div>}
              
              {isSelected && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-lg"></div>
              )}

              <div className="flex-shrink-0 pl-2 z-10">
                <span className="text-sm font-medium text-slate-500 select-none">
                  {verse.verse}
                </span>
              </div>
              <div className="flex-1 min-w-0 z-10">
                <p className="text-slate-800 leading-relaxed">
                  {verse.text}
                </p>
                {startingNotes.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600">
                      {startingNotes.length} note{startingNotes.length > 1 ? 's' : ''} start{startingNotes.length > 1 ? '' : 's'} here
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedVerses.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            Selected verses: {selectedVerses.join(", ")}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Click "Note on {selectedVerses.length} verse{selectedVerses.length > 1 ? 's' : ''}" to create a study note
          </p>
        </div>
      )}
    </div>
  );
}
