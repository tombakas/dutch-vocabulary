var flashcardRoot = document.getElementsByClassName("flashcard")[0]
var currentFlashcard = 0
var answers = []

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
      m("a", {
        class: "retry-button", 
        href: "#",
        id: "retry",
      }, "Retry")
    ])
  }
}

function handleKeypress(key) {
  if (key.keyCode == 13) {
    handleSubmission()
  }
}

function levenshteinToScore(levenshteinValue) {
  if (levenshteinValue == 0) {
    return 1
  } else if (levenshteinValue == 1) {
    return 0.5
  }

  return 0
}

function handleSubmission() {
  var inputBox = document.getElementById("word-input")
  var levenshteins = []
  for (let answer of flashcards[currentFlashcard]["answers"]) {
    levenshteins.push(
      levenshtein(
        inputBox.value.toLowerCase().trim(),
        answer.toLowerCase().trim())
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
}

function computeScore() {
  var total = 0;
  for (let answer of answers) {
    total += levenshteinToScore(answer.levenshtein)
  }

  console.log(answers)
  return total / flashcards.length * 100
}

renderCard()
