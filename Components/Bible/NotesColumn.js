
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Tag } from "lucide-react";
import { format } from "date-fns";

export default function NotesColumn({ notes, onNoteSelect, currentPassage }) {
  if (notes.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Notes Yet</h3>
          <p className="text-slate-500 mb-4">
            Select verses from the Bible column and click the + button to create your first study note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:scale-[1.02]"
          onClick={() => onNoteSelect(note)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-slate-900 line-clamp-2">
                  {note.title || "Untitled Note"}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Badge variant="outline" className="text-xs">
                    {note.verse_reference}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(note.created_date), "MMM d")}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div 
              className="text-sm text-slate-600 line-clamp-3 leading-relaxed prose"
              dangerouslySetInnerHTML={{ __html: note.content || "No content yet..." }}
            />
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Tag className="w-3 h-3 text-slate-400" />
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
