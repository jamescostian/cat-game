'use strict'
const forcedPaddingPercentage = 5
let gameStartedAt = false
import catDB from './cat-db.js'
import {randomInt, fadeInOut} from './utils.js'

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
  let catElement = document.createElement('img')
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
    // Now find out how long the game lasted, and tell the user how they did
    const gameLasted = gameStartedAt ? Date.now() - gameStartedAt : 0 // in ms
    document.querySelector('.left').textContent = 'After ' + (gameLasted / 1000).toFixed(3) + 's'
    document.querySelector('.big').textContent = 'You lost!'
    // Also give the user some helpful links
    document.querySelector('.right').innerHTML = `
      See <a href=https://github.com/jamescostian/jamescostian.github.io>the code</a>,<br>
      <a href="resume.pdf">my résumé</a>,<br>
      or <a href="?">play again</a>
    `
  }
}

window.addEventListener('load', () => {
  // If this website was seen recently, then there must be 1+ cookie(s)
  const recentlySeen = !!document.cookie
  // Now that we've checked for cookies, we can set a cookie to remember that this site has been seen recently
  let expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 1) // This cookie expires in 1 day
  document.cookie = 'recently=seen; expires=' + expirationDate.toUTCString() + '; path=/'
  // Setup the first cat
  setTimeout(() => setupNewCat(catDB[0]), recentlySeen ? 1750 : 3000)
})
