import { BiblePassage } from '../BiblePassage';

describe('BiblePassage', () => {
  describe('parseReference', () => {
    it('should parse simple verse reference', () => {
      const result = BiblePassage.parseReference('John 3:16');
      expect(result).toBe('John 3:16');
    });

    it('should parse verse range reference', () => {
      const result = BiblePassage.parseReference('Romans 1:1-16');
      expect(result).toBe('Romans 1:1-16');
    });

    it('should return null for invalid reference', () => {
      const result = BiblePassage.parseReference('');
      expect(result).toBeNull();
    });
  });

  describe('fetchPassage', () => {
    it('should fetch passage from API', async () => {
      const reference = 'John 3:16';

      // Mock fetch for testing
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          reference: 'John 3:16',
          verses: [{
            book_name: 'John',
            chapter: 3,
            verse: 16,
            text: 'For God so loved the world...'
          }]
        })
      });

      const result = await BiblePassage.fetchPassage(reference);
      expect(result).toHaveProperty('reference');
      expect(result).toHaveProperty('verses');
      expect(result.verses[0]).toHaveProperty('book');
      expect(result.verses[0]).toHaveProperty('chapter');
      expect(result.verses[0]).toHaveProperty('verse');
      expect(result.verses[0]).toHaveProperty('text');
    });
  });
});