var posterEl = $("#poster");
var titleEl = $("#m-title");
var actorsEl = $("#m-actors");
var plotEl = $("#m-plot");
var imDbLink = $("#linktoIMDb");
var streamChoices = $(".stream-choices");
var genreChoices = $(".genre-choices");
var relatedImgEl = $(".related-img");
var saveTitleBtn = $(".like-btn");
var submitBtn = $("#submit");
var storeSavedTitles = [];


function randomTitle(){
    saveTitleBtn.css("background-color", "#545fa8");
    posterEl.attr("src", "assets/images/loading.gif");
    relatedImgEl.attr("src", "assets/images/loading.gif");
    let titleList = "https://api.watchmode.com/v1/list-titles/?apiKey=dbCx7YRbc5pgx6Kaf7ntaEMkFmmK0V69gHEbLFZc&types=movie";
    let storeStreamValues = [];
    for(i = 0;i < streamChoices.length;i++){
        if($(streamChoices[i]).prop("checked")){
            storeStreamValues.push($(streamChoices[i]).val());
        }
        
    }
    if(storeStreamValues != 0){
        titleList = titleList + "&source_ids=" + storeStreamValues.join(",");
    }

    let storeGenreValues = [];
    for(i = 0;i < genreChoices.length;i++){
        if($(genreChoices[i]).prop("checked")){
            storeGenreValues.push($(genreChoices[i]).val());
        }
    }
    if(storeGenreValues != 0){
        titleList = titleList + "&genres=" + storeGenreValues.join(",");
    }
    console.log(storeStreamValues);
    console.log(titleList);
    
    $.ajax({
        url: titleList,
        method: 'GET',
        
    }).then(function(response){
        var getRandom = response.titles[Math.floor(Math.random() * response.titles.length)];
        console.log(response);
        console.log(getRandom);
        imdbCall(getRandom.imdb_id);
    })
    
    $("input").prop("checked", false);
}   

function imdbCall(imbdID){
    var imdbURL = "https://imdb-api.com/en/API/Title/k_vqj51s28/" + imbdID;
    console.log(imdbURL)
    $.ajax({
    url: imdbURL,
    method: 'GET',
}).then(function(response){
    posterEl.attr("src", response.image);
    saveTitleBtn.attr("id", response.id);
    titleEl.text(response.fullTitle);
    actorsEl.text(response.stars);
    plotEl.text(response.plot);
    $("#im-rating").text(response.imDbRating);
    imDbLink.attr("href", "https://www.imdb.com/title/" + response.id);
    
    var storeSimilar = [];
    console.log(response);
    for(i = 0; i < response.similars.length;i++){
        storeSimilar.push(response.similars[i]);
        
    }
    console.log(storeSimilar);
    for(i = 0; i < relatedImgEl.length;i++){
        $(relatedImgEl[i]).attr({src: storeSimilar[i].image, id: storeSimilar[i].id});
        
    }
    
    console.log(response);
})
    $("#one-card").removeClass("hide");
    $("#four-cards").removeClass("hide");
}

function relatedClickHandle (event){
    saveTitleBtn.css("background-color", "#545fa8");
    posterEl.attr("src", "assets/images/loading.gif");
    relatedImgEl.attr("src", "assets/images/loading.gif");
    var event = event.target;
    imdbCall(event.id);
}

function restoreSaved(){
    var storage = JSON.parse(localStorage.getItem("titles"));
    if(storage != null){
       for(i = 0;i < storage.length;i++){
            storeSavedTitles.push(storage[i]);
       }
    } 
}

restoreSaved();

function saveTitle(event){
    var event = event.target;
    saveTitleBtn.css("background-color", "#8d2525");
    storeSavedTitles.push(event.id);
    if(storeSavedTitles != null){
        localStorage.setItem("titles", JSON.stringify(storeSavedTitles));
    }


}


submitBtn.on("click", randomTitle)
relatedImgEl.on("click", relatedClickHandle);
saveTitleBtn.on("click", saveTitle);