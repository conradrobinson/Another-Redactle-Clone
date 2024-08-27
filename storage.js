class Storage {
    constructor() {
        this.storage = window.localStorage
    }

    setData(guesses) {
        this.storage.setItem("guesses", JSON.stringify(guesses))
    }
    getData() {
        let data = JSON.parse(this.storage.getItem("guesses"))
        if (data != null && Array.isArray(data)) {
            this.setData({})
            return {}
        }
        return data
    }
    // setPageID(pageID) {
    //     this.storage.setItem("pageID", pageID)
    // }
    // getPageID() {
    //     return this.storage.getItem("pageID")
    // }
    hasPageID(id) {
        let data = this.getData()
        if (data == null) {
            return false
        }
        if (id in data) {
            return true
        }
        return false
    }
    getGuesses(pageID) {
        return this.getData()[pageID]
    }
    setGuesses(pageID, guesses) {
        let data = this.getData()
        if (data == null) {
            data = {}
        }
        data[pageID] = guesses
        this.setData(data)
    }

}

storage = new Storage()