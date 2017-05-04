export function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function sleep (duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

// Fades an element in or out (depending on the first argument), for a duration (in ms)
// Usage: fade('in', someElement, 500).then(afterElementFadedIn)
export function fade (fadeIn, element, duration) {
  return new Promise((resolve) => {
    fadeIn = fadeIn === 'in'
    const fadeStartedAt = window.performance.now()
    const step = () => {
      // Find the percent of the duration that has already elapsed:
      let percentElapsed = (window.performance.now() - fadeStartedAt) / duration * 100
      if (percentElapsed >= 99) {
        element.style.opacity = fadeIn ? 1 : 0
        resolve()
      } else {
        element.style.opacity = fadeIn ? (percentElapsed / 100) : (1 - percentElapsed / 100)
        window.requestAnimationFrame(step)
      }
    }
    step()
  })
}

// Given an element, hide and fade it in for duration (in ms), pause for delay (in ms), and then fade it out for duration.
// Returns a promise that resolves when the element has finished fading out.
export function fadeInOut (element, delay, duration) {
  return new Promise((resolve) => {
    element.style.opacity = 0
    fade('in', element, duration)
      .then(() => sleep(delay))
      .then(() => fade('out', element, duration))
      .then(resolve)
  })
}
