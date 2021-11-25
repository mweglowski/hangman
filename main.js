const startGameButton = document.querySelector('.start-game-btn')

const wordEntranceBox = document.querySelector('.word-entrance-box')

const drawBox = document.querySelector('.draw-box')

const letterContentBox = document.querySelector('.letter-content-box')
const correctLettersBox = document.querySelector('.correct-letters-box')
const letterStorageBox = document.querySelector('.letter-storage-box')

// Global State
let state = {
    wordToGuess: '',
    usedLetters: [],
    attempts: 0,
    incorrectTries: 0,
    ready: false
}

const allowedCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890'

// Start Game
startGameButton.addEventListener('click', (event) => {
    // Hide start game button
    event.target.classList.add('hide')

    // Show word entrance box
    showWordEntranceBox()

    // Submit word, set wordToGuess in global state and start whole actions
    submitWordAndPerformActions()
})


// Show input box to enter specific word to guess
function showWordEntranceBox() {
    wordEntranceBox.classList.remove('hide')
}

// Mechanics of the game
// Everything is set and performed after clicking submit button
function submitWordAndPerformActions() {
    const submitWordButton = document.querySelector('.submit-word-btn')

    submitWordButton.addEventListener('click', () => {
        state.ready = true

        const wordEntranceInput = document.querySelector('#word-entrance-input')

        if (wordEntranceInput.value === '') return

        // Set word to guess, clear whitespaces from the beginning and capitalize letters
        while (state.wordToGuess[0] === ' ') {
            state.wordToGuess = state.wordToGuess.slice(1)
        }

        state.wordToGuess = wordEntranceInput.value.toUpperCase()

        // Clear and hide entranceBox
        wordEntranceInput.value = ''
        wordEntranceBox.classList.add('hide')

        // Show hangman box, storage box for used letters and list, which will be filled with correct guessed letters
        showContent()

        // Fill letter box with squares
        for (let letter of state.wordToGuess) {
            const letterCell = document.createElement('div')
            letterCell.classList.add('letter-cell')
            letterCell.dataset.letter = letter

            if (letter === ' ') {
                letterCell.style.border = 'none'
                letterCell.dataset.space = 'true'
            } else {
                letterCell.dataset.space = 'false'
            }

            correctLettersBox.appendChild(letterCell)
        }

        // Listen to keydowns if specific key is pressed, then specific action is made
        // If wordToGuess includes pressed letter then specific box in list is filled with this letter, otherwise another element of hangman is painted and new letter(if there wasn't previously) is appended to storage box for used letters
        window.addEventListener('keydown', (event) => {
            let key = event.key.toUpperCase()

            // If user win this keydown handlers will be desactivated 
            if (!state.ready || !allowedCharacters.includes(event.key)) return

            state.attempts += 1
            
            if (!checkIfLetterIsUsed(key)) {
                // Update used letters in state
                state.usedLetters.push(key)

                if (state.wordToGuess.includes(key)) {
                    fillSpecificCellsWithLetters(key)
                } else {
                    state.incorrectTries += 1
                    state.incorrectTries === 12 && showLoss() 

                    drawHangman()
                }
        
                appendLetterToLetterStorageBox(key)
            } else {
                console.log('you tried this letter')
            }
        })

    })
}

// Show main content, hangman box, guessed letters box, letter storage box
function showContent() {
    drawBox.classList.remove('hide')
    letterContentBox.classList.remove('hide')
}

// Check if you have already used this letter
function checkIfLetterIsUsed(letter) {
    return state.usedLetters.includes(letter)
}

// Fill specific cells in correct letters box 
function fillSpecificCellsWithLetters(correctLetter) {
    Array.from(correctLettersBox.children).forEach(cell => {
        if (cell.textContent === '') {
            if (cell.dataset.letter === correctLetter) {
                cell.textContent = correctLetter
            }
        }
    })

    // Check if every cell is filled after action
    checkForWin()
}

// Check if every cell is filled with letter
function checkForWin() {
    let everyFilled = true
    const correctLettersBoxChildren = Array.from(correctLettersBox.children)

    for (let i = 0; i < correctLettersBoxChildren.length; i++) {
        if (correctLettersBoxChildren[i].dataset.space === 'true') {
            continue
        }
        if (correctLettersBoxChildren[i].textContent === '') {
            everyFilled = false
            break
        }
    }

    everyFilled && showWin()
}

// Draw next part of hangman
function drawHangman() {
    const nextPart = document.querySelector(`.hangman-element-${state.incorrectTries - 1}`)

    nextPart.style.opacity = 1
}

// Append incorrect letter to letter storage box
function appendLetterToLetterStorageBox(letter) {
    const usedLetter = document.createElement('div')
    usedLetter.classList.add('used-letter')
    usedLetter.textContent = letter

    letterStorageBox.appendChild(usedLetter)
}

// Show win
function showWin() {
    state.ready = false

    const winNotification = document.querySelector('.win-notification')

    winNotification.style.top = "100px"
    setTimeout(() => {
        winNotification.style.top = "-200px"
    }, 2000)
}

// Show loss
function showLoss() {
    state.ready = false

    const lossNotification = document.querySelector('.loss-notification')

    lossNotification.style.top = "100px"
    setTimeout(() => {
        lossNotification.style.top = "-200px"
    }, 2000)
}