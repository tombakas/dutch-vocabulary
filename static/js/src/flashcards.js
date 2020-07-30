var flashcardRoot = document.getElementsByClassName("flashcard")[0]
var currentFlashcard
var answers
var mistakes

function initDocument() {
  currentFlashcard = 0
  answers = []
  mistakes = false
  document.removeEventListener('keyup', handleShortcut)
}

var flashcard = {
  view: function(vnode) {
    return [
      m("div", {class: "english"}, vnode.attrs.english),
      m("input", {
        autofocus: "autofocus", 
        onkeypress: handleKeypress,
        id: "word-input"
      }),
      m("button", {onclick: () => handleSubmission()}, "Submit"),
      m("span", {class: "counter"}, `${currentFlashcard + 1}/${flashcards.length}`)
    ]
  }
}

var score = {
  view: function(vnode) {
    var getAnswerClass = function(answerScore) {
      var classes = ["answer-entry"]
      if (answerScore == 0.5) {
        classes.push("almost")
      } else if (answerScore == 0){
        classes.push("wrong")
      }
      return classes.join(" ")
    }
    var answerList = [
      m("div", {class: "answer-headers"}, [
        m("span", "Definition"),
        m("span", "Submitted"),
        m("span", "Actual"),
        m("span", {class: "points"}, "Points")
      ])
    ]

    var i = 0
    for (let answer of answers) {
      var answerScore = levenshteinToScore(answer.levenshtein)
      answerList.push(
        m("div", {class: getAnswerClass(answerScore)}, [
          m("span", {class: "english"}, flashcards[i].english),
          m("span", {class: "submitted"}, answer.submitted),
          m("span", {class: "actual"}, answer.actual),
          m("span", {class: "points"}, answerScore),
        ])
      )
      i++
    }

    return m("div", {class: "score"}, [
      m("h1", `Score:\xa0${computeScore()}%`),
      m("div", {class: "answer-list"}, answerList),
      m("div", {class: "score-buttons"}, [
        m("a", {
          class: "retry-button", 
          href: "#",
          id: "retry",
        }, [
          "Retry",
          m("span", {class: "shortcut"}, " (r)")
        ]),
        m("a", {
          class: "retry-button", 
          hidden: !mistakes,
          href: "#",
          id: "retryIncorrect",
        }, [
          "Retry Incorrect",
          m("span", {class: "shortcut"}, " (i)")
        ])
      ])
    ])
  }
}

function handleKeypress(key) {
  if (key.keyCode == 13) {
    handleSubmission()
  }
}

function levenshteinToScore(levenshteinValue) {
  if (levenshteinValue > 0) {
    mistakes = true
    if (levenshteinValue == 1) {
      return 0.5
    }

    return 0
  }

  return 1
}

function handleSubmission() {
  var inputBox = document.getElementById("word-input")
  var levenshteins = []
  for (let answer of flashcards[currentFlashcard]["answers"]) {
    levenshteins.push(
      levenshtein(
        inputBox.value
          .toLowerCase()
          .replace(/’/g, "'")
          .trim(),
        answer
          .toLowerCase()
          .replace(/’/g, "'")
          .trim()
      )
    )
  }

  var answerWorth = Math.min(...levenshteins)

  answers.push({
    submitted: inputBox.value,
    actual: flashcards[currentFlashcard]["dutch"],
    levenshtein: answerWorth
  })

  var answerClass
  switch(true) {
    case (answerWorth == 0):
      answerClass = "correct-box"
      break;
    case (answerWorth == 1):
      answerClass = "almost-box"
      break;
    case (answerWorth > 1):
      answerClass = "wrong-box"
      break;
  }
  flashcardRoot.classList.add(answerClass) 

  setTimeout(() => { 
    if (currentFlashcard + 1 < flashcards.length) {
      currentFlashcard++
      renderCard(currentFlashcard) 
    } else {
      renderScore()
    }
  }, 100);
}

function renderCard() {
  m.mount(flashcardRoot, {
    view() {
      return m(flashcard, flashcards[currentFlashcard])
    }
  })

  flashcardRoot.classList = ["flashcard"]
  document.getElementById("word-input").focus()
}

function renderScore() {
  flashcardRoot.classList = []
  m.mount(flashcardRoot, score)

  document.getElementById("retry").onclick = () => window.location.reload(true)
  document.getElementById("retryIncorrect").onclick = retryIncorrect
  document.addEventListener('keyup', handleShortcut)
}

function retryIncorrect() {
  var incorrectAnwers = []
  var newFlashcards = []

  for (let answer of answers) {
    if (answer.levenshtein > 0) {
      incorrectAnwers.push(answer)
    }
  }

  for (let flashcard of flashcards) {
    if(incorrectAnwers.find( (answer) => {
      return answer.actual == flashcard.dutch
    })) {
      newFlashcards.push(flashcard)
    }
  }

  flashcards = newFlashcards

  initDocument()
  renderCard()
}

function computeScore() {
  var total = 0;
  for (let answer of answers) {
    total += levenshteinToScore(answer.levenshtein)
  }

  return Math.round(total / flashcards.length * 100)
}

function handleShortcut(key) {
  if (key.key == "r") {
    window.location.reload(true)
  }

  if (key.key == "i") {
    retryIncorrect()
  }
}

initDocument()
renderCard()
