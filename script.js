const inputSearch = document.querySelector(".input-search");
const gallery = document.querySelector(".gallery");
const footer = document.querySelector("footer");

const apiKey = "uc2F2nPMvImGKfOaoS8F0vZLbzWqFP4Wa8PVnvP6z69q7xWSEanbLCRY";
let page = 1;
let btnMore;
let currentQuery = "";
let imgforf = null;

const handleForfImage = () => {
  const isSmallScreen = window.matchMedia("(max-width: 855px)").matches;
  if (isSmallScreen) {
    if (!imgforf) {
      imgforf = document.createElement("img");
      imgforf.src = "./pictures/pexels-forf.jpg";
      imgforf.classList.add("forf-image");
      gallery.prepend(imgforf);
    }
  } else {
    if (imgforf) {
      imgforf.remove();
      imgforf = null;
    }
  }
};

const loadImages = () => {
  const query = inputSearch.value.trim();
  if (!query) {
    alert("Enter a query");
    return;
  }
  if (query !== currentQuery) {
    page = 1;
    currentQuery = query;
    gallery.textContent = "";
    if (btnMore) {
      btnMore.remove();
      btnMore = null;
    }
  }

  let Perpage = window.matchMedia("(max-width:855px)").matches ? 10 : 9;

  fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=${Perpage}&page=${page}`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (page === 1) {
        gallery.textContent = "";
      }
      data.photos.forEach((photo) => {
        const photoContainer = document.createElement("div");
        photoContainer.classList.add("photo-container");
        const photographer = document.createElement("h4");
        const img = document.createElement("img");
        photographer.textContent = `Photographer: ${photo.photographer}`;
        img.src = photo.src.medium;
        photoContainer.appendChild(photographer);
        photoContainer.appendChild(img);
        const downloadLink = document.createElement("a");
        downloadLink.href = photo.src.original;
        downloadLink.download = `photo_${photo.id}.jpg`;
        downloadLink.textContent = "Download";
        photoContainer.appendChild(downloadLink);
        gallery.appendChild(photoContainer);
      });
      if (!btnMore) {
        btnMore = document.createElement("button");
        btnMore.classList.add("btn-more");
        btnMore.textContent = "More";
        footer.appendChild(btnMore);
        btnMore.addEventListener("click", () => {
          page++;
          loadImages();
        });
      }
    })
    .catch((error) => console.error("Ошибка:", error));
};

const mediaQuery = window.matchMedia("(max-width:855px)");

const handleBlur = () => {
  inputSearch.addEventListener("blur", loadImages);
};

const removeBlur = () => {
  inputSearch.removeEventListener("blur", loadImages);
};

mediaQuery.addEventListener("change", (event) => {
  if (event.matches) {
    handleBlur();
  } else {
    removeBlur();
  }
});

if (mediaQuery.matches) {
  handleBlur();
}

inputSearch.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    loadImages();
  }
});

let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (inputSearch.value.trim()) {
      loadImages();
    }
  }, 200);
});

window
  .matchMedia("(max-width: 855px)")
  .addEventListener("change", handleForfImage);
handleForfImage();
