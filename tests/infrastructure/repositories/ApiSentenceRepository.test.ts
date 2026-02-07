import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApiSentenceRepository } from '../../../src/infrastructure/repositories/ApiSentenceRepository';

const mockResponse = [
  { japanese: 'テスト文です', reading: 'てすとぶんです' },
  { japanese: '空が青い', reading: 'そらがあおい' },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('ApiSentenceRepository', () => {
  it('API から取得した文をローマ字変換して返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: JSON.stringify(mockResponse) } }],
          }),
      })
    );

    const repo = createApiSentenceRepository('test-key');
    const sentences = await repo.getSentences();

    expect(sentences).toHaveLength(2);
    expect(sentences[0]!.japanese).toBe('テスト文です');
    expect(sentences[0]!.reading).toBe('てすとぶんです');
    expect(sentences[0]!.romaji).toBeTruthy();
    expect(sentences[0]!.chunks.length).toBeGreaterThan(0);
  });

  it('API キーが Authorization ヘッダーに含まれる', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: JSON.stringify(mockResponse) } }],
        }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const repo = createApiSentenceRepository('sk-test-123');
    await repo.getSentences();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer sk-test-123',
        }),
      })
    );
  });

  it('401 エラーで適切なメッセージを返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401 })
    );

    const repo = createApiSentenceRepository('bad-key');
    await expect(repo.getSentences()).rejects.toThrow('APIキーが無効です');
  });

  it('429 エラーで適切なメッセージを返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 429 })
    );

    const repo = createApiSentenceRepository('test-key');
    await expect(repo.getSentences()).rejects.toThrow('レート制限');
  });

  it('不正な JSON レスポンスでエラーを返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'not json' } }],
          }),
      })
    );

    const repo = createApiSentenceRepository('test-key');
    await expect(repo.getSentences()).rejects.toThrow('レスポンスが不正');
  });

  it('空配列のレスポンスでエラーを返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: '[]' } }],
          }),
      })
    );

    const repo = createApiSentenceRepository('test-key');
    await expect(repo.getSentences()).rejects.toThrow('レスポンスが不正');
  });
});
