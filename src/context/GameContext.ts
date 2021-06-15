import { createContext } from "react";
import { Board } from "../types/Board";
import { Space } from "../types/Space";
import { Game } from "../types/Game";


export type GameContextType = {
    games: Game[],
    selectGame: (game: Game) => Promise<void>,
    deleteGame: (game: Game) => Promise<void>,
    startGame: (game: Game) => Promise<void>,
    createGame: (gameName: String) => Promise<void>,
    endGame: (game: Game) => Promise<void>,
    unselectGame: () => Promise<void>,

    // Information of game
    loaded: boolean,
    board: Board,
    setCurrentPlayerOnSpace: (space: Space) => Promise<void>,
    switchCurrentPlayer: () => Promise<void>
}
//Define a new context of type GameContextType
//Below we define the "default" values which are set upon initialization of the context

const GameContext = createContext<GameContextType>({
    games: [],
    selectGame: async () => { },
    deleteGame: async () => { },
    unselectGame: async () => { },
    startGame: async () => { },
    endGame: async () => { },
    createGame: async () => { },

    loaded: false,
    board: {
        playerDtos: [],
        spaceDtos: [],
        boardId: -1,
        boardName: "",
        currentPlayerDto: undefined,
        height: 0,
        width: 0
    },
    setCurrentPlayerOnSpace: async () => { },
    switchCurrentPlayer: async () => { }
});

export default GameContext