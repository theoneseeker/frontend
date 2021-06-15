import { User } from "./User";

export type Game = {
    gameId: number,
    gameName: string,
    gameStarted: boolean,
    gameUsers: User[]
}