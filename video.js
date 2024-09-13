import YOUR_API_KEY from "./API_CONSTANTS.js";

const videoPlayerContainer = document.getElementById("video-player");

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const comments_http = "https://www.googleapis.com/youtube/v3/commentThreads?";

if (videoId) {
  fetch(
    video_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        id: videoId,
        part: "snippet",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        videoPlayerContainer.innerHTML = `
            <iframe width = "1024" height ="515" src = "https://www.youtube.com/embed/${videoId}" frameborder= "0" allow ="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
      } else {
        videoPlayerContainer.innerHTML = "<p>Video Unavailable</p>";
      }
    })
    .catch((err) => console.log(err));
} else {
  videoPlayerContainer.innerHTML = "<p>No Video ID Provided</p>";
}

const fetchAndDisplayComments = () => {
  fetch(
    comments_http +
      new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet",
        videoId: videoId,
        maxResults: 25,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        data.items.forEach((item) => {
          const comment = item.snippet.topLevelComment.snippet;
          displayComment(comment);
        });
      } else {
        console.log("No comments found for this video.");
      }
    })
    .catch((err) => console.log(err));
};

function displayComment(comment) { 
  const commentList = document.getElementById("video-comments-list");
  const commentItem = document.createElement("li");
  commentItem.classList.add("comment-item");
  commentItem.innerHTML = ` 
  <div class="comment-author">
      <img src="${comment.authProfileImageUrl}"
      alt = "Profile Img"/>
      ${comment.authDisplayName}
       
        </div>
        <div class="comment-body">
        <div class="comment-text"> ${comment.textDisplay}></div>
             <div class="comment-actions">
              <img src="img/like.png" alt="like icon"/>

              <span class="action-count">${comment.likeCount}</span>
              <img src="img/don't-like.png" alt="dislike icon"/>
              <span class="action-count">Replay</span>
      </div>
</div>
`;
commentList.appendChild(commentItem);
}
fetchAndDisplayComments();