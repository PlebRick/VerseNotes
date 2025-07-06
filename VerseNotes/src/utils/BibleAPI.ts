export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  content: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
  content: string;
}

export class BibleAPI {
  private static readonly BASE_URL = 'https://api.scripture.api.bible/v1';
  private static readonly API_KEY = 'your-api-key-here'; // Replace with actual API key
  
  private static getHeaders(): HeadersInit {
    return {
      'api-key': this.API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  static async getBibles(): Promise<BibleTranslation[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/bibles`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching bibles:', error);
      throw error;
    }
  }

  static async getVerse(bibleId: string, verseId: string): Promise<BibleVerse> {
    try {
      const response = await fetch(`${this.BASE_URL}/bibles/${bibleId}/verses/${verseId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching verse:', error);
      throw error;
    }
  }

  static async getChapter(bibleId: string, chapterId: string): Promise<BibleChapter> {
    try {
      const response = await fetch(`${this.BASE_URL}/bibles/${bibleId}/chapters/${chapterId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  }

  static async searchVerses(bibleId: string, query: string, limit: number = 10): Promise<BibleVerse[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.verses || [];
    } catch (error) {
      console.error('Error searching verses:', error);
      throw error;
    }
  }

  // Helper method to get popular Bible translations
  static getPopularTranslations(): BibleTranslation[] {
    return [
      { id: 'de4e12af7f28f599-02', name: 'English Standard Version', abbreviation: 'ESV', language: 'English' },
      { id: '06125adad2d5898a-01', name: 'New International Version', abbreviation: 'NIV', language: 'English' },
      { id: '65eec8e0b60e656b-01', name: 'New American Standard Bible', abbreviation: 'NASB', language: 'English' },
      { id: 'de4e12af7f28f599-01', name: 'King James Version', abbreviation: 'KJV', language: 'English' },
      { id: '114c1c4e4e6c8a40-01', name: 'New King James Version', abbreviation: 'NKJV', language: 'English' }
    ];
  }
}