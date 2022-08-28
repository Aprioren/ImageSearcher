import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { picturueQuery } from "./fetchAPI/fetchQuery";
import Notiflix from "notiflix";
import {renderGallery} from './js/renderMarkup';

const refs ={
    form: document.querySelector('#search-form'),
    button: document.querySelector('.search-form__button'),
    guard: document.querySelector('.js-guard'),
    container: document.querySelector('.gallery'),
};
let page = 1;
let userQuery = '';
const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1,
}
const sipleLightboxOptions = {
    captionsData:'alt',
    captionDelay : 250,
    enableKeyboard: true,
}
const observer = new IntersectionObserver(updateQuery,options);


refs.form.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(event){
    event.preventDefault();
    userQuery = event.currentTarget.searchQuery.value.trim();
    refs.container.innerHTML = '';
    page = 1;

    if(userQuery === ''){
        onFailureAlert();
        return;
    };

    picturueQuery(userQuery, page)
    .then(({data}) =>{

        if(data.totalHits === 0){
            onFailureAlert();
            return;
        };
        renderGallery(data.hits);
        onSucsessAlert(data);
        simpleLightbox = new SimpleLightbox('.gallery a', sipleLightboxOptions).refresh();
        observer.observe(refs.guard);
    })
    .catch(error=> console.log(error))
    .finally(event.target.reset());
};

function onFailureAlert(){
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
};

function onSucsessAlert(data){
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
};

function onEndOfGalerey(){
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
};

function updateQuery(entries){
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            picturueQuery(userQuery,page+=1).then(({data})=>{
                const endOfSearch = Math.ceil(data.totalHits / data.per_page);
                renderGallery(data.hits);
                
                if(page > endOfSearch){
                    onEndOfGalerey();
                }

                const { height: cardHeight } = document.querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

                window.scrollBy({top: cardHeight * 2,behavior: "smooth",});
            });
        };
    });
};