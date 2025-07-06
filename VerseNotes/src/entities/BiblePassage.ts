export interface BiblePassageData {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  copyright: string;
  reference: string;
  verseCount: number;
  next?: {
    id: string;
    number: string;
  };
  previous?: {
    id: string;
    number: string;
  };
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  verseId: string;
  content: string;
  reference: string;
  verseNumber: number;
}

export interface BibleBook {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  reference: string;
}

export class BiblePassage {
  static parseReference(reference: string): { book: string; chapter: number; startVerse?: number; endVerse?: number } | null {
    // Parse references like "Romans 1:1-16", "John 3:16", "Genesis 1"
    const match = reference.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!match) return null;

    const [, book, chapter, startVerse, endVerse] = match;
    return {
      book: book.trim(),
      chapter: parseInt(chapter),
      startVerse: startVerse ? parseInt(startVerse) : undefined,
      endVerse: endVerse ? parseInt(endVerse) : undefined
    };
  }

  static formatReference(book: string, chapter: number, startVerse?: number, endVerse?: number): string {
    let reference = `${book} ${chapter}`;
    if (startVerse) {
      reference += `:${startVerse}`;
      if (endVerse && endVerse !== startVerse) {
        reference += `-${endVerse}`;
      }
    }
    return reference;
  }

  static async fetchPassage(bibleId: string, passageId: string, apiKey: string): Promise<BiblePassageData> {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/${passageId}`,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch passage: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  static async searchPassages(bibleId: string, query: string, apiKey: string): Promise<BiblePassageData[]> {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search passages: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.passages || [];
  }

  static async getBooks(bibleId: string, apiKey: string): Promise<BibleBook[]> {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/books`,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  static async getChapters(bibleId: string, bookId: string, apiKey: string): Promise<BibleChapter[]> {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${bookId}/chapters`,
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chapters: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }
}