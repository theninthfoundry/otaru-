import { describe, it, expect } from 'vitest';
import { EditorialService } from '@/lib/domain/editorial/editorial-service';

describe('PHASE D — EDITORIAL CMS & STRUCTURED STORYTELLING', () => {

  it('retrieves published chapters with authentic kanji titles and maker notes', () => {
    const chapters = EditorialService.getPublishedChapters();

    expect(chapters.length).toBeGreaterThanOrEqual(2);

    const chapter1 = chapters.find((c) => c.slug === 'kyoto-nights');
    expect(chapter1).toBeDefined();
    expect(chapter1?.kanjiTitle).toBe('京都・夜');
    expect(chapter1?.makerNotes).toContain('2.5cm extra selvage allowance');
  });

  it('retrieves published essays with master craft insights', () => {
    const essays = EditorialService.getPublishedEssays();

    expect(essays.length).toBeGreaterThanOrEqual(2);

    const sukumoEssay = EditorialService.getEssayBySlug('mechanics-of-sukumo');
    expect(sukumoEssay).toBeDefined();
    expect(sukumoEssay?.author).toContain('T. Murata');
    expect(sukumoEssay?.pullQuote).toContain('living microorganisms');
  });

  it('resolves maker profiles with years of experience and atelier quotes', () => {
    const makers = EditorialService.getMakers();

    expect(makers.length).toBeGreaterThanOrEqual(2);

    const cutter = makers.find((m) => m.name === 'Kenji Takahashi');
    expect(cutter).toBeDefined();
    expect(cutter?.role).toBe('Master Pattern Cutter');
    expect(cutter?.experienceYears).toBe(28);
  });
});
