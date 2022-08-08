var posterEl = $(".poster");
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

// this function will use our first api to give us a list of 250 random titles within the parameters determined by the user inupt, if any. From that list we will get a random title and use the IMDb id as an argument to the following function

function randomTitle(){
    $("#one-card").removeClass("hide");
    $("#four-cards").removeClass("hide");
    saveTitleBtn.css("background-color", "#545fa8");
    posterEl.attr("src", "assets/images/Loading.gif");
    relatedImgEl.attr("src", "assets/images/Loading.gif");
    let titleList = "https://api.watchmode.com/v1/list-titles/?apiKey=xj5lXUo0RCosNUa88eMndZ6X2Lpae8w7BJlwM4zS&types=movie";
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
    
    
    
    
}   

// this function will make another ajax call but to the IMDb api to gather the specific details of that random movie generated, which then lets us display the image and neccessary text where it is applied in the DOM
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
    }).catch(function(response){
        randomTitle();
    })
    $("input").prop("checked", false);

    
    
}

//this function, triggered by a click on one of the four related movie images, will use the id given to that image (the IMDb id), which will also be used as an argument for the previous function
function relatedClickHandle (event){
    saveTitleBtn.css("background-color", "#545fa8");
    posterEl.attr("src", "assets/images/Loading.gif");
    relatedImgEl.attr("src", "assets/images/Loading.gif");
    var event = event.target;
    imdbCall(event.id);
}

// this function will grab down the local storage, loop through it to pass each iteration as an argument into the displayLiked function--each iteration being the IMDb id 
function restoreSaved(){
    var storage = JSON.parse(localStorage.getItem("titles"));
    if(storage != null){
       for(i = 0;i < storage.length;i++){
            if(storage.length > 12){
                storage.shift();
            }
            displayLiked(storage[i]);
            storeSavedTitles.push(storage[i]);
       }
    } 
}

restoreSaved();

// this function uses the IMDB that was set as the like button's id and stores it into the array that gets set to localStorage. Also we check to make you can only add the same title once with the if statement that only allows the id to be saved if the array doesn't already include it
function saveTitle(event){

    var event = event.target;
    saveTitleBtn.css("background-color", "#8d2525");
    if(!storeSavedTitles.includes(event.id)){
        storeSavedTitles.push(event.id);
        if(storeSavedTitles != null){
            localStorage.setItem("titles", JSON.stringify(storeSavedTitles));
        }
    }

}

// this function makes another ajax call for each id in the localStorage array when its pulled down and dynamically creates card images for each liked movie and a remove button to help initiate the removeTitle function
function displayLiked(titleID){
    var recentApiCall = "https://imdb-api.com/en/API/Title/k_vqj51s28/" + titleID;
    $.ajax({
        url: recentApiCall,
        method: 'GET'
    }).then(function(response){
        var container = $("<div>");
        container.addClass("cust-flex");
        var cardDivEl = $("<div>");
        cardDivEl.addClass("card saveCards");
        var cardImgEl = $("<div>");
        cardImgEl.addClass("card-image waves-block waves-light");
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

// this function, triggered by clicking the remove button that was also assigned the id of the corresponding liked movie, will filter through the localStorage array and only keep the id's that were not cliked on, resetting the localStorage and then reloading th page to show the update
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