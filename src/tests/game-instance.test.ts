import GameInstance, { ChipType, GamePhase } from '../models/game-instance.model';

jest.mock('../utils/generateId');
jest.mock('../utils/shuffleArray');

describe('Game Instance', () => {
  it('allows the turns to progress', () => {
    const instance = new GameInstance();
    instance.addNewPlayer('Player 1');
    expect(instance.gameTurn).toEqual(1);

    instance.progressGameTurn();

    expect(instance.gameTurn).toEqual(2);
  });

  it('allows phase to progress and reset', () => {
    const instance = new GameInstance();
    instance.addNewPlayer('Player 1');
    expect(instance.currentGamePhase).toEqual(GamePhase.INITIALIZATION_OF_TURN);
    expect(instance.gameTurn).toEqual(1);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.FORTUNE_TELLER_PHASE);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.POTION_PHASE);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.BONUS_DIE_ROLL);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.CHIP_EVALUATIONS);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.RUBY_EVALUATIONS);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.VICTORY_POINT_EVALUATIONS);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.BUY_PHASE);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.END_OF_TURN);

    instance.progressGamePhase();
    expect(instance.currentGamePhase).toEqual(GamePhase.INITIALIZATION_OF_TURN);
    expect(instance.gameTurn).toEqual(2);
  });

  it('allows you to add a new player', () => {
    const instance = new GameInstance();
    expect(instance.players).toEqual([]);
    expect(instance.playerGlobalStates).toEqual({});
    expect(instance.playerRoundStates).toEqual({});
    expect(instance.bags).toEqual({});

    // Smoke test that chips are distributed without checking every single type
    expect(instance.merchantStore.availableChips['WHITE'][1].length).toEqual(20);

    instance.addNewPlayer('Player 1');
    expect(instance.players).toMatchInlineSnapshot(`
      Array [
        Player {
          "id": 1,
          "name": "Player 1",
        },
      ]
    `);
    expect(instance.playerGlobalStates).toMatchInlineSnapshot(
      {},
      `
      Object {
        "1": PlayerGlobalState {
          "coins": 0,
          "isFlaskAvailable": true,
          "ratOffset": 0,
          "rubies": 0,
          "startingDropletIndex": 0,
          "victoryPoints": 0,
        },
      }
    `,
    );
    expect(instance.playerRoundStates).toMatchInlineSnapshot(
      {},
      `
      Object {
        "1": PlayerRoundState {
          "boughtChips": Array [],
          "chipTypeAlreadyBoughtByPlayerForRound": Object {
            "BLACK": false,
            "BLUE": false,
            "GREEN": false,
            "ORANGE": false,
            "PURPLE": false,
            "RED": false,
            "WHITE": false,
            "YELLOW": false,
          },
          "hasEndedPhase": false,
          "hasExploded": false,
          "nextPotSpotIndex": 1,
          "placedChips": Array [],
        },
      }
    `,
    );
    expect(instance.bags).toMatchInlineSnapshot(`
      Object {
        "1": Bag {
          "chips": Array [
            Object {
              "cost": 1,
              "type": "GREEN",
              "value": 1,
            },
            Object {
              "cost": 3,
              "type": "ORANGE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 3,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 2,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 2,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
          ],
          "fullBag": Array [
            Object {
              "cost": 1,
              "type": "GREEN",
              "value": 1,
            },
            Object {
              "cost": 3,
              "type": "ORANGE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 3,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 2,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 2,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
            Object {
              "cost": 0,
              "type": "WHITE",
              "value": 1,
            },
          ],
        },
      }
    `);

    // Smoke test that chips are distributed without checking every single type
    expect(instance.merchantStore.availableChips['WHITE'][1].length).toEqual(16);
  });

  it('progresses the starting player', () => {
    const instance = new GameInstance();
    const player1 = instance.addNewPlayer('Player 1');
    const player2 = instance.addNewPlayer('Player 2');
    const player3 = instance.addNewPlayer('Player 3');
    expect(instance.startingPlayerTurnIndicator).toEqual(player1.id);

    progressAllPhases(instance);
    expect(instance.startingPlayerTurnIndicator).toEqual(player2.id);

    progressAllPhases(instance);
    expect(instance.startingPlayerTurnIndicator).toEqual(player3.id);

    progressAllPhases(instance);
    expect(instance.startingPlayerTurnIndicator).toEqual(player1.id);
  });

  it('progresses the action making player', () => {
    const instance = new GameInstance();
    const player1 = instance.addNewPlayer('Player 1');
    const player2 = instance.addNewPlayer('Player 2');
    const player3 = instance.addNewPlayer('Player 3');
    expect(instance.currentActionMaker).toEqual(player1.id);

    instance.progressActionMakingPlayer();
    expect(instance.currentActionMaker).toEqual(player2.id);

    instance.progressActionMakingPlayer();
    expect(instance.currentActionMaker).toEqual(player3.id);

    instance.progressActionMakingPlayer();
    expect(instance.currentActionMaker).toEqual(player1.id);
  });

  it('allows you to sell a chip to a player if valid', () => {
    const instance = new GameInstance();
    const player1 = instance.addNewPlayer('Player 1');
    expect(instance.playerGlobalStates[player1.id].coins).toEqual(0);
    expect(instance.bags[player1.id].checkCount(ChipType.ORANGE, 1)).toEqual(1);

    expect(() => instance.sellChipToPlayer(player1.id, ChipType.ORANGE, 1)).toThrowError(
      /Illegal State: Player does not have enough money to buy chip/i,
    );

    instance.playerGlobalStates[player1.id].coins = 100;
    expect(() => instance.sellChipToPlayer(player1.id, ChipType.ORANGE, 1)).not.toThrowError(
      /Illegal State: Player does not have enough money to buy chip/i,
    );
    expect(instance.bags[player1.id].checkCount(ChipType.ORANGE, 1)).toEqual(2);

    expect(() => instance.sellChipToPlayer(player1.id, ChipType.ORANGE, 1)).toThrowError(
      /Illegal State: Chip type was already bought for this round/i,
    );
  });

  it('allows a player to draw from their bag', () => {
    const instance = new GameInstance();
    const player1 = instance.addNewPlayer('Player 1');
    const chip = instance.drawChipForPlayer(player1.id);

    expect(instance.bags[player1.id].fullBag.length).toBe(9);
    expect(instance.bags[player1.id].chips.length).toBe(8);
    expect(instance.bags[player1.id].fullBag.includes(chip)).toEqual(true);
    expect(instance.bags[player1.id].chips.includes(chip)).toEqual(false);
    expect(instance.playerRoundStates[player1.id].placedChips).toEqual([chip]);

    const secondChip = instance.drawChipForPlayer(player1.id);
    expect(instance.playerRoundStates[player1.id].placedChips).toEqual([chip, secondChip]);
  });

  it('ends the turn when too many white chips are drawn', () => {
    const instance = new GameInstance();
    const player1 = instance.addNewPlayer('Player 1');
    expect(instance.playerRoundStates[player1.id].hasExploded).toEqual(false);
    expect(instance.playerRoundStates[player1.id].hasEndedPhase).toEqual(false);

    while (instance.playerRoundStates[player1.id].getWhiteChipValues() <= 7) {
      expect(instance.playerRoundStates[player1.id].hasExploded).toEqual(false);
      expect(instance.playerRoundStates[player1.id].hasEndedPhase).toEqual(false);
      instance.drawChipForPlayer(player1.id);
    }

    expect(instance.playerRoundStates[player1.id].hasExploded).toEqual(true);
    expect(instance.playerRoundStates[player1.id].hasEndedPhase).toEqual(true);
  });

  it('allows you to use a flask to get rid of a white chip', () => {
    const instance = new GameInstance();
    const player1 = instance.addNewPlayer('Player 1');

    const whiteChip = { type: ChipType.WHITE, value: 1, cost: 0 };
    instance.bags[player1.id].chips = [whiteChip];
    instance.drawChipForPlayer(player1.id);

    expect(instance.playerRoundStates[player1.id].placedChips).toEqual([whiteChip]);
    instance.consumeFlaskForPlayer(player1.id);
    expect(instance.playerRoundStates[player1.id].placedChips).toEqual([]);
    expect(instance.playerGlobalStates[player1.id].isFlaskAvailable).toEqual(false);

    instance.playerGlobalStates[player1.id].rubies = 0;
    expect(() => instance.playerGlobalStates[player1.id].buyFlask()).toThrowError(/Illegal State: Not enough rubies to buy flask/i);

    instance.playerGlobalStates[player1.id].rubies = 2;
    instance.playerGlobalStates[player1.id].buyFlask();
    expect(instance.playerGlobalStates[player1.id].rubies).toEqual(0);
    expect(instance.playerGlobalStates[player1.id].isFlaskAvailable).toEqual(true);
  });
});

function progressAllPhases(instance: GameInstance) {
  expect(instance.currentGamePhase).toEqual(GamePhase.INITIALIZATION_OF_TURN);
  for (let i = 0; i < 9; i++) {
    instance.progressGamePhase();
  }
  expect(instance.currentGamePhase).toEqual(GamePhase.INITIALIZATION_OF_TURN);
}
