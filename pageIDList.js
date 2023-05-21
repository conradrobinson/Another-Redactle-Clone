
daysDifference = 0
getDaysDifference()
parser.reqArticle(pageIDs[daysDifference])
function getDaysDifference() {
    let startTime = new Date('2023-05-21T18:00:00')
    let currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/London"}))
    let difference = currentTime - startTime
    daysDifference = Math.floor(difference / (1000*60*60*24))
}
