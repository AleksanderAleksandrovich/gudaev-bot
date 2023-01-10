export type Difficulty = null | 1 | 2 | 3;

export type GameState = {
  difficulty: Difficulty;
  answerNumber: null | number;
}

export type MessageDifficulties =
  | 'msg_guess_game_difficulty_1'
  | 'msg_guess_game_difficulty_2'
  | 'msg_guess_game_difficulty_3';

export type MessageGiveup = 'msg_guess_game_giveup';

export type MessageGuess = 'msg_guess_game_guess';

export type GuessGameMessage = MessageDifficulties | MessageGiveup | MessageGuess;