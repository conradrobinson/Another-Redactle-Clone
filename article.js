text = ""
function displayArticle() {
        calculateRedacted()
}

function getAllElements(classname) {
    return Array.from(document.getElementsByClassName(classname))
}
function capitaliseFirstLetter(word) {
    if (!word.includes("-")) {
        return word;
    }
    let out = ""
    for (i = 0; i < word.length; i++) {
        let char = word.charAt(i)
        if (char == "-") {
            out += word.charAt(i+1).toUpperCase()
            i++
        } else {
            out += char
        }
    }
    return out;
}

function recalculateRedacted(guess) {

    let elements = getAllElements(guess)
    if (elements.length == 0) {
        return
    }
    //if hidden then reveal
    if (elements[0].classList.contains("hidden-element")) {

        //clear all highlighting from last word
        let previouslyHighlighted = getAllElements(lastWordHighlighted)
        for (let i = 0; i < previouslyHighlighted.length; i++) {
            previouslyHighlighted[i].classList.remove("article-word-highlighted")
            if (previouslyHighlighted[i].classList.contains("article-word-double-highlighted")) {
                previouslyHighlighted[i].classList.remove("article-word-double-highlighted")
            }
        }

        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("hidden-element") //remove the hidden tag
            elements[i].textContent = capitaliseFirstLetter(elements[i].className.split(" ")[0])
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
                let previouslyHighlighted = getAllElements(lastWordHighlighted)
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

    checkWin()
}

function checkWin() {
    //check for win condition
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
        let textHolders = document.getElementById("article").children;
        for (let i = 0; i < textHolders.length; i++) {
            textHolders[i].replaceChildren()
            textHolders[i].textContent = text[i].content;
        }
        //put the article link at the top here
        let articleElement = document.getElementById("article")
        let linkText = document.createElement("p")
        linkText.textContent = `This is a link to `
        let link = document.createElement("a")
        link.textContent = `the original wikipedia article.`
        link.href = `http://en.wikipedia.org/?curid=${parser.pageID}`
        linkText.appendChild(link)
        articleElement.prepend(linkText)
        scroll(linkText)
        //create the dialogue box
        createDialogue()
    }
} 
function setCapitalization(word) {
    let out = ""
    for (let i = 0; i < word.length; i++) {
        let char = word.charAt(i)
        if (char == char.toUpperCase()) {
            out += "-" + char
        } else {
            out += char;
        }
    }
    return out;
}

function calculateRedacted() {
    for (let i = 0; i < text.length; i++) {
        let content = text[i].content
        let tag = text[i].tag
        let startIndex = 0
        let endIndex = 0
        let startDefined = false;
        let endDefined = false
        //let includedCharsPattern = /^[a-z0-9$é]+$/i
        let includedCharsPattern = /\p{Alphabetic}|\p{N}/gu
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
                if (includedCharsPattern.test(content[j])) { //the character is alphanumeric
                    startIndex = j
                    startDefined = true
                    //adds the punctuation
                    let newSpan = document.createElement("span")
                    newSpan.textContent = content.substring(endIndex, startIndex)
                    textElement.appendChild(newSpan)
                }
                if (j == content.length - 1) {
                    let newSpan = document.createElement("span")
                    newSpan.textContent = content.substring(endIndex, content.length)
                    textElement.appendChild(newSpan)
                }
            }

            if (startDefined) {
                if (j < content.length - 1) { //we have not reached the last character
                if (!content[j + 1].match(includedCharsPattern)) { //if the next character is not alphanumeric
                    endIndex = j + 1
                    endDefined = true
                }
                } else {
                    //this is the last character stupid edge case
                    endDefined = true;
                    endIndex = j + 1;
                }
            }

            if (startDefined && endDefined) {
                endDefined = false;
                startDefined = false
                word = content.substring(startIndex, endIndex)

                let foundInGuesses = -1;
                for (let i = 0; i < guesses.length; i++) {
                    if (guesses[i].guess == word.toLowerCase()) {
                        foundInGuesses = i;
                        break
                    } 
                }
                if (foundInGuesses != -1) { //it has been guessed before - saved to local storage on page load
                    let newSpan = document.createElement("span")
                    newSpan.textContent = word
                    if (word.substring(0, 1) == word.substring(0, 1).toUpperCase()) {
                        newSpan.classList.add(setCapitalization(word).toLowerCase())
                    } else {
                        newSpan.classList.add(word)
                    }
                    if (tag == "h1") {
                        newSpan.classList.add("title-element")
                    }
                    textElement.appendChild(newSpan)
                    continue;
                }
                if (unredactedWords.includes(word.toLowerCase())) { //the word should not be redacted in the first place
                    let newSpan = document.createElement("span")
                    newSpan.textContent = word
                    textElement.appendChild(newSpan)
                    continue;
                }
                //we can only get to here if the word is not in guesses and is not in the default unredacted list
                let newSpan = document.createElement("span")
                let capsed = setCapitalization(word).toLowerCase()
                newSpan.classList.add(capsed)
                if (capsed != word.toLowerCase()) {
                    newSpan.classList.add(word.toLowerCase())
                }

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

