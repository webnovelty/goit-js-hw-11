import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form');
const input = form.querySelector('input');
const loadButton = document.querySelector('.load-more');


let page = 1;
let inputCheck = input.value;
let hits = 0;

function checkQuery() {
	if (inputCheck === input.value) {
		page += 1;
		hits += 40;
	}
	else {
		page = 1;
		hits = 0;
		inputCheck = input.value;
		clearGallery();

	}

}

async function fetchData(name) {

	const API_KEY = '29423461-4e3d90720090e0459606a8674';
	const url = `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

	const response = await axios.get(url);
	const data = await response.data;

	return data;

}

function renderGallery(data) {
	const galleryEl = document.querySelector('.gallery');
	galleryEl.insertAdjacentHTML('beforeend', createGalleryItems(data));
	function createGalleryItems(data) {
		return data.map((item) => {
			return `
			<div class="photo-card">
				<a class="gallery__item" href = "${item.largeImageURL}" >
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${item.downloads}</b>
    </p>
  </div>
</div>
`
				;
		}).join('');

	}


	let gallery = new SimpleLightbox('.gallery a');
	gallery.on('show.simplelightbox', function () {
		gallery.options.captionsData = 'alt';
		gallery.options.captionDelay = 250;
	});
	gallery.refresh();

}

function checkNothingQuery(giveData) {
	if (giveData.total === 0) {
		Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
		loadButton.style.display = 'none';
		return;

	}
	Notiflix.Notify.success(`Hooray! We found ${giveData.totalHits} images.`);


}

function clearGallery() {
	const galleryEl = document.querySelector('.gallery');
	galleryEl.innerHTML = "";
}

function smoothScroll() {
	const { height: cardHeight } = document
		.querySelector(".gallery")
		.firstElementChild.getBoundingClientRect();

	window.scrollBy({
		top: cardHeight * 2,
		behavior: "smooth",
	});
}

form.addEventListener('submit', onSubmitForm);
loadButton.addEventListener('click', loadMore);

async function loadMore(e) {
	try {
		page += 1;
		e.preventDefault();
		checkQuery();

		if (hits > 500) {
			Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
			return;
		}
		const giveData = await fetchData(input.value);
		renderGallery(giveData.hits);
		smoothScroll();
	}
	catch (error) {
		Notiflix.Notify.failure("Сорян, больше нет инфы для тебя :(");
	}


}

async function onSubmitForm(e) {
	loadButton.style.display = 'none';
	e.preventDefault();
	checkQuery();

	if (hits > 500) {
		Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
		return;
	}

	const giveData = await fetchData(input.value);
	loadButton.style.display = 'block';
	checkNothingQuery(giveData);
	renderGallery(giveData.hits);

}
