"use strict";

const tmdbApi = "85a0dacfff0d08f1c3713be131c6cb65";
const rapidApiKey = "b13b17d0cemsh83f578cce0d1efcp1a073cjsn3e03ae9e5d9f";

function getTrending(){
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApi}`
    fetch(url)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson));
}

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
    return queryItems.join('&');
}

function getTitles(userInput){
    const mUrl = "https://api.themoviedb.org/3/search/movie";
    const params = {
        "api_key": tmdbApi,
        "query": userInput,
        "lang": "en-US",
        "page": "1"
    }
    const formatParams = makeFullUrl(params);
    const movieUrl = mUrl + '?' + formatParams;
    
    fetch(movieUrl)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson));
}

function displaySearch(responseJson){
    console.log(responseJson);
    $('.ul-results').empty();
    for(let i=0; i < responseJson.results.length; i++){
        $('.ul-results').append(
            `<li class="result-li item${i}" id="${responseJson.results[i].id}">
            <span class="close hidden">&times;</span>
            <img src="https://image.tmdb.org/t/p/original${responseJson.results[i].poster_path}">
            <div class="title-content"><section class="title-details hidden">
            <h2 class="list-title">${responseJson.results[i].original_title}</h2>
            <p class="list-description">${responseJson.results[i].overview}</p>
            <button type="submit" class="similar-submit">Find Similar?</button>
            </section>
            <section class="color-palette">
            </section></div></li>`
        )
        if(responseJson.results[i].poster_path === null) {
            $(`.item${i}`).hide();
        }

    }
        watchResults();
}
function watchResults(){
    $('.result-li').on('click', function(e) {
        if($('.result-li').hasClass('selected') === true){
            $('.result-li').removeClass('selected');
            $('.title-details').addClass('hidden');
            $('.close').addClass('hidden');
            $('.selected > .title-content > .title-details').removeClass('hidden');
            $('.selected > .close').removeClass('hidden')
            // getColors();
            
        }else{
            $(this).addClass('selected modal-content');
            $('.selected > .title-content > .title-details').removeClass('hidden')
            $(this).wrap('<div class="modal"></div>');
            $('.selected > .close').removeClass('hidden');
            // getColors();
        }
        const titleId = $(this).attr('id');
        $('.similar-submit').on('click', function(e){
          e.preventDefault();
          getSimilar(titleId);  
        })
        $('.close').on('click', function(e){
            e.preventDefault();
            $('.selected').parent('div').removeClass('modal');
            $('.selected').removeClass('modal-content');
            console.log(this)
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

// function getColors() {
//     const options = {
//             headers: new Headers({
//                 'x-rapidapi-key': rapidApiKey,
//                 'X-rapidapi-host': "apicloud-colortag.p.rapidapi.com"})
//         };
//         const url = 'https://apicloud-colortag.p.rapidapi.com/tag-url.json';
//         const currrentImgUrl = $('.selected > img').attr('src');
//         const params = {
//             'url': currrentImgUrl,
//             'palette': 'precise'
//         }
//         const fullUrl = url + '?' + makeFullUrl(params);
//         fetch(fullUrl, options)
//         .then(response => response.json())
//         .then(responseJson => showColors(responseJson));
// }

// function showColors(responseJson){
//     console.log(responseJson)
//     $('.color-palette').empty();
//     for(let i=0; i < 6; i++)
//     $('.selected > .title-content > .color-palette').append(`
//     <div class="color-palette-item" style="background-color:${responseJson.tags[i].color}"></div>`)
// }


$(watchForm(), 
getTrending()
);
