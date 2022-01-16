import catDB from './cat-db.js'
import { randomInt, fadeInOut } from './utils.js'
const forcedPaddingPercentage = 5
let gameStartedAt = false
const startDelay = { firstTime: 3500, tryingAgain: 500 }

const catsLeft = () => document.querySelector('.cats').children.length

// Given a cat and dimensions to put it in, find a good position for it (margins from the top and left, in percentages)
const positionCat = (cat, totalWidth, totalHeight) => {
  // widthLeftOver = how much width (percentage of the screen) will be left over after the cat is inserted
  const widthLeftOver = 100 - parseInt(cat.width, 10)
  // catActualPixelWidth stores how many pixels wide the actual image is
  // The cat.width (which is a percentage of the screen) is turned into a fraction, and then multiplied by the screen's width
  const catActualPixelWidth = parseInt(cat.width, 10) / 100 * totalWidth
  // Divide the width by the width to height ratio to find the height
  const catActualPixelHeight = catActualPixelWidth / cat.wth
  // heightLeftOver = how much height (percentage of the screen) will be left over after the cat is inserted
  const heightLeftOver = 100 - (catActualPixelHeight / totalHeight * 100)
  return {
    top: randomInt(forcedPaddingPercentage, heightLeftOver - forcedPaddingPercentage) + '%',
    left: randomInt(forcedPaddingPercentage, widthLeftOver - forcedPaddingPercentage) + '%'
  }
}
// Create a new cat inside of .cats
const setupNewCat = (cat) => {
  // Set up a new img.cat with the image's src and set its width (which is a percentage of the screen)
  const catElement = document.createElement('img')
  catElement.classList.add('cat')
  catElement.setAttribute('src', cat.url)
  catElement.setAttribute('width', cat.width)
  catElement.setAttribute('style', 'user-drag: none; -moz-user-select: none; -webkit-user-drag: none;')

  catElement.style.position = 'fixed'
  const position = positionCat(cat, window.innerWidth, window.innerHeight)
  catElement.style.top = position.top
  catElement.style.left = position.left

  const onClick = () => {
    catElement.parentNode.removeChild(catElement)
    if (cat.id === 0) {
      gameStartedAt = Date.now()
      setupNewCat(catDB[1])
      setupNewCat(catDB[1])
    } else if (cat.id + 1 < catDB.length && Math.random() > 0.3) {
      setupNewCat(catDB[cat.id + 1])
      if (Math.random() > 0.8) setupNewCat(catDB[cat.id + 1])
    } else if (cat.id !== 1 && Math.random() > 0.7) {
      setupNewCat(catDB[cat.id - 1])
    } else if (Math.random() > 0.2 || catsLeft() < 2) {
      setupNewCat(catDB[cat.id])
    }
  }
  catElement.addEventListener('click', onClick)
  catElement.addEventListener('touchstart', onClick)
  document.querySelector('.cats').appendChild(catElement)
  fadeInOut(catElement, cat.delay, cat.duration).then(() => {
    if (catElement.parentNode) {
      catElement.parentNode.removeChild(catElement)
    }
    setTimeout(checkIfGameOver, randomInt(10, 40))
  })
}

let checkIfGameOver = () => {
  if (catsLeft() >= 1) {
    return false // This is not a game over, because there is still 1 or more cats on the screen
  } else {
    // GAME OVER! First, make sure subsequent calls to this function are no-ops
    checkIfGameOver = () => {}
    // Now find out how long the game lasted
    const gameLasted = gameStartedAt ? Date.now() - gameStartedAt : 0 // in ms
    if (gameLasted === 0) {
      // The user didn't play at all!
      // They probably didn't realize they were supposed to click on the cat pictures
      document.querySelector('.left').textContent = 'To play the game, '
      document.querySelector('.big').textContent = 'Click on the cat!'
      document.querySelector('.right').innerHTML = `
        Don't worry,<br>
        I'll restart the game.<br>
        But do better this time!
      `
      setTimeout(window.location.reload.bind(window.location), 6000)
    } else {
      // Let the user know the game is over, as well as how long they laster
      document.querySelector('.left').textContent = 'After ' + (gameLasted / 1000).toFixed(3) + 's'
      document.querySelector('.big').textContent = 'You lost!'
      // Let the user see the code or play the game again
      document.querySelector('.right').innerHTML = `
        You didn't click on Beans fast enough!<br>
        But you can see <a href=https://github.com/jamescostian/cat-game>the code</a> or <a href="?tryAgain">play again</a>
      `
    }
  }
}

window.addEventListener('load', () => {
  preloadCatImages()

  // Setup the first cat - once it's set up, the whole game will be set in motion.
  // If the user is trying again after failing, then they don't need as much time to read, so start the game up much more quickly
  const isTryingAgain = window.location.search === '?tryAgain'
  setTimeout(() => setupNewCat(catDB[0]), isTryingAgain ? startDelay.tryingAgain : startDelay.firstTime)
})

function preloadCatImages(index = 0) {
  const img = document.createElement('img')
  img.setAttribute('src', catDB[index].url)
  img.setAttribute('alt', `loading cat picture ${index + 1} so it's ready during the game`)
  document.querySelector('.preload').appendChild(img)
  // Load the next image after this one loads - this way images that are needed sooner (to be used in the game) will be prioritized
  img.addEventListener('load', () => {
    const nextIndex = index + 1
    if (nextIndex < catDB.length) {
      preloadCatImages(nextIndex)
    }
  })
}
