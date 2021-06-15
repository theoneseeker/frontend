import React from 'react';
import BoardComponent from "./components/BoardComponent";
import GamesComponent from "./components/GamesComponent";
import GameContextProvider from "./context/GameContextProvider";
import { ToastProvider } from 'react-toast-notifications';


function App() {

    return (
        <div className="App">
            <header className="App-header">
            </header>
            {/*Context provider component below makes sure the context is accessible in any children components*/}
                <GameContextProvider>
                    <GamesComponent />
                    <BoardComponent />
                </GameContextProvider>
        </div>
    );
}

export default App;
