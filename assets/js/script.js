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
let storeSavedTitles = [];
var savedImgEl = $(".saved-img");


function randomTitle(){
    saveTitleBtn.css("background-color", "#545fa8");
    posterEl.attr("src", "assets/images/Loading.gif");
    relatedImgEl.attr("src", "assets/images/Loading.gif");
    let titleList = "https://api.watchmode.com/v1/list-titles/?apiKey=dbCx7YRbc5pgx6Kaf7ntaEMkFmmK0V69gHEbLFZc&types=movie";
    let storeStreamValues = ["203", "157", "387", "26"];
    for(i = 0;i < streamChoices.length;i++){
        if($(streamChoices[i]).prop("checked")){
            storeStreamValues = storeStreamValues.filter((item) => {
                return item == $(streamChoices[i]).val()
            })
        }  
    }
    titleList = titleList + "&source_ids=" + storeStreamValues.join(",");
    
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
    posterEl.attr("src", "assets/images/Loading.gif");
    relatedImgEl.attr("src", "assets/images/Loading.gif");
    var event = event.target;
    imdbCall(event.id);
}

function restoreSaved(){
    var storage = JSON.parse(localStorage.getItem("titles"));
    if(storage != null){
       for(i = 0;i < storage.length;i++){
            displayLiked(storage[i]);
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

function displayLiked(titleID){
    var recentApiCall = "https://imdb-api.com/en/API/Title/k_vqj51s28/" + titleID;
    $.ajax({
        url: recentApiCall,
        method: 'GET'
    }).then(function(response){
        var container = $("<div>");
        container.addClass("col s12 m3");
        var cardDivEl = $("<div>");
        cardDivEl.addClass("card saveCards");
        var cardImgEl = $("<div>");
        cardImgEl.addClass("card-image waves-effect waves-block waves-light");
        var imgEl = $("<img>");
        imgEl.addClass("saved-img");
        imgEl.attr("src", "./assets/images/Loading.gif")

        var btnEl = $("<a>");
        btnEl.addClass("waves-effect waves-light btn deleteBtn");
        btnEl.attr("id", response.id);
        var deleteText = document.createTextNode("Remove");

        var closeEl = $("<i>");
        closeEl.addClass("material-icons right");

        cardImgEl.append(imgEl);
        cardDivEl.append(cardImgEl);
        container.append(cardDivEl);
        $("#saved-cards").append(container);
        imgEl.attr("src", response.image);

        cardDivEl.append(btnEl);
        btnEl.append(deleteText);


    })

}

function removeTitle(event){
    var event = event.target
    if(event.matches(".deleteBtn")){
        storeSavedTitles = storeSavedTitles.filter((item) => {
            return item != event.id
        })
        localStorage.setItem("titles", JSON.stringify(storeSavedTitles));
        location.reload();
    }
    
}


submitBtn.on("click", randomTitle)
relatedImgEl.on("click", relatedClickHandle);
saveTitleBtn.on("click", saveTitle);
$("#saved-cards").on("click", removeTitle);