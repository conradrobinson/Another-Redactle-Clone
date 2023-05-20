text = ""
function displayArticle() {
        calculateRedacted()
}


function recalculateRedacted(guess) {


    let elements = document.getElementsByClassName(guess)
    if (elements.length == 0) {
        return
    }
    //if hidden then reveal
    if (elements[0].classList.contains("hidden-element")) {

        //clear all highlighting from last word
        let previouslyHighlighted = document.getElementsByClassName(lastWordHighlighted)
        for (let i = 0; i < previouslyHighlighted.length; i++) {
            previouslyHighlighted[i].classList.remove("article-word-highlighted")
            if (previouslyHighlighted[i].classList.contains("article-word-double-highlighted")) {
                previouslyHighlighted[i].classList.remove("article-word-double-highlighted")
            }
        }

        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("hidden-element") //remove the hidden tag
            elements[i].textContent = guess
            elements[i].classList.add("article-word-highlighted")
        }
        guesses[guesses.length-1].occurences = elements.length
        scroll(elements[0])
        elements[0].classList.add("article-word-double-highlighted")
        lastWordHighlighted = guess
    } else { //we pass in this guess because we clicked on the row
        if (guess == lastWordHighlighted) { //we have clicked multiple times
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].classList.contains("article-word-double-highlighted")) {
                    if (i == elements.length-1) {
                        elements[0].classList.add("article-word-double-highlighted")
                        scroll(elements[0])
                    } else {
                        elements[i+1].classList.add("article-word-double-highlighted")
                        scroll(elements[i+1])
                    }
                    elements[i].classList.remove("article-word-double-highlighted")
                    break;
                }
            }
        } else { //we switched to this

                //clear all highlighting from last word
                let previouslyHighlighted = document.getElementsByClassName(lastWordHighlighted)
                for (let i = 0; i < previouslyHighlighted.length; i++) {
                    previouslyHighlighted[i].classList.remove("article-word-highlighted")
                    if (previouslyHighlighted[i].classList.contains("article-word-double-highlighted")) {
                        previouslyHighlighted[i].classList.remove("article-word-double-highlighted")
                    }
                }
                //apply highlighting to new word
                for (let i = 0; i < elements.length; i++) {
                    elements[i].classList.add("article-word-highlighted")
                }
                scroll(elements[0])
                elements[0].classList.add("article-word-double-highlighted")
            lastWordHighlighted = guess
        }
    }
    let titleElements = document.getElementsByClassName("title-element")
    let anyHidden = false;
    for (let i = 0; i < titleElements.length; i++) {
        if (titleElements[i].classList.contains("hidden-element")) {
            anyHidden = true;
            break
        }
    }
    if (!anyHidden) {
        //you have won so reveal all the words
        let hiddenElements = document.getElementsByClassName("hidden-element")
        while (hiddenElements.length > 0) {
            hiddenElements[0].textContent = hiddenElements[0].className.split(" ")[0]
            hiddenElements[0].classList.remove("hidden-element")
        }
    }
}


function calculateRedacted() {
    for (let i = 0; i < text.length; i++) {
        let content = text[i].content
        let tag = text[i].tag
        let startIndex = 0
        let endIndex = 0
        let startDefined = false;
        let endDefined = false
        let includedCharsPattern = /^[a-z0-9$é]+$/i
        let articleElement = document.getElementById("article")
        let textElement = undefined;
        if (tag == "p") {
            textElement = document.createElement("p")
        }
        if (tag == "h2") {
            textElement = document.createElement("h2")
        }
        if (tag == "h1") {
            textElement = document.createElement("h1")
        }
        articleElement.appendChild(textElement)
        //for every child
        for (let j = 0; j < content.length; j++) { 
            if (!startDefined) { //we have not yet found a word so the next letter found is the start index
                if (content[j].match(includedCharsPattern)) { //the character is alphanumeric
                    startIndex = j
                    startDefined = true
                    let newSpan = document.createElement("span")
                    newSpan.textContent = content.substring(endIndex, startIndex)
                    textElement.appendChild(newSpan)
                }
            }
            if (startDefined) {
                
                if (!content[j].match(includedCharsPattern)) {
                    endIndex = j
                    endDefined = true
                } else {
                    if (j == content.length - 1) {
                        endIndex = j+1;
                        endDefined = true
                    }
                }
                
            }
            if (startDefined && endDefined) {
                endDefined = false;
                startDefined = false
                word = content.substring(startIndex, endIndex)

                if (unredactedWords.includes(word.toLowerCase())) { //the word should not be redacted in the first place
                    let newSpan = document.createElement("span")
                    newSpan.textContent = word
                    textElement.appendChild(newSpan)
                    continue;
                }
                //we can only get to here if the word is not in guesses and is not in the default unredacted list
                let newSpan = document.createElement("span")
                newSpan.classList.add(word.toLowerCase())
                newSpan.classList.add("hidden-element")
                if (tag == "h1") {
                    newSpan.classList.add("title-element")
                }
                newSpan.textContent = "█".repeat(word.length)
                textElement.appendChild(newSpan)
            }
        }

    }
}

function scroll(element) {
    element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
}

