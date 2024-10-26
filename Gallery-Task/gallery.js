const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightBox = document.querySelector('.lightbox');
const closeBtn = document.querySelector('.fa-xmark');
const downloadImgBtn = document.querySelector('.fa-upload');


//Api key paginations,searchTerm variables
const apiKey = 'INvgWw5FOYnRTBF7g3o1swyYJXB4Q4d5byIXpAGO8etmqXr0SujfMynG';

const perPage = 15;
let currentPage = 1;
let searchTerm = null;


const downloadImg = (imgURL) => {
      //converting recieved img to blob, creating its download link, & downloading it
     fetch(imgURL).then(res => res.blob()).then(file => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
     }).catch(() => alert('Failed To Download image!'));
}


const showLightbox = (name, img) => {
      //showing lightBox and setting img source, name and button attribuite
      lightBox.querySelector("img").src = img;
      lightBox.querySelector("span").innerText = name;
      downloadImgBtn.setAttribute("data-img", img);
      lightBox.classList.add("show");
      document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
      lightBox.classList.remove("show");
      document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
      //making li of all fetched images and adding them to the existing image wrapper
imagesWrapper.innerHTML += images.map(img => 
`<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
<img src="${img.src.large2x}" alt="img">
<div class="details">
      <div class="photographer">
            <i class="fa-solid fa-camera"></i>
            <span>${img.photographer}</span>
      </div>
      <button onclick='downloadImg("${img.src.large2x}");event.stopPropagation();'>
      <i class="fa-solid fa-upload"></i></button>
</div>
</li>`
).join("");
}




const getImages = (apiURL) => {
      //fetching images by API call with authorization header
      loadMoreBtn.innerText = "loading...";
      loadMoreBtn.classList.add("disabled");
      fetch(apiURL,{
            headers: { Authorization: apiKey }
      }).then(res => res.json()).then(data => {
            generateHTML(data.photos);
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
      }).catch(() => alert("Failed to load images!"));
}


const loadMoreImages = () =>{
      currentPage++;//increment currentPage by 1
      //if searchTerm has some value the call Api with search term else call default Api
      let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
      apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`: apiURL;
      getImages(apiURL);
}

const loadSearchImages = (e) => {
//if the search input is empty, set the search term to null and return from here
      if(e.target.value === "") return searchTerm = null;
      // if pressed key is enter, update the current page , search term & call the getImages
      if(e.key === "Enter"){
currentPage = 1;
searchTerm = e.target.value;
imagesWrapper.innerHTML = "";
getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
      }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));