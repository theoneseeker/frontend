import React, { FunctionComponent, useContext, useState } from "react";
import { Game } from "../types/Game";
import GameContext from "../context/GameContext";
import styles from "../styling/MenuComponent.module.scss" //Import css module
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PlayerIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import {blue, deepOrange, deepPurple, green, lightBlue, red, yellow} from '@material-ui/core/colors';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


export type GameComponentProps = {
    game: Game
}

//Colors to be used for buttons or similar
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
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

export const GameComponent: FunctionComponent<GameComponentProps> = ({ game }) => {
    const { selectGame } = useContext(GameContext)
    const { deleteGame } = useContext(GameContext)
    let [edit, setEdit] = useState(false);
    let [name, setName] = useState(game.gameName);

    const onClickGame = async () => {
        selectGame(game)
    }

    const classes = useStyles();

    const onSubmit = () => {
        setEdit(false);
    };
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const onClickDelete = async () => {
        deleteGame(game)
    }


    return (

        <div className={styles.container} >
            <Box m={2}>
                <Card>
                    <CardContent>
                        <Box>
                            {!edit ? <Typography variant="h5" align="left">{name} - {game.gameId}</Typography> :
                                <Typography component={'span'} variant={'body2'} align="center">
                                    <form onSubmit={onSubmit}>

                                        <TextField variant="outlined" label="Edit" onChange={onChange} />

                                    </form>
                                </Typography>}
                                <br/>
                            {game.gameUsers.map((user, index) => <ListItem key={index}>
                                    <br/>
                                <ListItemText
                                    primary={"name " + user.playerName }
                                    secondary ={"Controls player: " + user.playerId}
                                />
                                    <br/>
                            </ListItem>
                                )}
                        </Box>


                            {!edit ? <Button className={classes.green} size="small" color="primary" onClick={onClickGame}>Go to game</Button> : <Button className={classes.green} size="small" color="primary" type="submit" onClick={onSubmit}>Save game</Button>}
                            <br/>
                            {!edit ? <Button className={classes.yellow} size="small" color="primary" onClick={() => setEdit(true)}>Edit name</Button> : <Button className={classes.red} size="small" color="primary" onClick={() => setEdit(false)}>Cancel</Button>}
                        <br/>
                            {!edit ? <Button className={classes.red} size="small" color="primary" onClick={onClickDelete}>Delete</Button> : <div />}

                    </CardContent>
                </Card>
            </Box>
        </div >

    )
}