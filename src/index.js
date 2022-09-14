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
let page;
const perPage = 40;
async function onFormSearchClick(e) {
  e.preventDefault();
  refs.pageGallery.innerHTML = '';
  page = 1;
  name = e.target.elements.searchQuery.value.trim();
  const imagesItem = await getImages(name, page);
  if (imagesItem && imagesItem.data.hits.length > 0) {
    const newImages = imagesItem?.data?.hits;

    refs.buttonLoadMore.hidden = false;
    renderMarkup(newImages);
    e.target.reset();
  } else {
    refs.buttonLoadMore.hidden = true;
    e.target.reset();
    return;
  }
}

function renderMarkup(arr) {
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

async function getImages(name, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const key = 'key=29896851-043ea774f51ffcbeeabff044d';

  const params = 'image_type=photo&orientation=horizontal';
  try {
    if (!name) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      return await axios.get(
        `${BASE_URL}?${key}&q=${name}&page=${page}&per_page=${perPage}&${params}`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMoreClick(e) {
  page += 1;
  refs.buttonLoadMore.hidden = true;
  try {
    const imagesItem = await getImages(name, page);
    const newImages = imagesItem.data.hits;
    const totalHits = imagesItem.data.totalHits;

    renderMarkup(newImages);
    refs.buttonLoadMore.hidden = false;
    if (page * perPage > totalHits) {
      throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    refs.buttonLoadMore.hidden = true;
  }
}
