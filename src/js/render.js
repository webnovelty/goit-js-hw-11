
export function renderGallery(data) {
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
}