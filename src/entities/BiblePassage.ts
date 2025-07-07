export interface BiblePassageData {
  id: string;
  reference: string;
  content: string;
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

export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface FormattedPassage {
  reference: string;
  verses: Verse[];
}

export class BiblePassage {
  static parseReference(reference: string): string | null {
    // Accepts references like "John 3", "Romans 1:1-16", etc.
    if (!reference || typeof reference !== 'string') return null;
    return reference.trim();
  }

  static async fetchPassage(reference: string): Promise<FormattedPassage> {
    const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=web`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[fetchPassage] Error response:', errorText);
      throw new Error(`Failed to fetch passage: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      reference: data.reference,
      verses: data.verses.map((v: any) => ({
        book: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text.trim(),
      }))
    };
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