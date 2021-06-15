import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import GameContext from "./GameContext"
import { Player } from "../types/Player";
import { Board } from "../types/Board";
import { Space } from "../types/Space";
import { Game } from "../types/Game";
import GameApi from "../api/GameApi";





type GameContextProviderPropsType = {
    children: ReactNode
}


const GameContextProvider = ({ children }: GameContextProviderPropsType) => {
    const [games, setGames] = useState<Game[]>([])

    const [loaded, setLoaded] = useState<boolean>(false)

    // For notifications


    //The code below is executed when the provider is rendered (inside App.tsx)
    //The code should fetch the data from the API instead of using a static assignment
    //Define a useState variable, note that useState returns an array, containing that state itself aswell as
    // a function to set a new state value, here we use array destructuring (the [..., ...] notation).
    // we also declare that the state variable and setter should be of type /take type Player[]
    const [players, setPlayers] = useState<Player[]>([])
    const playerCount = useMemo(() => players.length, [players])
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
    const [currentPlayer, setCurrentPlayer] = useState<Player>({ playerId: -1, playerColor: "red", boardId: -1, playerName: "" })
    const [spaces, setSpaces] = useState<Space[][]>([])
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [gameId, setGameId] = useState<number>(0)
    const [gameName, setGameName] = useState<string>("hi")

    //Define a function used to set a player ona  specific space
    const setPlayerOnSpace = useCallback(async (space: Space) => {
        // Check if game is started
        let game = games.find(game => game.gameId === board.boardId);
        if (game?.gameStarted) {
            //Check if space already has a player standing on it
            if (!space.playerId) {
                await GameApi.moveCurrentPlayer(gameId, { ...space, playerId: currentPlayer.playerId }).then(() => {
                    let tempSpaces = [...spaces] //Use spread operator to copy spaces array, needed for making immutable changes
                    //See https://bit.ly/2My8Bfz, until the section about Immutable.js
                    tempSpaces[space.x][space.y].playerId = currentPlayer.playerId //Set the player on the new space they clicked on

                    if (currentPlayer.x !== undefined && currentPlayer.y !== undefined) { //If the player was standing on a space previously, remove them from that space
                        tempSpaces[currentPlayer.x][currentPlayer.y].playerId = undefined
                    }
                    setSpaces(tempSpaces)
                    let tempPlayers = [...players]
                    tempPlayers[currentPlayerIndex].x = space.x; //Update the players array to reflect the changes
                    tempPlayers[currentPlayerIndex].y = space.y; //Update the players array to reflect the changes
                    setPlayers(tempPlayers)
                    setCurrentPlayer({ ...currentPlayer, x: space.x, y: space.y }) //Update current player

                }).catch(() => {
                    console.error("Error while moving player")
                })

            }
        } else {

            throw 'game not started'
        }



    }, [currentPlayer, currentPlayerIndex, gameId, players, spaces])

    const switchToNextPlayer = useCallback(async () => {
        await GameApi.switchPlayer(gameId).then(() => {
            const newPlayerIndex = (currentPlayerIndex + 1) % playerCount
            console.log("old player index", currentPlayerIndex, "new player index", newPlayerIndex)
            setCurrentPlayer(players[newPlayerIndex])
            setCurrentPlayerIndex(newPlayerIndex)
        }).catch(() => console.error("Error while switching player"))

    }, [currentPlayerIndex, gameId, playerCount, players])
    const board = useMemo<Board>(() => {
        return ({
            spaceDtos: spaces,
            playerDtos: players,
            currentPlayerDto: currentPlayer,
            currentPlayerIndex: currentPlayerIndex,
            width: width,
            height: height,
            boardName: gameName,
            boardId: gameId
        })
    }, [currentPlayer, currentPlayerIndex, gameId, gameName, height, players, spaces, width])

    // Copied from "Live-møde_Uge 12_-20210503_131255-Meeting Recording.mp4"
    const selectGame = useCallback(async (game: Game) => {
        GameApi.getBoard(game.gameId).then(board => {
            setSpaces(board.spaceDtos)
            setPlayers(board.playerDtos)
            setWidth(board.width)
            setHeight(board.height)
            setGameId(board.boardId)
            setGameName(board.boardName)
            if (board.currentPlayerDto) {
                setCurrentPlayer(board.currentPlayerDto)
                board.playerDtos.forEach((player, index) => {
                    if (player.playerId === board.currentPlayerDto?.playerId) {
                        setCurrentPlayerIndex(index)
                    }
                })

            }

            setLoaded(true)
        }).catch(() => {
            console.error("Error while fetching board from backend")
        })

    }, [])

    const unselectGame = useCallback(async () => {
        setGameId(-1);
        setLoaded(false);
    }, [])

    // Copied from "Live-møde_Uge 13_-20210510_130431-Meeting Recording.mp4"
    useEffect(() => {
        const interval = setInterval(async () => {
            if (loaded && gameId >= 0) {
                GameApi.getBoard(gameId).then(board => {
                    if (gameId === board.boardId) {
                        setSpaces(board.spaceDtos)
                        setPlayers(board.playerDtos)
                        setWidth(board.width)
                        setHeight(board.height)
                        setGameId(board.boardId)
                        setGameName(board.boardName)
                        if (board.currentPlayerDto) {
                            setCurrentPlayer(board.currentPlayerDto)
                            board.playerDtos.forEach((player, index) => {
                                if (player.playerId === board.currentPlayerDto?.playerId) {
                                    setCurrentPlayerIndex(index)
                                }
                            })
                        } else {
                            console.error("Load outdated")
                        }
                    }
                }).catch(() => {
                    console.error("Board could not be loaded")
                })
            } else {
                GameApi.getGames().then(games => {
                    setGames(games)
                }).catch(() => {
                    console.error("Games could not be loaded")
                })

            }

        }, 2000)

        return () => clearInterval(interval)
    }, [loaded, gameId])


    //Deletes a game
    const deleteGame = useCallback(async (game: Game) => {
        GameApi.deleteGame(game.gameId).then(() => {
            console.log("Deleting game: " + game.gameId)

        }).catch(() => {
            console.error("Error while deleting board from backend")

        })

    }, [])

    //Starts a game.
    const startGame = useCallback(async (game: Game) => {
        if (game.gameUsers.length >= 2) {
            if (!game.gameStarted) {
                GameApi.startGame(game.gameId).then(() => {
                    game.gameStarted = true;
                    console.log("Starting game: " + game.gameId)

                }).catch(() => {
                    console.error("Error while starting game from backend")

                    throw 'Error in backend'
                })
            } else {
                console.log("Game already started: " + game.gameId + " id")

                throw 'Game is already started'

            }
        } else {
            // Logic if games do not have enough players
            console.error("Not enough players to start game: " + game.gameId + " id")
            console.log("Players in game:" + game.gameUsers.length)

            throw 'Not enough players'
        }
    }, [])

   //Ends a current game.
    const endGame = useCallback(async (game: Game) => {
        if (game.gameStarted) {
            GameApi.endGame(game.gameId).then(() => {
                game.gameStarted = false;
                console.log("Ending game: " + game.gameId);

            }).catch(() => {
                console.error("Error while ending game from backend")

            })
        } else {
            console.log("Game already stopped: " + game.gameId + " id")

        }
    }, [])



    const createGame = useCallback(async (gameName: String) => {
        GameApi.createGame(gameName).then(() => {

        }).catch(() => {
            console.error("Error while creating game from backend")

        })
    }, [])


    return (
        <GameContext.Provider
            value={
                {
                    games: games,
                    selectGame: selectGame,
                    unselectGame: unselectGame,
                    deleteGame: deleteGame,
                    startGame: startGame,
                    createGame: createGame,
                    endGame: endGame,
                    loaded: loaded,
                    board: board,
                    setCurrentPlayerOnSpace: setPlayerOnSpace,
                    switchCurrentPlayer: switchToNextPlayer
                }
            }>
            {children} {/*See: https://reactjs.org/docs/composition-vs-inheritance.html*/}
        </GameContext.Provider>
    )
}

export default GameContextProvider