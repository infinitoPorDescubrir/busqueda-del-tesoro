const app = document.getElementById("app")
const keypad = document.getElementById("keypad")
const code = document.getElementById("code")
const toggle = document.getElementById("toggle")
const map = document.getElementById("map")
const video = document.getElementById("video")
const click = new Audio('click.mp3')
const error = new Audio('error.mp3')

let mapSelected = false

/*
the expected answer is right in the location hash base64 encoded
you can generate your own urls by encoding the expeted answer with
https://www.base64encode.org/

for example, if answer is 1234, then the base64encoded answer is MTIzNA==,
so the url is something like
http://example.org/#MTIzNA==
*/
let expectedAnswer = atob(location.hash.replace('#',''))

if(expectedAnswer.length !== 4){
  expectedAnswer = ''
  app.classList.add('not-ready')
}


let answer = ['?', '?', '?', '?']
let answerIndex = 0
let waiting = false

const writeAnswer = _ => {
  code.innerHTML = answer.map(a => `<span>${a}</span>`).join('')
}

const rightAnswer = _ => {
  app.classList.add('win')
  video.currentTime = 0
  video.play()

  setTimeout(() => {
    //remove other classes and resets everything
    app.className = 'win'
    setWaiting(false)
    mapSelected = false
    expectedAnswer = ''

  }, 2000)
}

const setWaiting = (val) => {
  waiting = val
  if(waiting)
    app.classList.add('waiting')
  else
    app.classList.remove('waiting')
}

const wrongAnswer = _ => {
  error.play()
  keypad.classList.add('error')
  code.classList.add('error')
  setTimeout(() => {
    keypad.classList.remove('error')
    code.classList.remove('error')
    answer = ['?', '?', '?', '?']
    writeAnswer()
    setWaiting(false)
  }, 2000)
}


const setAnswer = _ => {
  setTimeout(() => {
    app.classList.remove('not-ready')
    expectedAnswer = answer.join('')
    answer = ['?', '?', '?', '?']
    writeAnswer()
    setWaiting(false)
  }, 2000)
}


const checkAnswer = _ => {
  if (answerIndex === 3) {
    setWaiting(true)
    if (expectedAnswer === '') {
      setAnswer()
    } else {
      if (expectedAnswer === answer.join('')) {
        rightAnswer()
      } else {
        wrongAnswer()
      }
    }
  }
}

const handleClick = (ev) => {

  if (waiting || ev.target.tagName!=="BUTTON" || app.classList.contains('win'))
    return
  click.play()

  const btn = ev.target.innerHTML

  answer[answerIndex] = btn
  writeAnswer()
  checkAnswer()
  answerIndex++
  answerIndex %= 4
}



const handleToggle = (ev) => {
  click.play()
  if(app.classList.contains('lock')){
    app.classList.remove('lock')
    app.classList.add('map')
  }else if(app.classList.contains('map')){
    app.classList.remove('map')
    app.classList.add('lock')
    if(app.classList.contains('not-ready'))
      answerIndex = 0

  }else if(app.classList.contains('win')){
    app.className = 'not-ready map map0'
    video.pause()
    video.currentTime = 0
  }

}


const handleMapChange = (ev) => {
  click.play()
  answerIndex++
  answerIndex %= 4
  app.className = 'map not-ready'
  app.classList.add('map'+(answerIndex+1))
}


keypad.addEventListener('click', handleClick, false)
toggle.addEventListener('click', handleToggle, false)
map.addEventListener('click', handleMapChange, false)

writeAnswer()
