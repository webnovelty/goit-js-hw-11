import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchData } from './js/fetchData';
import { renderGallery } from './js/render';

const form = document.querySelector('.search-form');
const input = form.querySelector('input');
const loadButton = document.querySelector('.load-more');
let gallery = new SimpleLightbox('.gallery a');

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

function checkHitsLength(array) {
	if (array.hits.length < 40) {
		loadButton.style.display = 'none';
	}
}


form.addEventListener('submit', onSubmitForm);
loadButton.addEventListener('click', loadMore);

async function loadMore(e) {
	try {
		e.preventDefault();
		checkQuery();

		if (hits > 500) {
			Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
			loadButton.style.display = 'none';
			return;
		}
		const giveData = await fetchData(input.value, page);
		renderGallery(giveData.hits);
		gallery.refresh();
		smoothScroll();
		checkHitsLength(giveData);

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

	const giveData = await fetchData(input.value, page);
	loadButton.style.display = 'block';
	checkNothingQuery(giveData);
	renderGallery(giveData.hits);
	gallery.refresh();
	checkHitsLength(giveData);

}

