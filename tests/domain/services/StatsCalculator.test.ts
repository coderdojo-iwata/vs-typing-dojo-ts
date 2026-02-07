import { describe, it, expect } from 'vitest';
import { calcAccuracy, calcKpm } from '../../../src/domain/services/StatsCalculator';
import { createPlayer } from '../../../src/domain/entities/Player';

function playerWith(overrides: Partial<ReturnType<typeof createPlayer>>) {
  return { ...createPlayer(1), ...overrides };
}

describe('StatsCalculator', () => {
  describe('calcAccuracy', () => {
    it('タイプがない場合は 0 を返す', () => {
      expect(calcAccuracy(playerWith({}))).toBe(0);
    });

    it('全て正解の場合は 100 を返す', () => {
      expect(calcAccuracy(playerWith({ correctTypes: 50, missTypes: 0 }))).toBe(100);
    });

    it('正解とミスから成功率を計算する', () => {
      // 80 / (80 + 20) = 0.8 → 80.0
      expect(calcAccuracy(playerWith({ correctTypes: 80, missTypes: 20 }))).toBe(80);
    });

    it('小数点1桁まで丸められる', () => {
      // 19 / (19 + 4) = 0.82608... → 82.6
      expect(calcAccuracy(playerWith({ correctTypes: 19, missTypes: 4 }))).toBe(82.6);
    });
  });

  describe('calcKpm', () => {
    it('経過時間が 0 の場合は 0 を返す', () => {
      expect(calcKpm(playerWith({ correctTypes: 100 }), 60)).toBe(0);
    });

    it('正タイプ数と経過時間から KPM を計算する', () => {
      // 経過30秒、正タイプ60 → 60/30*60 = 120
      expect(calcKpm(playerWith({ correctTypes: 60 }), 30)).toBe(120);
    });

    it('整数に丸められる', () => {
      // 経過40秒、正タイプ50 → 50/40*60 = 75
      expect(calcKpm(playerWith({ correctTypes: 50 }), 20)).toBe(75);
    });
  });
});
