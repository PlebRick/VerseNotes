
import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // This import is still here but Textarea is no longer used for content, only if it's used elsewhere
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, X, BookOpen, FileText, Plus } from "lucide-react";

export default function NoteEditor({ 
  note, 
  onSave, 
  onCancel, 
  currentPassage, 
  bibleText 
}) {
  const [noteData, setNoteData] = useState({
    title: note?.title || "",
    content: note?.content || "",
    preview: note?.preview || "",
    tags: note?.tags || [],
    verse_reference: note?.verse_reference || "",
    book: note?.book || currentPassage.book,
    chapter: note?.chapter || currentPassage.chapter,
    start_verse: note?.start_verse || 1,
    end_verse: note?.end_verse || 1
  });

  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Generate preview from content
    // Note: The content is now rich text (HTML). Substring will cut HTML directly.
    // For a more robust preview, consider stripping HTML tags before substring.
    const preview = noteData.content.length > 150 
      ? noteData.content.substring(0, 150) + "..."
      : noteData.content;

    await onSave({
      ...noteData,
      preview
    });
    
    setIsSaving(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !noteData.tags.includes(newTag.trim())) {
      setNoteData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNoteData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getVerseText = () => {
    if (!bibleText || bibleText.length === 0) return "";
    
    const relevantVerses = bibleText.filter(verse => 
      verse.verse >= noteData.start_verse && verse.verse <= noteData.end_verse
    );
    
    return relevantVerses.map(verse => 
      `${verse.verse}. ${verse.text}`
    ).join(" ");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {note?.id ? "Edit Note" : "New Note"}
              </h1>
              <p className="text-sm text-slate-500">
                {noteData.verse_reference || `${noteData.book} ${noteData.chapter}:${noteData.start_verse}-${noteData.end_verse}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !noteData.title.trim()}
              className="bg-slate-700 hover:bg-slate-800 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Bible Reference Column */}
        <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Scripture Reference
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-700 mb-2">
                  {noteData.book} {noteData.chapter}:{noteData.start_verse}
                  {noteData.end_verse > noteData.start_verse && `-${noteData.end_verse}`}
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  {getVerseText()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note Editor Column */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Note Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={noteData.title}
                    onChange={(e) => setNoteData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Enter note title..."
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                   <ReactQuill 
                    theme="snow" 
                    value={noteData.content} 
                    onChange={(content) => setNoteData(prev => ({ ...prev, content }))}
                    modules={modules}
                    className="bg-white"
                   />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Tags</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        className="w-32"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddTag}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {noteData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {noteData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-red-100"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
