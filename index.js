"use strict";

const tmdbApi = "85a0dacfff0d08f1c3713be131c6cb65";

function watchForm(){
    $('form').submit(e => {
        e.preventDefault();
        console.log("submit working");
        let userInput = $('.form-input').val();
        console.log(userInput);
        getTitles(userInput);
    })
}
function tmdbFullUrl(params) {
    const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    return queryItems.join('&')
}

function getTitles(userInput){
    const url = "https://api.themoviedb.org/3/search/movie";
    const params = {
        "api_key": tmdbApi,
        "query": userInput,
        "lang": "en-US",
        "page": "1"
    }
    const formatParams = tmdbFullUrl(params);
    const fullUrl = url + '?' + formatParams;

    fetch(fullUrl)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson))
}

function displaySearch(responseJson){
    console.log(responseJson);
    $('.ul-results').empty();
    for(let i=0; i < responseJson.results.length; i++){
        $('.ul-results').append(
            `<li class="result-li item${i}" id="${responseJson.results[i].id}">
            <img src="https://image.tmdb.org/t/p/original${responseJson.results[i].poster_path}">
            <section class="title-details hidden">
            <h2 class="list-title">${responseJson.results[i].original_title}</h2>
            <p class="list-description">${responseJson.results[i].overview}</p>
            <button type="submit">Find Similar?</button>
            </section></li>`
        )
        if(responseJson.results[i].poster_path === null) {
            $(`.item${i}`).addClass('no-poster');
            $(`.item${i}`).empty();
            $(`.item${i}`).append(
                `<h2 class="no-poster-title">${responseJson.results[i].original_title}</h2>`
            );
        }
    }
        watchResults();
}
function watchResults(){
    $('.result-li').on('click', function(e) {
        if($('.result-li').hasClass('selected') === true){
            $('.result-li').removeClass('selected');
            $('.title-details').addClass('hidden');
            $(this).addClass('selected');
            $('.title-details', this).removeClass('hidden')
            
        }else{
            $(this).addClass('selected');

            $('.title-details', this).removeClass('hidden')
        }
        const titleId = $(this).attr('id');
        getSimilar(titleId);
    })


    
}
$(watchForm);