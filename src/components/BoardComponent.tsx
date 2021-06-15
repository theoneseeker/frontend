import React, { FunctionComponent, useContext, useState } from "react";
import { SpaceComponent } from "./SpaceComponent";
import styles from "../styling/BoardComponent.module.scss" //Import css module
import GameContext from "../context/GameContext";
import { Typography, Button } from "@material-ui/core";
import { Game } from "../types/Game";
import { User } from "../types/User";
import {blue, deepPurple, green, lightBlue, red, yellow} from '@material-ui/core/colors';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
/*
If the board component took any props/arguments they would be declared inside the type below
see the space component for an example.
 */


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        purple: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
        },
        red: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
        },
        green: {
            color: theme.palette.getContrastText(green[500]),
            backgroundColor: green[500],
        },
        blue: {
            color: theme.palette.getContrastText(lightBlue[500]),
            backgroundColor: blue[500],
        },
        yellow: {
            color: theme.palette.getContrastText(yellow[500]),
            backgroundColor: yellow[500],
        }
    }),
);

type BoardComponentProps = {}
const BoardComponent: FunctionComponent<BoardComponentProps> = () => {
    //{...} context is known as object destructuring
    const { games, board, loaded, unselectGame, startGame, endGame } = useContext(GameContext) //Hook form of Context.Consumer, used to access the context

    let [join, setJoin] = useState(false);
    let [start, setStart] = useState(false); // TODO: Add functionallity so start gets the game value instead of local boolean


    // TODO: Make better
    // Major hack to find out which game is being used in this instance
    let game = games.find(game => game.gameId === board.boardId);
    if (game === undefined) {
        console.log("Game could not be found in board")
        var users: User[] = [];
        game = {
            gameName: "null",
            gameId: 500,
            gameStarted: false,
            gameUsers: users
        };
    } else {
        // Sets local var of game to actual status
        start = game.gameStarted
    }



    const classes = useStyles();

    const onSetJoin = () => {
        setJoin(true);
    }

    const onSetLeave = () => {
        setJoin(false);
    }
    const onSetStart = () => {
        if (game !== undefined) {
            startGame(game).then(() =>
                setStart(true)
            ).catch(() =>
                setStart(false)
            );
        }
    }
    const onSetEnd = () => {
        let game: Game | undefined;
        game = games.find(game => game.gameId === board.boardId);
        if (game === undefined) {
            console.log("Game could not be found in map")
        } else {
            endGame(game);
            setStart(false);
        }
    }

    const onBack = () => {
        setJoin(false);
        unselectGame();

    }

    return (
        loaded ?
            <div className={styles.centerAll}>

                <Typography variant="h3" align="center" >Roborally </Typography>
                <Typography variant="h5" align="center" >Game name: {game.gameName} </Typography>
                <br />
                <br />
                {!start ?
                    <Typography variant="h5" align="center" >Roborally board</Typography>

                    :
                    <Typography variant="h5" align="center" >Player {board.currentPlayerDto?.playerName}'s turn. </Typography>
                }

                <br />
                <br />
                <div className={styles.container}>
                    {board.spaceDtos.map((spaceArray, index) =>
                        <div key={"spaceArray" + index}>
                            {
                                spaceArray.map((space, index) => <SpaceComponent key={"space" + index} space={space} />)
                            }
                        </div>
                    )
                    }
                </div>
                <br />
                <br />
                {!join ?
                    <Button className={classes.blue} size="large" variant="text" color="primary" onClick={onSetJoin}  >
                        Join
                    </Button>

                    :

                    < Button className={classes.red} size="large" variant="text" color="primary" onClick={onSetLeave}  >
                        Leave
                    </Button>
                }
                <br />
                    <Button  size="large" variant="text" color="primary" onClick={onBack}>
                        Back to Games
                    </Button>
                    <br />
                {!start ?
                    <Button className={classes.green} size="large" variant="text" color="primary" onClick={onSetStart}>
                        Start Game
                    </Button>
                    :
                    <Button className={classes.red} size="large" variant="text" color="primary" onClick={onSetEnd}  >
                        End Game
                    </Button>
                }

                <br />
                <br/>
                <br/>
                <Typography variant="h5">Game info</Typography>

                <Typography variant="overline">{"Board id: " + board.boardId}</Typography>
                <br/>
                <Typography variant="overline">{"Board name: " + board.boardName}</Typography>
                <br/>
                <Typography variant="overline">Players:</Typography>
                <br/>
                {board.playerDtos.map((user, index) => <Typography variant="overline" key={index}>- {user.playerName}</Typography>)}

            </div >
            :
            <div />
    )
}

export default BoardComponent


