// const { useParams } = require('react-router-dom')

const targetWords = [
  'naval',
  'cigar',
  'model',
  'focal',
  'grade',
  'blush',
  'humph',
  'mercy',
  'rayon',
  'tepid',
  'sleek',
  'faith',
  'riser',
]
const dictionary = [
  'merch',
  'mercy',
  'rayon',
  'tepid',
  'sleek',
  'faith',
  'riser',
  'merch',
  'naval',
  'royal',
]

const keyboard = document.querySelector('[data-keyboard]')
const guessGrid = document.querySelector('[data-guess-grid]')

const WORDLE_LENGTH = 5
const dayStarted = new Date()
const offseDate = Date.now() - dayStarted
const dayOffset = offseDate / 1000 / 60 / 60 / 24
const specificWord = targetWords[Math.floor(dayOffset)]
// console.log(specificWord)
const alertContainer = document.querySelector('[data-alert-container]')
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500

const startInteraction = () => {
  document.addEventListener('click', handleMouseClick)
  document.addEventListener('keydown', handleKeyPress)
}

const stopInteraction = () => {
  document.removeEventListener('click', handleMouseClick)
  document.removeEventListener('keydown', handleKeyPress)
}

const handleMouseClick = (e) => {
  if (e.target.matches('[data-key]')) {
    pressKey(e.target.dataset.key)
    return
  }
  if (e.target.matches('[data-enter]')) {
    submitGuess()
    return
  }
  if (e.target.matches('[data-delete]')) {
    deleteKey()
    return
  }
}

const handleKeyPress = (e) => {
  // console.log(e)
  if (e.key === 'Enter') {
    submitGuess()
    return
  }
  if (e.key === 'Backspace' || 'Delete') {
    deleteKey()
    return
  }
  if (e.key.match(/^[a-z]$/)) {
    pressKey()
  }
}

const pressKey = (key) => {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORDLE_LENGTH) return
  const nextTile = guessGrid.querySelector(':not([data-letter])')
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = 'active'
}

const deleteKey = () => {
  const activeTiles = getActiveTiles()
  const lastTiles = activeTiles[activeTiles.length - 1]
  if (lastTiles == null) return
  lastTiles.textContent = ''
  delete lastTiles.dataset.state
  delete lastTiles.dataset.letter
}

const submitGuess = () => {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORDLE_LENGTH) {
    showAlert('Not enough letters')
    shakeTiles(activeTiles)
    return
  }
  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, '')

  if (!dictionary.includes(guess)) {
    showAlert('Not in the list')
    shakeTiles(activeTiles)
    return
  }
  stopInteraction()
  activeTiles.forEach((...params) => flipTiles(...params, guess))
}

const flipTiles = (tile, index, array, guess) => {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key='${letter}'i]`)
  setTimeout(() => {
    tile.classList.add('flip')
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    'transitionend',
    () => {
      tile.classList.remove('flip')
      if (specificWord[index] === letter) {
        tile.dataset.state = 'correct'
        key.classList.add('correct')
      } else if (specificWord.includes(letter)) {
        tile.dataset.state = 'wrong-location'
        key.classList.add('wrong-location')
      } else {
        tile.dataset.state = 'wrong'
        key.classList.add('wrong')
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          'transitionend',
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true },
        )
      }
    },
    { once: true },
  )
}

const getActiveTiles = () => {
  return guessGrid.querySelectorAll('[data-state="active"]')
}
const showAlert = (message, duration = 1000) => {
  const alert = document.createElement('div')
  alert.textContent = message
  alert.classList.add('alert')
  alertContainer.prepend(alert)
  if (duration == null) return
  setTimeout(() => {
    alert.classList.add('hide')
    alert.addEventListener('transitionend', () => {
      alert.remove()
    })
  }, duration)
}

const shakeTiles = (tiles) => {
  tiles.forEach((tile) => {
    tile.classList.add('shake')
    tile.addEventListener(
      'animationend',
      () => {
        tile.classList.remove('shake')
      },
      { once: true },
    )
  })
}

const checkWinLose = (guess, tiles) => {
  if (guess === specificWord) {
    showAlert('You won !', 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }
  const remainingTiles = guessGrid.querySelectorAll(':not([data-letter])')

  if (remainingTiles.length === 0) {
    showAlert(specificWord.toUpperCase(), null)
    stopInteraction()
  }
}

const danceTiles = (tiles) => {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('dance')
      tile.addEventListener(
        'animationend',
        () => {
          tile.classList.remove('dance')
        },
        { once: true },
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

startInteraction()
