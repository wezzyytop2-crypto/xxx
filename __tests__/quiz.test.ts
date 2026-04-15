import { generateMultipleChoiceQuestion, generateFillInBlankQuestion } from '@/lib/study-system';

const mockCard = {
  id: 'test',
  term: 'casă',
  translation: 'дом',
  example: 'Casa este mare.',
  note: '',
  partOfSpeech: 'noun' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockCards = [mockCard, { ...mockCard, id: 'test2', term: 'băiat', translation: 'мальчик', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }];

describe('Quiz Generation', () => {
  it('multiple choice has 4 options with correct', () => {
    const question = generateMultipleChoiceQuestion(mockCard, mockCards);
    expect(question.options).toHaveLength(4);
    expect(question.options).toContain(mockCard.translation);
  });

  it('fill in blank uses example', () => {
    const question = generateFillInBlankQuestion(mockCard);
    expect(question.question).toContain('______');
    expect(question.correctAnswer).toBe(mockCard.term);
  });

  it('questions in Russian', () => {
    const mc = generateMultipleChoiceQuestion(mockCard, mockCards);
    const fb = generateFillInBlankQuestion(mockCard);
    expect(mc.question).toContain('Как переводится');
    expect(fb.question).toContain('Заполни пропуск');
  });
});

