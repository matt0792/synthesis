// Get main scroll section
let horizontalScrollElement = document.getElementById("horizontal-scroll");

// Declare array for all content files
// For dynamic loading
let contentArray = [
  "pages/oscillators.html",
  "pages/filters.html",
  "pages/envelopes.html",
  "pages/lfos.html",
  "pages/effects.html",
  "pages/overview.html",
];

// Declare vars for bookmark and like elements
let bookmarkElements;
let likeElements;

// Function to load in content blocks
document.addEventListener("DOMContentLoaded", function () {
  // Function to load and append HTML content
  function loadSection(fileName, targetElement, index) {
    fetch(fileName)
      .then((response) => {
        return response.text();
      })
      // Add html from individual files to page
      .then((htmlContent) => {
        const tempDiv = document.createElement("div");
        tempDiv.classList.add("content-block");
        tempDiv.setAttribute("id", `block${index + 2}`);
        tempDiv.innerHTML = htmlContent;

        // Append content to container
        document.querySelector(targetElement).appendChild(tempDiv);
        // Assign elements to vars
        bookmarkElements = document.querySelectorAll(".bookmark");
        likeElements = document.querySelectorAll(".like");

        // Initialize save status by checking session storage
        bookmarkElements.forEach((bookmarkElement) => {
          let id = bookmarkElement.getAttribute("data-id");
          let savedStatus = sessionStorage.getItem(id);

          if (savedStatus === "true") {
            bookmarkElement.classList.add("saved");
            bookmarkElement.innerHTML =
              'Saved for Later <i class="bi bi-bookmark-check-fill"></i>';
          }
        });

        // Initialize like status by checking session storage
        likeElements.forEach((likeElement) => {
          let id = likeElement.getAttribute("data-id");
          let likedStatus = sessionStorage.getItem(id);

          if (likedStatus === "true") {
            likeElement.classList.add("liked");
            likeElement.innerHTML = 'Liked <i class="bi bi-heart-fill"></i>';
          }
        });
      });
  }

  // Loop through contentArray and dynamically add to index page
  for (i = 0; i < contentArray.length; i++) {
    let currentSection = contentArray[i];
    let index = i;
    loadSection(currentSection, ".horizontal-scroll", index);
  }
});

// little script to translate vertical scroll to horizontal
// same as the one I used in the moog website clone
document.addEventListener("wheel", function (e) {
  const scrollContainer = document.querySelector(".horizontal-scroll");

  // translate vertical scroll to horizontal scroll
  if (e.deltaY !== 0) {
    scrollContainer.scrollLeft += e.deltaY;
  }
});

// Function to gradually change border, text, and nav background color based on scroll percent
document
  .querySelector(".horizontal-scroll")
  .addEventListener("scroll", function () {
    // gets the horizontal scroll position
    const scrollPos = this.scrollLeft;
    // gets the maximum amount of scroll availiable
    const maxScroll = this.scrollWidth - this.clientWidth;

    // calculate the percentage scrolled
    const scrollPercent = scrollPos / maxScroll;

    // transition for the border color. Starts black, then becomes bluey purple
    // red value
    const borderR = Math.round(0 + scrollPercent * 180);
    // keep green as 0
    const borderG = 0;
    // blue value
    const borderB = Math.round(0 + scrollPercent * 255);
    // template literal to set the rgb value
    const borderColor = `rgb(${borderR}, ${borderG}, ${borderB})`;

    // text color transition (pretty much same as border)
    const textR = Math.round(50 + scrollPercent * (200 - 0));
    const textG = Math.round(50 + scrollPercent * (50 - 0));
    const textB = Math.round(50 + scrollPercent * (120 - 0));
    const textColor = `rgb(${textR}, ${textG}, ${textB})`;

    // navbar background transition (from white to blue/pink gradient)
    const navStartColor = [255, 255, 255];
    const navEndColor1 = [0, 128, 255];
    const navEndColor2 = [255, 105, 180];

    // Gradual change for navbar background color
    const navColor1 = navStartColor.map((start, i) =>
      Math.round(start + scrollPercent * (navEndColor1[i] - start))
    );
    const navColor2 = navStartColor.map((start, i) =>
      Math.round(start + scrollPercent * (navEndColor2[i] - start))
    );
    const navGradient = `linear-gradient(to right, rgb(${navColor1.join(
      ","
    )}), rgb(${navColor2.join(",")}))`;

    // border color application
    document
      .querySelectorAll(
        ".content-block, .block-title, .block-desc, .block-image"
      )
      .forEach(function (element) {
        element.style.borderColor = borderColor;
      });

    // text color application
    document
      .querySelectorAll(".block-desc, .img-desc")
      .forEach(function (element) {
        element.style.color = textColor;
      });

    // navbar background application
    document.querySelector(".navbar").style.background = navGradient;
  });

// declare var for total saved items
let savedItems = 0;

// Function to toggle bookmark
// Adds status to session storage
// Adds relevant info from saved block to session storage
function toggleBookmark(element) {
  let id = element.getAttribute("data-id");
  let index = id.charAt(id.length - 1);
  let parentElementId = "block" + index;
  let parentElement = document.getElementById(parentElementId);

  let savedItemsFromStorage = sessionStorage.getItem("savedItems");
  let savedItems = savedItemsFromStorage ? Number(savedItemsFromStorage) : 0;

  let currentTitle = parentElement.querySelector(".block-title-text").innerText;
  let currentParagraph = parentElement.querySelector(".info").innerText;

  let elementObject = {
    id: index,
    title: currentTitle,
    content: currentParagraph,
  };

  // Get bookmarkArray from storage or initialize to empty array
  let bookmarkArray = JSON.parse(sessionStorage.getItem("bookmarks")) || [];

  if (element.classList.contains("saved")) {
    savedItems -= 1;
    element.classList.remove("saved");
    element.innerHTML = 'Save for Later <i class="bi bi-bookmark"></i>';
    // Remove from bookmarks
    let filteredArray = bookmarkArray.filter((item) => item.id !== index);
    sessionStorage.setItem("bookmarks", JSON.stringify(filteredArray));
    sessionStorage.setItem(id, "false");
    sessionStorage.setItem("savedItems", savedItems);
    // Add to bookmarks
  } else {
    savedItems += 1;
    element.classList.add("saved");
    element.innerHTML =
      'Saved for Later <i class="bi bi-bookmark-check-fill"></i>';
    sessionStorage.setItem(id, "true");
    sessionStorage.setItem("savedItems", savedItems);
    alertSlide(savedItems);
    bookmarkArray.push(elementObject);
    sessionStorage.setItem("bookmarks", JSON.stringify(bookmarkArray));
  }
}

// Alert user about saved item
let alertElement = document.getElementById("#alert");

function alertSlide(savedItems) {
  if (savedItems < 2) {
    $("body").prepend(
      `<div id="alert"><div class="alert-text">${savedItems} item saved</div></div>`
    );
  } else {
    $("body").prepend(
      `<div id="alert"><div class="alert-text">${savedItems} items saved</div></div>`
    );
  }
  $("#alert").delay(1000).fadeOut(200);
}

// Function to toggle like
// Adds status to session storage
// Adds relevant info from saved block to session storage
function toggleLike(element) {
  let id = element.getAttribute("data-id");

  if (element.classList.contains("liked")) {
    element.classList.remove("liked");
    element.innerHTML = 'Like <i class="bi bi-heart"></i>';
    sessionStorage.setItem(id, "false");
  } else {
    element.classList.add("liked");
    element.innerHTML = 'Liked <i class="bi bi-heart-fill"></i>';
    sessionStorage.setItem(id, "true");
  }
}

$(document).ready(function () {
  // Call the existing bounce function every second (1000 milliseconds)
  setInterval(bounce, 2000);
});

// Function to bounce quote text
function bounce() {
  $(".bouncing-text")
    .animate({ top: "-5px" }, 500)
    .animate({ top: "0px" }, 500);
}
