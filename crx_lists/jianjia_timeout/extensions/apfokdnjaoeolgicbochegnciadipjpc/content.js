'use strict'

// The array containing all the sites we have added
let pirateSites = [];
// Start by loading all the data a user might already have.
loadURLs();

// TEMP
// We check if the site contains an element called searchResult, else we do nothing
let bestUploaders = ["EtHD"];
let trustedUploaders = ["TvTeam",
                        "sotnikam"];

let iteratorIndex = 0;
let rowColorIndex = 0;

if($("#searchResult").val() !== undefined)
{
    $("tr").each(function(){
        console.log($("#searchResult").val());
        // Only do it when detName is present


        if($(this).attr("class") != "header")
        {
            console.log("Printing every <tr> iteration: " + iteratorIndex);
            console.log(($(this)[0]));
            iteratorIndex++;


            var linkToReplace = $(this).find(".detName > a");
            var linkToReplaceURL = linkToReplace.attr("href");
            //console.log("link to replace: " + linkToReplace[0]);
            var replacementLink = $(this).find(".detName").next();
            //console.log("replacement link: " + replacementLink[0]);
            // Replace the actual links
            linkToReplace.attr("href", replacementLink.attr("href"));
            // Add the old link so we can still open the individual pages with extra info
            linkToReplace.after($("<br><a href='" + linkToReplaceURL + "'>Detailed information</a>"));


            var uploader = $(this).find("a.detDesc").text();
            console.log("Uploader: " + uploader);

            // -1 means that the element is not found in the array
            if($.inArray(uploader, trustedUploaders) != -1)
            {
                // We hit upon a trusted uploader
                // We change the entire row to silver
                $(this).css("background-color", "silver");
                $("tr:first-child").after($(this));
                $(this).remove();
            }
            else if($.inArray(uploader, bestUploaders) != -1)
            {
                // We hit upon the best uploaders
                // We change the entire row to gold
                $(this).css("background-color", "gold");
                $("tr:first-child").after($(this));
                $(this).remove();
            }
            else
            {
                // Give every row a different color
                if(rowColorIndex % 2 === 0)
                {
                    $(this).css("background-color", "DarkSalmon");
                }
                else
                {
                    $(this).css("background-color", "Bisque");
                }
                rowColorIndex++;
            }
        }
    });
    // rest of the code

    // remove footer
        $("#foot").remove();

    // Remove h2 at the top
        console.log("Removing h2")
        $("h2").remove();

    // add some <br> so we can scroll a bit more to the bottom
        console.log("Adding br")
        var amountOfBr = 10;
        for(i = 0; i < amountOfBr; i++){
            $("#content").after($("<br>"));
        }

    // Change the width and horizontally center the #header
        var widthValue = $("#main-content").width();
        $("#header").width(widthValue).css("margin", "0 auto");
        $("tbody").css("border-color", "black");

    // Focus on search input
        $(".inputbox").focus();

}
else
{
    console.log("#searchResult is not present");
}


function loadURLs(){
    chrome.storage.sync.get(["pirateData"], function(result){
        console.log("Result: ");
        console.log(result);
        console.log("pirateData: ");
        console.log(result.pirateData);

        // If pirateData doesn't already exist, make a new array
        if(result.pirateData === undefined){
            pirateSites = [];
        }
        else{
            pirateSites = result.pirateData;
        }

        console.log("All the websites have been loaded into the pirateSites array");

       //

    });
};

function addOrRemoveURL(){
    // Check if the site exists in the array, add it if it doesn't, remove it if it does

    console.log("start of addOrRemoveURL, pirateSites: ");
    console.log(pirateSites);

    let currentUrl = window.location.hostname;
    let urlExistsInArray = false;
    let urlIndexInArray;

    for(let arrayIndex in pirateSites){
        if(currentUrl === pirateSites[arrayIndex]){
            urlExistsInArray = true;
        }
    }

    if(urlExistsInArray){
        urlIndexInArray = pirateSites.indexOf(currentUrl);
        pirateSites.splice(urlIndexInArray, 1);
        console.log("Website removed from extension");
    }
    else{
        pirateSites.push(currentUrl);
        console.log("Website added to extension");
    }

    chrome.storage.sync.set({"pirateData": pirateSites}, function(){
        console.log("pirateData updated!");
        console.log(pirateSites);
    })
};


chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    //console.log("Start of onMessage listener");
    console.log(response);
    if(response.toString() === "click"){
        console.log("User clicked the extension logo");
        console.log("We need to either add or remove this site from the URL list");
        addOrRemoveURL();
    }
    else{
        console.log("A message has been received, but its format is not correct!");
    }
});