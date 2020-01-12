"use strict";

const tmdbApi = "85a0dacfff0d08f1c3713be131c6cb65";
const utellyKey = 'b13b17d0cemsh83f578cce0d1efcp1a073cjsn3e03ae9e5d9f';

function watchForm(){
    $('form').submit(e => {
        e.preventDefault();
        let userInput = $('.form-input').val();
        console.log(userInput);
        getTitles(userInput);
    })
}
function makeFullUrl(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${params[encodeURIComponent(key)]}`)
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
    const formatParams = makeFullUrl(params);
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
            <button type="submit" class="similar-submit">Find Similar?</button>
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
            $('.title-details', this).removeClass('hidden');
            getPlatforms();
            
        }else{
            $(this).addClass('selected');
            $('.title-details', this).removeClass('hidden');
            getPlatforms();
        }
        const titleId = $(this).attr('id');
        $('.similar-submit').on('click', function(e){
          e.preventDefault();
          getSimilar(titleId);  
        })
    })
}

function getSimilar(titleId){
    const url = "https://api.themoviedb.org/3/movie/";
    const movieId = `${titleId}/similar`;
    const params = {
        "api_key": tmdbApi,
        "lang": "en-US",
        "page": "1"
    }

    const fullUrl = url + movieId + '?' + makeFullUrl(params); 

    fetch(fullUrl)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson));
}

function getPlatforms(){
    const currentTitle = $('.selected > section > .list-title').text();
    console.log(currentTitle);
    const baseUrl = 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup';
    const options = {
        headers: new Headers({
            'X-RapidAPI-Key': utellyKey})
    };
    const params = {
        'term': currentTitle,
        'country': 'us'
    }
    const utellyUrl = baseUrl + '?' + makeFullUrl(params);

    fetch(utellyUrl, options)
    .then(response => response.json())
    .then(responseJson => showPlatforms(responseJson, currentTitle));
}

function showPlatforms(responseJson, currentTitle){
    console.log(responseJson);
    for(let i = 0; i < responseJson.results.length; i++){
        if(responseJson.results[i].name === currentTitle){
            console.log(responseJson.results[i]);
            const titleResults = responseJson.results[i];
            for(let d = 0; d < responseJson.results[i].locations.length; d++){
            $('.title-details').append(`
            <img src="${titleResults.locations[d].icon}" alt="${titleResults.locations[d].display_name}" class="platform-logo">`)
        }
    }
    }
}

$(watchForm);
