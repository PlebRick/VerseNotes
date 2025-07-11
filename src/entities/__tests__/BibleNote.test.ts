import { describe, it, expect } from '@jest/globals';
import { BibleNote } from '../BibleNote';

describe('BibleNote', () => {
  it('should return empty array when no notes exist', async () => {
    const notes = await BibleNote.list();
    expect(notes).toEqual([]);
  });
});