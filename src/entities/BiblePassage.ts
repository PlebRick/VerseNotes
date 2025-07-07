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
      })),
    };
  }

  // Note: These methods are kept for potential future use with other Bible APIs
  // Currently using bible-api.com which doesn't require these endpoints
  static async searchPassages(
    _bibleId: string,
    _query: string,
    _apiKey: string,
  ): Promise<BiblePassageData[]> {
    // Placeholder for future API integration
    throw new Error('Search functionality not implemented with current API');
  }

  static async getBooks(_bibleId: string, _apiKey: string): Promise<BibleBook[]> {
    // Placeholder for future API integration
    throw new Error('Book listing not implemented with current API');
  }

  static async getChapters(
    _bibleId: string,
    _bookId: string,
    _apiKey: string,
  ): Promise<BibleChapter[]> {
    // Placeholder for future API integration
    throw new Error('Chapter listing not implemented with current API');
  }
}
