
class Parser {
    constructor() {
        this.output = []
        this.text = ""
        this.tree = {tag: "root", content: [], isOpen: true}
        this.content = []
        this.title = ""
        this.pageID = ""
        this.mappedChars = [["&lt;", "<"], ["&gt;", ">"], ["&#160;", " "]]
    }

    traverseTree(tree, tags) { //tree traversal order needs to be in (middle - cannot have text so doesn't matter?) left right
        //I give up I'll use recursive
        if (tree.tag == "text") {
            return;
        }
        if (tree.content.length == 0) {
            return;
        }
            if (tree.tag == "h2") {
                this.content.push({tag: "h2", content: this.findTextChildren(tree.content[0])})
            }
            if (tree.tag == "p") {
                this.content.push({tag: "p", content: this.findTextChildren(tree)})
            }

        for (let i = 0; i < tree.content.length; i++) {
            this.traverseTree(tree.content[i], tags)
        }

    }
    findTextChildren(node) {
        let textChildren = ""
        for (let i = 0; i < node.content.length; i++) {
            if (node.content[i].tag == "text") {
                textChildren += (node.content[i].content[0])
            }
            if (node.content[i].tag == "a") {
                textChildren += this.findTextChildren(node.content[i])
            }
            if (node.content[i].tag == "b") {
                textChildren += this.findTextChildren(node.content[i])
            }
            if (node.content[i].tag == "i") {
                textChildren += this.findTextChildren(node.content[i])
            }
        }
        textChildren = textChildren.replaceAll("\n", "")
        return textChildren
    }

    traverseTreeForOpen(tree) { //traverses the tree for the first open tag from left to right
        let target = tree
        while (true) {
            let foundOne = false //found one open tag
            for (let i = 0; i < target.content.length; i++) {
                //loop over the children to see if any are open
                if (target.content[i].isOpen == true) {
                    //if an open child is found, traverse it
                    target = target.content[i]
                    foundOne = true
                    break
                }
            }
            if (!foundOne) {
                return target
            }
        }
    }

    generateSyntaxTree() {
        let textBeforeTag = ""
        while (!this.endOfText()) {
            let x = this.collapse()
            if (x == "<") {
                if (textBeforeTag != "") {
                    let node = this.traverseTreeForOpen(this.tree)
                    node.content.push({tag: "text", content: [textBeforeTag]})
                    textBeforeTag = ""
                }
                let tagIsOpen = false
                //we have a tag!
                if (this.peek() == "/") {
                    //a closed tag
                    this.collapse()
                    tagIsOpen = false
                } else {
                    //an open tag
                    tagIsOpen = true

                }
                let tagContents = ""
                let tagComplete = false;
                while (this.peek() != ">") { //the contents of the tag
                    if (this.peek() == " ") {
                        tagComplete = true
                    }
                    if (!tagComplete) {
                        tagContents += this.collapse()
                    } else {
                        this.collapse()
                    }
                }
                if (tagIsOpen) {
                    let node = this.traverseTreeForOpen(this.tree)
                    node.content.push({tag: tagContents, content: [], isOpen: true})
                    if ("area, base, br, col, embed, hr, img, input, link, meta, source, track, wbr".split(", ").includes(tagContents)) {
                        node.content[node.content.length-1].isOpen = false;
                    }
                    
                } else {
                    this.traverseTreeForOpen(this.tree).isOpen = false;
                }
                this.collapse() //remove the last ">"
                //we have openend and closed tag
            } else {
                textBeforeTag += x
            }
        }

    }
    endOfText() {
        return this.text.length == 0
    }
    peek(length) {
        if (length == undefined) {
            length = 1
        }
        return this.text.substring(0, length)
    }
    collapse(length) {
        if (length == undefined) {
            length = 1
        }
        let collapsedText = this.text.substring(0,length)
        this.text = this.text.substring(length, this.text.length)
        return collapsedText
    }
    findContent() {
        this.traverseTree(this.tree, ["h2", "p"])
    }

    reqArticle(pageID) {
        this.pageID = pageID
        let x = fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid=${this.pageID}&prop=subtitle%7Ctext%7Cdisplaytitle&formatversion=2&origin=*`, {mode: 'cors'})
        x.then((data) => data.json()).then((data) => {this.handleData(data)})
    }
    handleData(res) {
        this.title = res.parse.title
        this.text = res.parse.text
        for (let i = 0; i < this.mappedChars.length; i++) {
            this.text = this.text.replaceAll(this.mappedChars[i][0], this.mappedChars[i][1])
        }
        this.text = this.text.replace(/<!--[\s\S]*?-->/g, '');
        console.log(this.text)
        this.generateSyntaxTree()
        console.log(JSON.stringify(this.tree, undefined, 1))
        this.findContent()
        this.content = [{tag: "h1", content: this.title}].concat(this.content)
        text = this.content;
        if (this.pageID == storage.getPageID()) { //the current article's guesses is in storage
            guesses = storage.getGuesses() //load the guesses
            makeTable(guesses.length-1)
        }
        displayArticle()
        checkWin()

    }
}

parser = new Parser()




