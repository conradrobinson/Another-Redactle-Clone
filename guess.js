guesses = []
let form = document.getElementById("input")
form.addEventListener("submit", handleGuessSubmission)

lastWordHighlighted = ""

function handleRowClick(event) {
    let row = event.currentTarget
    let index = parseInt(row.cells[0].textContent)
    recalculateRedacted(guesses[index-1].guess)
    makeTable(index-1)
}

function handleGuessSubmission(event) {
    event.preventDefault()
    guessSubmission()
}

function guessSubmission() {
    let inputField = document.getElementById("input-box")
    if (inputField.value == "") {
        return;
    }
    let guessIndex = -1
    for (let i = 0; i < guesses.length; i++) {
        if (guesses[i].guess == inputField.value.toLowerCase()) {
            guessIndex = i;
            break;
        }
    }
    if (guessIndex != -1) {
        //highlight it in the list
        //dont add it
        makeTable(guessIndex)
        recalculateRedacted(inputField.value.toLowerCase())
        let rows = document.getElementsByTagName("tr")
        for (let i = 1; i < rows.length; i++) {
            if (guessIndex+1 == parseInt(rows[i].cells[0].textContent)) {
                scroll(rows[i])
                break
            }
        }
        inputField.value = ""
        return
    }
    //we are only here if it is not in the list already
    guesses.push({guess: inputField.value.toLowerCase(), occurences: 0})
    recalculateRedacted(inputField.value.toLowerCase())
    storage.setGuesses(guesses)
    storage.setPageID(parser.pageID)
    inputField.value = ""
    makeTable(guesses.length-1)
    let rows = document.getElementsByTagName("tr")
    scroll(rows[1])
    
}
function makeTable(highlightedIndex) {
    let table = document.getElementById("table-body")
    table.replaceChildren()
    for (let i = 0; i < guesses.length; i++) {
        let row = table.insertRow(0) //retains the table head - insert after the first element
        row.classList.add("row")
        row.addEventListener("click", handleRowClick)
        if (i == highlightedIndex) {
            row.classList.add("highlighted")
        }
        createCell(row, i + 1)
        createCell(row, guesses[i].guess)
        createCell(row, guesses[i].occurences)
    }
}
function createCell(row, content) {
    let cell = row.insertCell()
    cell.classList.add("cell")
    let span = document.createElement("span")
    span.textContent = content
    span.classList.add("content-span")
    cell.appendChild(span)
}