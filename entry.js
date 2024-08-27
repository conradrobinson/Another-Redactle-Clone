
daysDifference = 0
getDaysDifference()
parseQueryString()
parser.reqArticle(pageIDs[daysDifference])
function getDaysDifference() {
    let startTime = new Date('2023-05-21T18:00:00')
    let currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/London"}))
    let difference = currentTime - startTime
    daysDifference = Math.floor(difference / (1000*60*60*24))
}


function parseQueryString() {
    let query = window.location.search.substring(1);

    let searchParams = new URLSearchParams(query);
    if (searchParams.has("num")) {
        let queryDays = parseInt(searchParams.get("num"))
        if (isNaN(queryDays)) {
            replaceHistory()
            return
        }
        //if it is 0, it is invalid
        if (queryDays == 0) {
            replaceHistory()
            return
        }
        //if it is a negative number then subtract it from the current number
        if (queryDays < 0) {
            if (daysDifference + queryDays < 0) {
                //don't allow a negative index
                replaceHistory()
                return
            }
            daysDifference += queryDays 
            return
        }
        queryDays -= 1
        if (queryDays > daysDifference) {
            replaceHistory()
            return
        }
        daysDifference = queryDays
    } else {
        replaceHistory()
    }
}
function replaceHistory() {
    window.history.replaceState(null, "", "/?num=" + (daysDifference+1).toString())
}