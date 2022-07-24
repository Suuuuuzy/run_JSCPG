const API_KEY = "AIzaSyDksy0vScGzQL2Ef8qGX3HtFZiO3TWDtAI";
const PLAYLIST_URL_BASE = "https://www.youtube.com/embed?listType=playlist&list=";
const PLAYLIST_ID = "PLoA7SqY2ykOfLwige-URPenfJZZDmdssZ";

chooseMV(PLAYLIST_ID);

function chooseMV(playlistId) {
  let requestUrl =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=id&maxResults=0&playlistId=" +
    playlistId +
    "&key=" +
    API_KEY;

  $.ajax({
    url: requestUrl,
    type: "GET",
    success: function(result) {
      playlistLength = result.pageInfo.totalResults;

      if (playlistLength > 0) {
        let mvIndex = Math.floor(Math.random() * playlistLength);

        let mvUrl = PLAYLIST_URL_BASE + playlistId + "&index=" + mvIndex;

        document.getElementById("randomMV").src = mvUrl;
      }
    },
    error: function(error) {
      return; // if error, just use default playlist set in html at index 0
    }
  });
}
