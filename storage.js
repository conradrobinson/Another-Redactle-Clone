class Storage {
    constructor() {
        this.storage = window.localStorage
    }

    setGuesses(guesses) {
        this.storage.setItem("guesses", JSON.stringify(guesses))
    }
    getGuesses() {
        return JSON.parse(this.storage.getItem("guesses"))
    }
    setPageID(pageID) {
        this.storage.setItem("pageID", pageID)
    }
    getPageID() {
        return this.storage.getItem("pageID")
    }

}

storage = new Storage()