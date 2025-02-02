const inputSearch = document.querySelector(".input-search");
const gallery = document.querySelector(".gallery");
const footer = document.querySelector("footer");

const apiKey = "uc2F2nPMvImGKfOaoS8F0vZLbzWqFP4Wa8PVnvP6z69q7xWSEanbLCRY";
let page = 1;
let btnMore;
const loadImages = () => {
  const query = inputSearch.value.trim();
  if (!query) {
    alert("Enter a query");
    return;
  }

  fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=9&page=${page}`,
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

inputSearch.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    loadImages();
  }
});
if (window.matchMedia("(max-width:768px)").matches) {
  inputSearch.addEventListener("blur", function () {
    loadImages();
  });
}
