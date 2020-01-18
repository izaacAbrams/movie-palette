"use strict";

const tmdbApi = "85a0dacfff0d08f1c3713be131c6cb65";
const rapidApiKey = "d5c2b783bamshaee5da7f787d6a2p1cce10jsnadf76762d651";
// alt key "b13b17d0cemsh83f578cce0d1efcp1a073cjsn3e03ae9e5d9f"

//on page load, get trending movies for the week
function getTrending(){
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApi}`
    fetch(url)
    .then(response => response.json())
    .then(responseJson => displaySearch(responseJson))
    .catch(err => {
        $('.ul-results').text(`Something went wrong: ${err.message}`)
    });
}
//on load, watch form for submit and pass to function to get movie results
function watchForm(){
    $('form').submit(e => {
        e.preventDefault();
        let userInput = $('.form-input').val();
        console.log(userInput);
        getTitles(userInput);
        $('form').parent('section').removeClass('home-page');
        $('form').parent('section').addClass('result-page');
        $('.about-text').addClass('hidden');
    })
}
//maps through object and returns keys and values in a url format
function makeFullUrl(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${params[encodeURIComponent(key)]}`)
    return queryItems.join('&');
}
//calls the movie db api and returns the first page of results
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
    .then(responseJson => displaySearch(responseJson))
    .catch(err => {
        $('.ul-results').text(`Something went wrong: ${err.message}`)
    })
    ;
}
//creates html list items for each result returned. if movie title is more than 15 characters 
// it will cut off remaining characters and replace with ... 
function displaySearch(responseJson){
    $('.ul-results').empty();
    if (responseJson.results.length === 0){
        $('.ul-results').text('Title not found, check spelling and try again.');
    }
    for(let i=0; i < responseJson.results.length; i++){

        $('.ul-results').append(
            `<section class="list-container">
                <li class="result-li item${i}" id="${responseJson.results[i].id}">
                    <img src="https://image.tmdb.org/t/p/original${responseJson.results[i].poster_path}">
                    <div class="title-content">
                        <div class="title-details hidden">
                            <h2 class="list-title">${responseJson.results[i].original_title}</h2>
                            <p class="list-description">${responseJson.results[i].overview}</p>
                            <section class="color-palette"></section> 
                            <button type="submit" class="similar-submit">Find Similar?</button>
                        </div>  
                    </div> 
                    <span class="close hidden">&times;</span> 
                </li>
                <h2 class="result-title" id="title${i}">
                ${(responseJson.results[i].original_title.length > 15) ?
                responseJson.results[i].original_title.slice(0, 14) + "..." : 
                responseJson.results[i].original_title}</h2>
            </section>`
        )
        if(responseJson.results[i].poster_path === null) {
            $(`.item${i}`).hide();
            $(`#title${i}`).hide();
            console.log(`.title${i}`)
        }
     }
        watchResults();
}
//creates modal when user clicks on movie poster
function watchResults(){
    $('.result-li').on('click', function(e) {
        if($('.result-li').hasClass('selected') !== true){

            $(this).addClass('selected modal-content');
            $('.selected > .title-content > .title-details').removeClass('hidden');
            $(this).wrap('<div class="modal"></div>');
            $(this).parent('div').siblings('h2').addClass('hidden');
            $('body').attr('style', 'overflow: hidden');
            $('.selected > .close').removeClass('hidden');
            getColors();
            console.log(this)
            const currentSelect = $('.selected').attr('id');
            $('.close' ).on('click', function(){
            close(currentSelect); });
        }
    
        const titleId = $(this).attr('id');
        $('.similar-submit').on('click', function(e){
          e.preventDefault();
          $('form').parent('section').removeClass('home-page');
          $('form').parent('section').addClass('result-page');
          $('body').attr('style', 'overflow: auto');
          getSimilar(titleId);  
        });
       
    });
    $('img.logo').on('click', function(){
            console.log('working')
            $('.logo').parent('section').removeClass('result-page');
            $('.logo').parent('section').addClass('home-page');
            $('.form-input').val('');
            getTrending(); 
        });
}
//closes modal when user clicks on x
function close(currentSelect){
    $(`#${currentSelect}`).one('click', function(){
    $(`#${currentSelect}`).unwrap('.modal');
    $(`#${currentSelect}`).removeClass('modal-content');
    $(`#${currentSelect}`).siblings('h2').removeClass('hidden');
    $('.title-details').addClass('hidden');
    $('.close').addClass('hidden');
    $('.color-palette-item').addClass('hidden');
    $(`#${currentSelect}`).removeClass('selected');
    $('body').attr('style', 'overflow: auto');
    watchResults();
});
}
//takes movie that button was pressed on and fetches movies similar to that
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

    window.scrollTo(0, 0);
}
//due to api limits can only load results when user opens modal
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
            'palette': 'precise'
        }
        const fullUrl = url + '?' + makeFullUrl(params);
        fetch(fullUrl, options)
        .then(response => response.json())
        .then(responseJson => showColors(responseJson));
}
//places results inside the div element, and listens for click on each element to copy to clipboard
function showColors(responseJson){
    $('.color-palette').empty();
    for(let i=0; i < 6; i++){
    $('.selected > .title-content > .title-details > .color-palette').append(`
    <div class="color-palette-item ${responseJson.tags[i].label.slice(0,3)}" style="background-color:${responseJson.tags[i].color}">
    <p class="inner-color-text">${responseJson.tags[i].color}</p></div>`);
    $(`.${responseJson.tags[i].label.slice(0,3)}`).on('click', function(){
    var $temp = $("<input>");
    $('body').append($temp);
    $temp.val($(this).children($('.inner-color-text')).text()).select();
    document.execCommand("copy");
    $temp.remove(); 
    $(this).children('.inner-color-text').html(`
        <p class="inner-color-text">Copied!</p>`);
    setTimeout(function(){
        $(`.${responseJson.tags[i].label.slice(0,3)}`).children('.inner-color-text').html(`
        <p class="inner-color-text">
        ${responseJson.tags[i].color}</p>`);
    }, 2000);
})
}
}


$(watchForm(), 
getTrending()
);
