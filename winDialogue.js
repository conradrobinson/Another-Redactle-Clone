function share(attempts, redactleNum, accuracy, modalShareButton) {
    let text = `I solved today's Conradactle (#${redactleNum}) in ${attempts} guesses with an accuracy of ${accuracy*100}%!`
    let link = 'https://conradrobinson.github.io/Another-Redactle-Clone/'
    if (navigator.share) {
        navigator.share({
            title: 'Conradradactle',
            text: text,
            url: link,
          })
          modalShareButton.textContent = "Shared"
      } else {
        navigator.clipboard.writeText(text + " Play here at: " + link)
        modalShareButton.textContent = "Copied"
      }
}
function createDialogue() {
    let dialogue = document.getElementById("modal")
    dialogue.showModal()
    let modalText = document.getElementById("modal-text")
    let redactleNum = daysDifference + 1
    let attempts = guesses.length
    let accuracy = getAccuracy()
    modalText.textContent = `You have solved today's Conradactle (#${redactleNum}) in ${attempts} guesses with an accuracy of ${(accuracy*100).toFixed(1)}%`
    let modalCloseButton = document.getElementById("modal-close")
    modalCloseButton.addEventListener("click", (e) => {dialogue.close()})
    let modalShareButton = document.getElementById("modal-share")
    modalShareButton.addEventListener("click", (e) => {share(attempts, redactleNum, accuracy, modalShareButton)})
}

function getAccuracy() {
    let correct = 0;
    for (let i = 0; i < guesses.length; i++) {
        if (guesses[i].occurences > 0) {
            correct++
        }
    }
    return correct / guesses.length
}