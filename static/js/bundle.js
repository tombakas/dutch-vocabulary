var flashcardRoot = document.getElementsByClassName("flashcard")[0]
var currentFlashcard = 0
var answers = []

var flashcard = {
  view: function(vnode) {
    return [
      m("div", {class: "definition"}, vnode.attrs.translation),
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
    let answerList = [
      m("div", {class: "answer-headers"}, [
        m("span", "Submitted"),
        m("span", "Actual"),
        m("span", "Points")
      ])
    ]

    for (let answer of answers) {
      answerList.push(
        m("div", {class: "answer-entry"}, [
          m("span", {class: "submitted"}, answer.submitted),
          m("span", {class: "actual"}, answer.actual),
          m("span", {class: "points"}, levenshteinToScore(answer.levenshtein)),
        ])
      )
    }

    return m("div", {class: "score"}, [
      m("h1", `Score:\xa0${computeScore()}%`),
      m("div", {class: "answer-list"}, answerList)
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
    levenshteins.push(levenshtein(inputBox.value, answer))
  }

  var answerWorth = Math.min(...levenshteins)

  answers.push({
    submitted: inputBox.value,
    actual: flashcards[currentFlashcard]["definition"],
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
}

function computeScore() {
  total = 0;
  for (let answer of answers) {
    total += levenshteinToScore(answer.levenshtein)
  }

  return total / flashcards.length * 100
}

// Compute Levenshtein distance between two strings
// Source: https://gist.github.com/andrei-m/982927#gistcomment-2326555
function levenshtein(a,b) {
  let alen = a.length;
  let blen = b.length;
  if (alen === 0) return blen;
  if (blen=== 0) return alen;
  let tmp, i, j, prev, val, row, ma, mb, mc, md, bprev;

  if (alen> blen) {
    tmp = a;
    a = b;
    b = tmp;
  }

  row = new Int8Array(alen+1);
  // init the row
  for (i = 0; i <= alen; i++) {
    row[i] = i;
  }

  // fill in the rest
  for (i = 1; i <= blen; i++) {
    prev = i;
    bprev = b[i - 1]
    for (j = 1; j <= alen; j++) {
      if (bprev === a[j - 1]) {
        val = row[j-1];
      } else {
        ma = prev+1;
        mb = row[j]+1;
        mc = ma - ((ma - mb) & ((mb - ma) >> 7));
        md = row[j-1]+1;
        val = mc - ((mc - md) & ((md - mc) >> 7));
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[alen] = prev;
  }
  return row[alen];
}

renderCard()
