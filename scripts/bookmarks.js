// Get bookmark array
let bookmarkArray = JSON.parse(sessionStorage.getItem("bookmarks"));
let savedItems = Number(sessionStorage.getItem("savedItems"));
let placeholderElement = document.getElementById("placeholder");
let bookmarkDisplay = document.getElementById("bookmarkDisplay");
let commentInput = document.getElementById("comments")

let comment = JSON.parse(sessionStorage.getItem("comment")) || "";

$(document).ready(populateBookmarks());

// Function to generate a card and add comments
function populateBookmarks() {
  commentInput.textContent = comment
  if (savedItems > 0) {
    placeholder.classList.add("hidden");
    for (let i = 0; i < savedItems; i++) {
      // Retrieve and parse currentBook from sessionStorage
      let currentBookmark = bookmarkArray[i];
      // Check if bookmark exists
      if (currentBookmark) {
        // Create card div
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.setAttribute("data-id", currentBookmark.id);
        bookmarkDisplay.appendChild(cardDiv);
        // Create card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "d-flex", "flex-column");
        cardDiv.appendChild(cardBody);
        // Create and append title
        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.innerHTML = currentBookmark.title;
        cardBody.appendChild(cardTitle);
        // Create and append content
        let content = document.createElement("p");
        content.classList.add("card-text");
        content.innerHTML = currentBookmark.content;
        cardBody.appendChild(content);
        // Create and append see more link
        let visitLink = document.createElement("a");
        visitLink.classList.add("card-link", "ms-auto", "mt-auto");
        visitLink.setAttribute("href", "index.html");
        visitLink.innerHTML = "More Info";
        cardBody.appendChild(visitLink);
        // Create and append see more icon
        let visitIcon = document.createElement("i");
        visitIcon.classList.add("bi", "bi-arrow-up-right-square", "ps-2");
        visitLink.append(visitIcon);
      } else {
        console.log(`No bookmark found at index ${i}`);
      }
    }
  } else {
    placeholder.classList.remove("hidden");
  }
}

function saveComment() {
  let commentForStorage = commentInput.value
  console.log(commentForStorage)
  sessionStorage.setItem("comment", JSON.stringify(commentForStorage))
  console.log("saved comment")
}