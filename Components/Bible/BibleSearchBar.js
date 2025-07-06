import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";

export default function BibleSearchBar({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");

  const parseReference = (query) => {
    const cleanQuery = query.trim();
    
    // Handle formats like "Romans 1:1-16", "Rom 1:1-16", "John 3:16"
    const patterns = [
      /^(\d*\s*\w+)\s+(\d+):(\d+)(?:-(\d+))?$/i,  // Book Chapter:Verse or Book Chapter:Verse-Verse
      /^(\d*\s*\w+)\s+(\d+)$/i,                    // Book Chapter
    ];

    for (const pattern of patterns) {
      const match = cleanQuery.match(pattern);
      if (match) {
        const book = match[1].trim();
        const chapter = parseInt(match[2]);
        const startVerse = match[3] ? parseInt(match[3]) : 1;
        const endVerse = match[4] ? parseInt(match[4]) : startVerse;

        // Normalize book names
        const normalizedBook = normalizeBookName(book);
        
        return {
          book: normalizedBook,
          chapter,
          startVerse,
          endVerse
        };
      }
    }

    return null;
  };

  const normalizeBookName = (book) => {
    const bookMap = {
      "gen": "Genesis",
      "genesis": "Genesis",
      "ex": "Exodus",
      "exod": "Exodus",
      "exodus": "Exodus",
      "lev": "Leviticus",
      "leviticus": "Leviticus",
      "num": "Numbers",
      "numbers": "Numbers",
      "deut": "Deuteronomy",
      "deuteronomy": "Deuteronomy",
      "josh": "Joshua",
      "joshua": "Joshua",
      "judg": "Judges",
      "judges": "Judges",
      "ruth": "Ruth",
      "1sam": "1 Samuel",
      "1 sam": "1 Samuel",
      "1 samuel": "1 Samuel",
      "2sam": "2 Samuel",
      "2 sam": "2 Samuel",
      "2 samuel": "2 Samuel",
      "1kgs": "1 Kings",
      "1 kgs": "1 Kings",
      "1 kings": "1 Kings",
      "2kgs": "2 Kings",
      "2 kgs": "2 Kings",
      "2 kings": "2 Kings",
      "1chr": "1 Chronicles",
      "1 chr": "1 Chronicles",
      "1 chronicles": "1 Chronicles",
      "2chr": "2 Chronicles",
      "2 chr": "2 Chronicles",
      "2 chronicles": "2 Chronicles",
      "ezra": "Ezra",
      "neh": "Nehemiah",
      "nehemiah": "Nehemiah",
      "esth": "Esther",
      "esther": "Esther",
      "job": "Job",
      "ps": "Psalms",
      "psa": "Psalms",
      "psalm": "Psalms",
      "psalms": "Psalms",
      "prov": "Proverbs",
      "proverbs": "Proverbs",
      "eccl": "Ecclesiastes",
      "ecclesiastes": "Ecclesiastes",
      "song": "Song of Solomon",
      "song of solomon": "Song of Solomon",
      "isa": "Isaiah",
      "isaiah": "Isaiah",
      "jer": "Jeremiah",
      "jeremiah": "Jeremiah",
      "lam": "Lamentations",
      "lamentations": "Lamentations",
      "ezek": "Ezekiel",
      "ezekiel": "Ezekiel",
      "dan": "Daniel",
      "daniel": "Daniel",
      "hos": "Hosea",
      "hosea": "Hosea",
      "joel": "Joel",
      "amos": "Amos",
      "obad": "Obadiah",
      "obadiah": "Obadiah",
      "jonah": "Jonah",
      "mic": "Micah",
      "micah": "Micah",
      "nah": "Nahum",
      "nahum": "Nahum",
      "hab": "Habakkuk",
      "habakkuk": "Habakkuk",
      "zeph": "Zephaniah",
      "zephaniah": "Zephaniah",
      "hag": "Haggai",
      "haggai": "Haggai",
      "zech": "Zechariah",
      "zechariah": "Zechariah",
      "mal": "Malachi",
      "malachi": "Malachi",
      "matt": "Matthew",
      "mt": "Matthew",
      "matthew": "Matthew",
      "mark": "Mark",
      "mk": "Mark",
      "luke": "Luke",
      "lk": "Luke",
      "john": "John",
      "jn": "John",
      "acts": "Acts",
      "rom": "Romans",
      "romans": "Romans",
      "1cor": "1 Corinthians",
      "1 cor": "1 Corinthians",
      "1 corinthians": "1 Corinthians",
      "2cor": "2 Corinthians",
      "2 cor": "2 Corinthians",
      "2 corinthians": "2 Corinthians",
      "gal": "Galatians",
      "galatians": "Galatians",
      "eph": "Ephesians",
      "ephesians": "Ephesians",
      "phil": "Philippians",
      "philippians": "Philippians",
      "col": "Colossians",
      "colossians": "Colossians",
      "1thess": "1 Thessalonians",
      "1 thess": "1 Thessalonians",
      "1 thessalonians": "1 Thessalonians",
      "2thess": "2 Thessalonians",
      "2 thess": "2 Thessalonians",
      "2 thessalonians": "2 Thessalonians",
      "1tim": "1 Timothy",
      "1 tim": "1 Timothy",
      "1 timothy": "1 Timothy",
      "2tim": "2 Timothy",
      "2 tim": "2 Timothy",
      "2 timothy": "2 Timothy",
      "titus": "Titus",
      "philem": "Philemon",
      "philemon": "Philemon",
      "heb": "Hebrews",
      "hebrews": "Hebrews",
      "jas": "James",
      "james": "James",
      "1pet": "1 Peter",
      "1 pet": "1 Peter",
      "1 peter": "1 Peter",
      "2pet": "2 Peter",
      "2 pet": "2 Peter",
      "2 peter": "2 Peter",
      "1jn": "1 John",
      "1 john": "1 John",
      "2jn": "2 John",
      "2 john": "2 John",
      "3jn": "3 John",
      "3 john": "3 John",
      "jude": "Jude",
      "rev": "Revelation",
      "revelation": "Revelation"
    };

    const normalized = book.toLowerCase().replace(/\s+/g, ' ').trim();
    return bookMap[normalized] || book;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const reference = parseReference(searchQuery);
    if (reference) {
      onNavigate(reference);
      setSearchQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search... (e.g., Romans 1:1-16, John 3:16)"
          className="pl-10"
        />
      </div>
      <Button type="submit" className="bg-slate-700 hover:bg-slate-800">
        <BookOpen className="w-4 h-4 mr-2" />
        Go
      </Button>
    </form>
  );
}