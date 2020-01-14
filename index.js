"use strict";

const tmdbApi = "85a0dacfff0d08f1c3713be131c6cb65";
const rapidApiKey = "b13b17d0cemsh83f578cce0d1efcp1a073cjsn3e03ae9e5d9f";

function getTrending(){
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApi}`
    fetch(url)
    .then(response => response.json())
    .then(responseJson => displayTrending(responseJson));

}

function displayTrending(responseJson){
    for(let i=0; i < responseJson.results.length; i++){
        $('.ul-results').append(
            `<li class="result-li item${i}" id="${responseJson.results[i].id}">
            <img src="https://image.tmdb.org/t/p/original${responseJson.results[i].poster_path}">
            <section class="title-details hidden">
            <h2 class="list-title">${responseJson.results[i].original_title}</h2>
            <p class="list-description">${responseJson.results[i].overview}</p>
            <button type="submit" class="similar-submit">Find Similar?</button>
            <div class="video-section"></div>
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
    return queryItems.join('&')
}

function getTitles(userInput){
    const mUrl = "https://api.themoviedb.org/3/search/movie";
    // const tUrl = "https://api.themoviedb.org/3/search/tv";
    const params = {
        "api_key": tmdbApi,
        "query": userInput,
        "lang": "en-US",
        "page": "1"
    }
    const formatParams = makeFullUrl(params);
    const movieUrl = mUrl + '?' + formatParams;
    // const tvUrl = tUrl + '?' + formatParams;

    fetch(movieUrl)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson));

    // fetch(tvUrl)
    // .then(response => response.json())
    // .then(responseJson => displaySearch(responseJson));
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
            <div class="video-section"></div>
            </section>
            <section class="color-palette">
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
            getColors();
            
        }else{
            $(this).addClass('selected');
            $('.title-details', this).removeClass('hidden');
            getPlatforms();
            getColors();
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
    // const tvUrl = 'https://api.themoviedb.org/3/tv/';
    const movieId = `${titleId}/similar`;
    const params = {
        "api_key": tmdbApi,
        "lang": "en-US",
        "page": "1"
    }

    const fullUrl = url + movieId + '?' + makeFullUrl(params); 
    // const fullTvUrl = tvUrl + movieId + '?' + makeFullUrl(params);

    fetch(fullUrl)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson));

    // fetch(fullTvUrl)
    // .then(response => response.json())
    // .then(responseJson => displaySearch(responseJson));
}

function getPlatforms(){
    // const currentTitle = $('.selected > section > .list-title').text();
    // console.log(currentTitle);
    // const baseUrl = 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup';
    // const options = {
    //     headers: new Headers({
    //         'X-RapidAPI-Key': utellyKey})
    // };
    // const params = {
    //     'term': currentTitle,
    //     'country': 'us'
    // }
    // const utellyUrl = baseUrl + '?' + makeFullUrl(params);

    // fetch(utellyUrl, options)
    // .then(response => response.json())
    // .then(responseJson => showPlatforms(responseJson, currentTitle));
    const currentId = $('.selected').attr('id');
    const baseUrl = `https://api.themoviedb.org/3/movie/${currentId}/videos`;
    // const baseTvUrl = `https://api.themoviedb.org/3/tv/${currentId}/videos`
    const params = {
        'api_key': tmdbApi,
        'language': 'en-US'
    }
    const videoLinkUrl = baseUrl + '?' + makeFullUrl(params);
    // const fullTvUrl = baseTvUrl + '?' + makeFullUrl(params);
    fetch(videoLinkUrl)
    .then(response => response.json())
    .then(responseJson => showPlatforms(responseJson));

    // fetch(full)
    // .then(response => response.json())
    // .then(responseJson => showPlatforms(responseJson));
}

function showPlatforms(responseJson){
    console.log(responseJson);
    $('.video-section').empty();
    // for(let i = 0; i < responseJson.results.length; i++){
        console.log(responseJson.results[0].key);
        if(responseJson.results[0].type === "Trailer"){
        const videoId = responseJson.results[0].key;
        $('.video-section').append(`
        <iframe width="340" height="160" src="https://www.youtube-nocookie.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`);
        }
    // }
    
    // for(let i = 0; i < responseJson.results.length; i++){
    //     if(responseJson.results[i].name === currentTitle){
    //         console.log(responseJson.results[i]);
    //         const titleResults = responseJson.results[i];

    //         for(let d = 0; d < responseJson.results[0].locations.length; d++){
    //             $('.platforms').append(`
    //             <a href="${titleResults.locations[d].url}" target="_blank">
    //             <img src="${titleResults.locations[d].icon}" alt="${titleResults.locations[d].display_name}" class="platform-logo">
    //             </a>`);
    //         }
    //     }
    // }
   
}

function getColors() {
    const options = {
            headers: new Headers({
                'x-rapidapi-key': rapidApiKey,
                'X-rapidapi-host': "apicloud-colortag.p.rapidapi.com"})
        };
        const url = 'https://apicloud-colortag.p.rapidapi.com/tag-url.json';
        const currrentImgUrl = $('.selected > img').attr('src');
        const params = {
            'url': currrentImgUrl,
            'palette': 'w3c'
        }
        const fullUrl = url + '?' + makeFullUrl(params);
        fetch(fullUrl, options)
        .then(response => response.json())
        .then(responseJson => showColors(responseJson));
}

function showColors(responseJson){
    console.log(responseJson)
    $('.color-palette').empty();
    for(let i=0; i < 6; i++)
    $('.selected > .color-palette').append(`
    <div class="color-palette-item" style="background-color:${responseJson.tags[i].color}"></div>`)
}


$(watchForm(), 
getTrending()
);
