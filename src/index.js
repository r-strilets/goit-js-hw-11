import axios from 'axios';
import Notiflix from 'notiflix';
const refs = {
  searchForm: document.querySelector('.search-form'),
  formInput: document.querySelector('.form-input'),
  formSubmit: document.querySelector('.form-btn'),
  pageGallery: document.querySelector('.gallery'),
  buttonLoadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onFormSearchClick);
refs.buttonLoadMore.addEventListener('click', onLoadMoreClick);
let name;
let myHits = 0;
async function onFormSearchClick(e) {
  e.preventDefault();
  refs.pageGallery.innerHTML = '';
  page = 1;
  name = e.target.elements.searchQuery.value;
  const imagesItem = await getImages(name, page);
  if (imagesItem) {
    const newImages = imagesItem?.data?.hits;

    refs.buttonLoadMore.hidden = false;
    renderGalerry(newImages);
    e.target.reset();
  } else {
    refs.buttonLoadMore.hidden = true;
    //   console.log(newImages);
  }
}

function renderGalerry(arr) {
  const galleryList = arr
    .map(
      item => `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.type}" loading="lazy" width="200" height="200"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${item.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join();
  return refs.pageGallery.insertAdjacentHTML('beforeend', galleryList);
}

async function getImages(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const key = 'key=29896851-043ea774f51ffcbeeabff044d';
  const params = 'per_page=40&image_type=photo&orientation=horizontal';
  try {
    if (!name) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      return await axios.get(
        `${BASE_URL}?${key}&q=${name}&page=${page}&${params}`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMoreClick(e) {
  page += 1;
  let hitsResult;
  const imagesItem = await getImages(name, page);
  const newImages = imagesItem.data.hits;
  myHits += imagesItem.data.hits.length;
  const totalHits = imagesItem.data.totalHits;
  console.log(imagesItem);
  console.log(myHits);
  console.log(totalHits);
  hitsResult = totalHits - myHits;
  if (totalHits - hitsResult < 40) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  renderGalerry(newImages);
  //   console.clear();
}
