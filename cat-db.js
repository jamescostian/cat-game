// This file exports catDB, an array of objects.
// Each object represents a cat image. See lines 17-24 for a list of everything the objects have

// Width to height (wth) ratios of the images:
const imageWidthToHeight = [
  1050 / 700,
  1057 / 700,
  933 / 700,
  1057 / 700,
  1050 / 700,
  700 / 700,
  1050 / 700,
  700 / 700,
  878 / 700
]
const lastImageID = imageWidthToHeight.length - 1
const catDB = imageWidthToHeight.map((wth, id) => {
  return {
    wth: wth, // Width to height ratio
    url: 'cats/' + id + '.jpg', // URL of the cat image
    id: id, // The image's (unique) id (which is the same as it's position in the catDB array)
    duration: 800 - (id / lastImageID * 500), // The duration the image should fade in/out for
    delay: 800 - (id / lastImageID * 500), // The delay between fading in and out
    width: 40 - (id / lastImageID * 25) + '%' // The width the image should occupy
  }
})
// Force the first cat image to be extra big
catDB[0].width = '50%'
catDB[0].duration = 1000
catDB[0].delay = 3000

export default catDB

// One thing to notice is that the duration, delay, and width are always going down as the id increases.
// This is because the first cat is supposed to be very easy to click/tap on (so it's big and stays on the screen for a while), while the last cat is supposed to be the hardest to click/tap.
// You don't get to cats with higher ids until you get through the cats with lower ids, so you build up to the harder to click/tap cats
