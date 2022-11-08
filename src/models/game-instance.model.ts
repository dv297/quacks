import generateId from '@utils/generateId';
import shuffle from '@utils/shuffleArray';

type Brand<K, T> = K & { __brand: T };

type PlayerId = Brand<string, 'playerId'>;
type GameId = Brand<string, 'gameId'>;

interface BoardSpot {
  victoryPoints: number;
  coins: number;
  hasRuby: boolean;
}

const createBoardSpot = (coins: number, victoryPoints: number, hasRuby = false): BoardSpot => {
  return {
    coins,
    victoryPoints,
    hasRuby,
  };
};

const BoardSpots: BoardSpot[] = [
  createBoardSpot(1, 0),
  createBoardSpot(2, 0),
  createBoardSpot(3, 0),
  createBoardSpot(4, 0),
  createBoardSpot(5, 0, true),
  createBoardSpot(6, 1),
  createBoardSpot(7, 1),
  createBoardSpot(8, 1),
  createBoardSpot(9, 1, true),
  createBoardSpot(10, 1),
  createBoardSpot(11, 1),
  createBoardSpot(12, 2),
  createBoardSpot(13, 2, true),
  createBoardSpot(14, 2),
  createBoardSpot(15, 3),
  createBoardSpot(15, 3, true),
  createBoardSpot(16, 3),
  createBoardSpot(16, 4),
  createBoardSpot(17, 4),
  createBoardSpot(17, 4, true),
  createBoardSpot(18, 4),
  createBoardSpot(18, 5),
  createBoardSpot(19, 5),
  createBoardSpot(19, 5, true),
  createBoardSpot(20, 5),
  createBoardSpot(20, 6),
  createBoardSpot(21, 6),
  createBoardSpot(21, 6, true),
  createBoardSpot(22, 7),
  createBoardSpot(22, 7, true),
  createBoardSpot(23, 7),
  createBoardSpot(23, 8),
  createBoardSpot(24, 8),
  createBoardSpot(24, 8, true),
  createBoardSpot(25, 9),
  createBoardSpot(25, 9, true),
  createBoardSpot(26, 9),
  createBoardSpot(26, 10),
  createBoardSpot(27, 10),
  createBoardSpot(27, 10, true),
  createBoardSpot(28, 11),
  createBoardSpot(28, 11, true),
  createBoardSpot(29, 11),
  createBoardSpot(29, 11),
  createBoardSpot(30, 12),
  createBoardSpot(30, 12, true),
  createBoardSpot(31, 12),
  createBoardSpot(31, 13),
  createBoardSpot(32, 13),
  createBoardSpot(32, 13, true),
  createBoardSpot(33, 14),
  createBoardSpot(33, 14, true),
  createBoardSpot(35, 15),
];

class Player {
  public id: PlayerId;
  public name: string;

  constructor(name: string) {
    this.id = generateId() as PlayerId;
    this.name = name;
  }
}

class PlayerGlobalState {
  startingDropletIndex = 0;
  ratOffset = 0;
  victoryPoints = 0;
  coins = 0;
  rubies = 0;
  isFlaskAvailable = true;

  consumeFlask() {
    if (!this.isFlaskAvailable) {
      throw new Error('Illegal State: No flask to consume');
    }

    this.isFlaskAvailable = false;
  }

  buyFlask() {
    if (this.isFlaskAvailable) {
      throw new Error('Illegal State: Cannot buy flask when flask is already available');
    }

    if (this.rubies < 2) {
      throw new Error('Illegal State: Not enough rubies to buy flask');
    }

    this.isFlaskAvailable = true;
    this.rubies -= 2;
  }

  moveDroplet() {
    this.startingDropletIndex++;
  }
}

class PlayerRoundState {
  hasExploded = false;
  hasEndedPhase = false;
  nextPotSpotIndex = 1;
  placedChips: Chip[] = [];
  boughtChips: Chip[] = [];
  chipTypeAlreadyBoughtByPlayerForRound: Record<ChipType, boolean | undefined> = {
    [ChipType.WHITE]: false,
    [ChipType.GREEN]: false,
    [ChipType.BLUE]: false,
    [ChipType.RED]: false,
    [ChipType.YELLOW]: false,
    [ChipType.PURPLE]: false,
    [ChipType.ORANGE]: false,
    [ChipType.BLACK]: false,
  };

  placeChip(chip: Chip) {
    this.placedChips.push(chip);
    this.nextPotSpotIndex++;

    if (this.getWhiteChipValues() > 7) {
      this.hasExploded = true;
      this.hasEndedPhase = true;
    }
  }

  getLastPlacedChip() {
    return this.placedChips[this.placedChips.length - 1];
  }

  checkIfChipTypeWasAlreadyBoughtForRound(chipType: ChipType) {
    return this.chipTypeAlreadyBoughtByPlayerForRound[chipType];
  }

  markChipAsBoughtForRound(chipType: ChipType) {
    this.chipTypeAlreadyBoughtByPlayerForRound[chipType] = true;
  }

  getWhiteChipValues() {
    const whiteChips = this.placedChips.filter(chip => chip.type === ChipType.WHITE);
    const total = whiteChips.reduce((acc, entry) => acc + entry.value, 0);

    return total;
  }
}

export enum ChipType {
  WHITE = 'WHITE',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  RED = 'RED',
  YELLOW = 'YELLOW',
  PURPLE = 'PURPLE',
  ORANGE = 'ORANGE',
  BLACK = 'BLACK',
}

interface Chip {
  type: ChipType;
  value: number;
  cost: number;
}

function createChip(chipType: ChipType, value: number, cost: number): Chip {
  return {
    type: chipType,
    value,
    cost,
  };
}

class Bag {
  public chips: Chip[] = [];

  public fullBag: Chip[] = [];

  draw(): Chip {
    this.shuffle();
    const chip = this.chips.pop();
    return chip;
  }

  addChip(chip: Chip) {
    this.chips.push(chip);
    this.fullBag.push(chip);
  }

  refill() {
    this.chips = [];
    this.fullBag.forEach(chip => this.chips.push(chip));
  }

  checkCount(chipType: ChipType, chipValue: number) {
    return this.chips.filter(chip => chip.type === chipType && chip.value === chipValue).length;
  }

  private shuffle() {
    shuffle(this.chips);
  }
}

enum GamePhase {
  INITIALIZATION_OF_TURN = 'INITIALIZATION_OF_TURN',
  FORTUNE_TELLER_PHASE = 'FORTUNE_TELLER_PHASE',
  POTION_PHASE = 'POTION_PHASE',
  BONUS_DIE_ROLL = 'BONUS_DIE_ROLL',
  CHIP_EVALUATIONS = 'CHIP_EVALUATIONS',
  RUBY_EVALUATIONS = 'RUBY_EVALUATIONS',
  VICTORY_POINT_EVALUATIONS = 'VICTORY_POINT_EVALUATIONS',
  BUY_PHASE = 'BUY_PHASE',
  END_OF_TURN = 'END_OF_TURN',
}

class MerchantStore {
  availableChips: Record<ChipType, Record<number, Chip[]>> = {
    [ChipType.WHITE]: {},
    [ChipType.GREEN]: {},
    [ChipType.BLUE]: {},
    [ChipType.RED]: {},
    [ChipType.YELLOW]: {},
    [ChipType.PURPLE]: {},
    [ChipType.ORANGE]: {},
    [ChipType.BLACK]: {},
  };

  constructor() {
    this.initializeChips(ChipType.WHITE, 1, 0, 20);
    this.initializeChips(ChipType.WHITE, 2, 0, 8);
    this.initializeChips(ChipType.WHITE, 3, 0, 4);

    this.initializeChips(ChipType.GREEN, 1, 1, 15);
    this.initializeChips(ChipType.GREEN, 2, 2, 10);
    this.initializeChips(ChipType.GREEN, 4, 4, 13);

    this.initializeChips(ChipType.BLUE, 1, 5, 14);
    this.initializeChips(ChipType.BLUE, 2, 10, 10);
    this.initializeChips(ChipType.BLUE, 4, 19, 10);

    this.initializeChips(ChipType.RED, 1, 6, 12);
    this.initializeChips(ChipType.RED, 2, 10, 8);
    this.initializeChips(ChipType.RED, 4, 16, 10);

    this.initializeChips(ChipType.ORANGE, 1, 3, 20);

    this.initializeChips(ChipType.BLACK, 1, 10, 18);
  }

  private initializeChips(chipType: ChipType, value: number, cost: number, count: number) {
    for (let i = 0; i < count; i++) {
      if (!this.availableChips[chipType][value]) {
        this.availableChips[chipType][value] = [];
      }

      this.availableChips[chipType][value].push(createChip(chipType, value, cost));
    }
  }

  checkIfChipIsAvailable(chipType: ChipType, value: number) {
    return this.availableChips[chipType][value].length > 0;
  }

  getChipCost(chipType: ChipType, value: number) {
    return this.availableChips[chipType][value][0].cost;
  }

  addYellowChipsToStore() {
    this.initializeChips(ChipType.YELLOW, 1, 8, 13);
    this.initializeChips(ChipType.YELLOW, 2, 12, 6);
    this.initializeChips(ChipType.YELLOW, 4, 18, 10);
  }

  addPurpleChipsToStore() {
    this.initializeChips(ChipType.PURPLE, 1, 9, 15);
  }

  distributeChip(chipType: ChipType, value: number): Chip {
    if (this.availableChips[chipType][value].length === 0) {
      throw new Error(`Cannot distribute chip: no chips of type ${chipType} to distribute`);
    }

    const chip = this.availableChips[chipType][value].pop();

    return chip;
  }
}

class GameInstance {
  public id: GameId;
  public players: Player[] = [];
  public playerGlobalStates: Record<PlayerId, PlayerGlobalState> = {};
  public playerRoundStates: Record<PlayerId, PlayerRoundState> = {};
  public bags: Record<PlayerId, Bag> = {};
  public startingPlayerTurnIndicator: PlayerId;
  public gameTurn = 1;
  public currentActionMaker: PlayerId;
  public currentGamePhase: GamePhase = GamePhase.INITIALIZATION_OF_TURN;
  public merchantStore: MerchantStore = new MerchantStore();

  progressGamePhase() {
    const orderedPhases = [
      GamePhase.INITIALIZATION_OF_TURN,
      GamePhase.FORTUNE_TELLER_PHASE,
      GamePhase.POTION_PHASE,
      GamePhase.BONUS_DIE_ROLL,
      GamePhase.CHIP_EVALUATIONS,
      GamePhase.RUBY_EVALUATIONS,
      GamePhase.VICTORY_POINT_EVALUATIONS,
      GamePhase.BUY_PHASE,
      GamePhase.END_OF_TURN,
    ];

    const currentIndex = orderedPhases.findIndex(phase => phase === this.currentGamePhase);

    if (currentIndex === -1) {
      throw new Error('Invalid state');
    }

    const newIndex = (currentIndex + 1) % orderedPhases.length;
    this.currentGamePhase = orderedPhases[newIndex];

    if (this.currentGamePhase === GamePhase.INITIALIZATION_OF_TURN) {
      this.progressGameTurn();
    }
  }

  private initializeRoundSpecificRules() {
    switch (this.gameTurn) {
      case 2: {
        this.merchantStore.addYellowChipsToStore();
        break;
      }
      case 3: {
        this.merchantStore.addPurpleChipsToStore();
        break;
      }
      case 6: {
        this.players.forEach(player => {
          this.giveChipToPlayerFromStore(player.id, ChipType.WHITE, 1);
        });
      }
      default: {
        // No-op
      }
    }
  }

  private resetPlayerBags() {
    this.players.forEach(player => {
      this.bags[player.id].refill();
    });
  }

  progressGameTurn() {
    this.gameTurn += 1;
    this.resetPlayerBags();
    this.progressStartingPlayer();
    this.initializeRoundSpecificRules();
  }

  private findNextPlayer(playerId: PlayerId): Player {
    const indexOfCurrentPlayer = this.players.findIndex(player => player.id === playerId);

    if (indexOfCurrentPlayer === -1) {
      throw new Error('Illegal state, could not find previous player');
    }

    const newIndex = (indexOfCurrentPlayer + 1) % this.players.length;
    return this.players[newIndex];
  }

  private progressStartingPlayer() {
    const nextPlayer = this.findNextPlayer(this.startingPlayerTurnIndicator);
    this.startingPlayerTurnIndicator = nextPlayer.id;
  }

  progressActionMakingPlayer() {
    const nextPlayer = this.findNextPlayer(this.currentActionMaker);
    this.currentActionMaker = nextPlayer.id;
  }

  private distributeStartingChips(playerId: PlayerId) {
    const starterChips = [
      { type: ChipType.GREEN, value: 1 },
      { type: ChipType.ORANGE, value: 1 },
      { type: ChipType.WHITE, value: 3 },
      { type: ChipType.WHITE, value: 2 },
      { type: ChipType.WHITE, value: 2 },
      { type: ChipType.WHITE, value: 1 },
      { type: ChipType.WHITE, value: 1 },
      { type: ChipType.WHITE, value: 1 },
      { type: ChipType.WHITE, value: 1 },
    ];

    for (const chip of starterChips) {
      this.giveChipToPlayerFromStore(playerId, chip.type, chip.value);
    }
  }

  private giveChipToPlayerFromStore(playerId: PlayerId, chipType: ChipType, value: number) {
    this.bags[playerId].addChip(this.merchantStore.distributeChip(chipType, value));
  }

  addNewPlayer(name: string): Player {
    const player = new Player(name);
    this.players.push(player);
    this.playerGlobalStates[player.id] = new PlayerGlobalState();
    this.playerRoundStates[player.id] = new PlayerRoundState();
    this.bags[player.id] = new Bag();

    this.distributeStartingChips(player.id);

    if (!this.startingPlayerTurnIndicator) {
      this.startingPlayerTurnIndicator = player.id;
    }

    if (!this.currentActionMaker) {
      this.currentActionMaker = player.id;
    }

    return player;
  }

  sellChipToPlayer(playerId: PlayerId, chipType: ChipType, chipValue: number) {
    const isChipAvailable = this.merchantStore.checkIfChipIsAvailable(chipType, chipValue);

    if (!isChipAvailable) {
      throw new Error('Illegal State: Chip is not available for purchase');
    }

    if (this.playerRoundStates[playerId].checkIfChipTypeWasAlreadyBoughtForRound(chipType)) {
      throw new Error('Illegal State: Chip type was already bought for this round');
    }

    const chipCost = this.merchantStore.getChipCost(chipType, chipValue);
    const playerCoins = this.playerGlobalStates[playerId].coins;

    if (chipCost > playerCoins) {
      throw new Error('Illegal State: Player does not have enough money to buy chip');
    }

    this.playerGlobalStates[playerId].coins -= chipCost;
    this.giveChipToPlayerFromStore(playerId, chipType, chipValue);
    this.playerRoundStates[playerId].markChipAsBoughtForRound(chipType);
  }

  drawChipForPlayer(playerId: PlayerId): Chip {
    const chip = this.bags[playerId].draw();
    this.playerRoundStates[playerId].placeChip(chip);

    return chip;
  }

  consumeFlaskForPlayer(playerId: PlayerId) {
    if (!this.playerGlobalStates[playerId].isFlaskAvailable) {
      throw new Error('Illegal state: No flask to consume');
    }

    if (this.playerRoundStates[playerId].hasExploded) {
      throw new Error('Illegal state: Cannot consume flask when already exploded');
    }

    if (this.playerRoundStates[playerId].getLastPlacedChip().type !== ChipType.WHITE) {
      throw new Error('Illegal state: Cannot use flask unless last placed chip was white');
    }

    this.playerGlobalStates[playerId].consumeFlask();
    this.playerRoundStates[playerId].placedChips.pop();
  }

  moveDropletForPlayer(playerId: PlayerId) {
    this.playerGlobalStates[playerId].moveDroplet();
  }
}

export default GameInstance;
export { GamePhase };
