import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { picturueQuery } from "./js/pictureQuery";
import simpleLightbox from "simplelightbox";
import renderMarkup from './templates/renderMarkup.hbs';
import {onFailureAlert, onSucsessAlert, onEndOfGalerey, onSameUserQuery, onEmptyQuery} from './js/alerts.js';

const refs ={
    form: document.querySelector('#search-form'),
    button: document.querySelector('.search-form__button'),
    guard: document.querySelector('.js-guard'),
    container: document.querySelector('.gallery'),
};
let page = 1;
let perPage  = 40;
let userQuery = null;
const options = {
    root: null,
    rootMargin: '500px',
    threshold: 1,
};
const sipleLightboxOptions = {
    captionsData:'alt',
    captionDelay : 250,
    enableKeyboard: true,
};
let lightbox = new simpleLightbox('.gallery a', sipleLightboxOptions);
let observer = new IntersectionObserver(updateQuery,options);


refs.form.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(event){
    event.preventDefault();
    if(userQuery === event.currentTarget.searchQuery.value){
        onSameUserQuery();
        return;
    };

    userQuery = event.currentTarget.searchQuery.value.trim();

    if(userQuery === ''){
        onEmptyQuery();
        return;
    };

    observer.unobserve(event.target);
    refs.container.innerHTML = '';
    page = 1;
  
    picturueQuery(userQuery, page, perPage)
    .then(({data}) =>{

        if(data.totalHits === 0){
            onFailureAlert();
            return;
        };

        renderCard(data.hits);
        lightbox.refresh();
        onSucsessAlert(data);
        observer.observe(refs.guard);
    })
    .finally(event.target.reset());
};


function updateQuery(entries){
    entries.forEach(entry=>{    
        if(entry.isIntersecting){
            const { height: cardHeight } = document.querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

                window.scrollBy({
                top: cardHeight * 3,
                behavior: "smooth",
            });
            picturueQuery(userQuery,page+=1,perPage).then(({data})=>{
                
                const endOfSearch = Math.ceil(data.totalHits / perPage);
                if(page > endOfSearch){
                    onEndOfGalerey();
                    observer.unobserve(entry.target);
                    return;
                };

                renderCard(data.hits);
                
                
                lightbox.refresh();
            });
        };
    });
};
function renderCard(array) {
    const markup = array.map(item => renderMarkup(item)).join('');
    refs.container.insertAdjacentHTML('beforeend', markup);
};