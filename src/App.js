//CSS
import './App.css';

//React
import {useCallback, useEffect, useState} from "react";

//data
import { wordsList } from './data/words';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name : "start"},
  {id: 2, name : "game"},
  {id: 3, name : "end"}
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //pegar uma categoria randomica
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]



    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]



    return {word, category}
  }, [words])
  
  //inicio do jogo
  const startGame = useCallback(() => {
    //apagar todoas as letras
    clearLetterStates();

    //escolha as letras e escolhas as palavras
    const { word , category } = pickWordAndCategory();

    // criar um array de palavras
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase());



    //setar os estados
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // processo de input da letra
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //checar se já foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    //colocar as chances de tentativas
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      //diminui as tentativas
      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }
  

  //verifica se as tentativas terminaram
  useEffect(() => {

    if(guesses <= 0) {
      // reseta todos os estados
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  //verificar se ele ganhou
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length) {
      // adicionar pontuação
      setScore((actualScore) => actualScore += 100)

      //reinicia o game com outra palavra
      startGame()
    }



  }, [guessedLetters, letters, startGame])

  //reiniciar o game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame = {startGame}/>}
      {gameStage === 'game' && <Game verifyLetter = {verifyLetter} pickedWord = {pickedWord} pickedCategory= {pickedCategory} letters = {letters} guessedLetters= {guessedLetters} wrongLetters= {wrongLetters} guesses= {guesses} score= {score}/>}
      {gameStage === 'end' && <GameOver retry={retry} score= {score}/>}
    </div>
  );
}

export default App;
