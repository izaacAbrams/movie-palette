"use strict";
const tasteApi = "352968-Whattowa-ZQU1BGEQ";
const tasteUrl = "https://tastedive.com/api/similar"


function watchForm() { 
    $('form').submit(e => {
        e.preventDefault();
        let userTitle = $('.form-search').val();
        console.log(userTitle);
        returnRecTitles(userTitle);
    });
}

function returnRecTitles(userTitle){
    fetch(tasteUrl + `?q=${userTitle}&k=${tasteApi}&info=1`)
    .then(results => results.json())
    .then(resultsJson => console.log(resultsJson));

}



$(watchForm())