import { puzzles01to25 } from './connections/puzzles-01-25';
import { puzzles26to50 } from './connections/puzzles-26-50';
import { wordleLevels } from './wordle/answers';

export { wordleLevels };
export const connectionsPuzzles = [...puzzles01to25, ...puzzles26to50];

export const getWordleLevel = (level: number) => wordleLevels.find((l) => l.level === level);
export const getConnectionsPuzzle = (level: number) => connectionsPuzzles.find((p) => p.level === level);
