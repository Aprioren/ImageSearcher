export {onFailureAlert, onSucsessAlert, onEndOfGalerey, onSameUserQuery, onEmptyQuery };
import Notiflix from "notiflix";

function onFailureAlert(){
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
};

function onSucsessAlert(data){
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
};

function onEndOfGalerey(){
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
};

function onSameUserQuery(){
    Notiflix.Notify.info('Sorry, but it already found. Please enter a new query.')
};

function onEmptyQuery(){
    Notiflix.Notify.info('Please, enter your query. Can it be sombrerro?');
};