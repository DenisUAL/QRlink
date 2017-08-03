var errorEl = document.getElementById('error')
var canvasEl = document.getElementById('canvas')
var textEl = document.getElementById('input-text')

function debounce(func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate)
        func.apply(context, args)
    }

    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow)
      func.apply(context, args)
  }
}

function drawQR(text) {
  errorEl.style.display = 'none'
  canvasEl.style.display = 'block'

  qrcodelib.toCanvas(canvasEl, text, {
    version: 'auto',
    errorCorrectionLevel: 'errorLevelEl.options',
    margin: 4,
    color: {
      light: '#ffffff',
      dark: '#000000'
    },
    toSJISFunc: qrcodelib.toSJIS
  }, function (error, canvas) {
    if (error) {
      canvasEl.style.display = 'none'
      errorEl.style.display = 'inline'
      errorEl.textContent = error
    }
  })
}

var updateQR = debounce(function () {
  drawQR(textEl.value)
}, 250)

textEl.addEventListener('keyup', updateQR, false)
textEl.addEventListener('change', updateQR, false)

chrome
  .tabs
  .query({
    active: true,
    lastFocusedWindow: true
  }, (tabs) => {
    drawQR(textEl.value || tabs[0].url)
  })
