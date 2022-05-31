/* Analytics functional*/
let trackingId = 'UA-97337266-6',
    cid = localStorage.getItem('ga:clientId');

function sendAnalytics(params) {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        let url = 'https://www.google-analytics.com/collect',
            paramsString = '?v=1&tid=' + trackingId + '&cid=' + cid + '&t='+params.type+'&el=NewGA';
            if (params.type != 'pageview'){
                paramsString+= '&ec='+params.category+'&ea='+params.action
               // 
            } else {
                paramsString+="&dp=/index&dt=main"
            }
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (req.status == 200) {
                //console.log('Extension registred!');
                // Resolve the promise with the response text
                //resolve(req.responseURL);
            } else {
                //console.log('Registration error!');
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };
        // Handle network errors
        req.onerror = function () {
            reject(Error("Network Error"));
        };

        //console.log(url+paramsString);
        req.open('GET', url + paramsString);


        // Make the request
        req.send();
    });
}
/* end  Analytics functional*/

//elements

var //search panel
    searchElement = document.querySelector('.search input'),
    searchElementButton = document.querySelector('.search .btn'),
       searchButtons = document.querySelectorAll('.search-button'),

    //show/hide button
    handleButton = document.querySelector('.handlers'),

    //dropdown button navr bar top menu
    dropDownMenu = document.querySelector('.dropdown'),

    //autocomplite panel
    autocompletePanel = document.querySelector('search_autocomplite'),

    url = "http://findster.co/search?ext=fm&q=";

//polyfil trim method
if (!('trim' in String.prototype)) {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}


//events handler
var searchClickHandler = function (e) {
        var query = searchElement.value;
        if (query.trim() !== '') {
            window.open(
                url + query,
                '_self'
            );
        }
    },
    searchKeyUpHandler = function (e) {
        var query = e.target.value;
        if (e.keyCode === 13 && query.trim() !== '') {
            window.open(
                url + query,
                '_self'
            );
        }
    },
    speedDialHandler = function () {
        var speedDialButtons = document.querySelector('.speeddial-dropdown');
        if (speedDialButtons.style.display == "inherit")
            speedDialButtons.style.display = "none";
        else {
            speedDialButtons.style.display = "inherit";
            document.body.scrollTop = document.body.scrollHeight;
        }
    },
    dropDownMenuHandler = function () {
        var closed = "dropdown",
            open = "dropdown open";
        if (dropDownMenu.className == closed) {
            dropDownMenu.className = open;
        } else {
            dropDownMenu.className = closed;
        }
    },
    hideDropDown = function () {
        //timeout used coz we cant click links in other cases
        setTimeout(function () {
            dropDownMenu.className = "dropdown";
        }, 100);
    };
//footer 
//elements
var optOutAnchor = document.querySelector('.opt-out-anchor'),
    termsLink = document.querySelector('.open-terms'),
    privacyLink = document.querySelector('.open-privacy'),
    disableExtensionLink = document.querySelector('a.disable-extension'),
    optOutAnchorLink = document.querySelector('.open-terms-opt-out'),
    buyUpgrade = document.getElementById('buyUpgrade'),
    

modalContainer = document.getElementById('myModal'),
    modalTerms = document.querySelector('.terms'),
    terms_close_button_1 = modalTerms.querySelector('.modal-header button'),
    terms_close_button_2 = modalTerms.querySelector('.modal-footer button'),
    modalPrivacy = document.querySelector('.privacy'),
    privacy_close_button_1 = modalPrivacy.querySelector('.modal-header button'),
    privacy_close_button_2 = modalPrivacy.querySelector('.modal-footer button'),

    //disable extension    
    modalDisableExtension = document.querySelector('.disable-extension-modal'),
    buttonYes = document.querySelector('.answer-yes'),
    buttonNo = document.querySelector('.answer-no'),
    ext_close_button_1 = modalDisableExtension.querySelector('button'),

    modalBackground = document.querySelector('.modal-backdrop'),
    modalUpgrade = document.querySelector('.buy-upgrade'),
    buyUpgrade_closeButton = modalUpgrade.querySelector('.modal-header button'),
    //footer events
    /**
     * [openModal open modal window]
     * @param  {[DOMElement]} element [modal window element needs to opened]     
     */
    openModal = function (element) {
        document.body.className = "modal-open";
        modalContainer.style.display = "block";
        element.style.display = "block";
        modalBackground.style.display = "block";
    },
    closeAllModals = function () {
        document.body.className = '';
        modalDisableExtension.style.display = 'none';
        modalContainer.style.display = "none";
        modalPrivacy.style.display = "none";
        modalTerms.style.display = "none";
        modalBackground.style.display = "none";
        modalUpgrade.style.display = "none";
    }
/**
 * [scrollToAnchor scroll inside Modal to anchor]
 * @param  {[DOMElement]} anchor [Target . scroll to this element]
 */
scrollToAnchor = function (anchor) {
        openModal(modalTerms);
        var modalBody = modalTerms.querySelector('.modal-body'),
            offsetTopAnchor = optOutAnchor.offsetTop;
        modalBody.scrollTop = offsetTopAnchor;
    },
    restoreNewTab = function () {
        chrome.runtime.sendMessage({
            msg: "getDisabled"
        }, function (response) {});
    },
    _attachEvents = function () {
        //closeModal buttons
        terms_close_button_1.addEventListener('click', closeAllModals);
        terms_close_button_2.addEventListener('click', closeAllModals);
    buyUpgrade_closeButton.addEventListener('click', closeAllModals);

        privacy_close_button_1.addEventListener('click', closeAllModals);
        privacy_close_button_2.addEventListener('click', closeAllModals);
        editTab_closeButton.addEventListener('click', closeAllModals);

        ext_close_button_1.addEventListener('click', closeAllModals);
        buttonNo.addEventListener('click', closeAllModals);
        buttonYes.addEventListener("click", restoreNewTab);
        //open modal buttons
        termsLink.addEventListener('click', function () {
            openModal(modalTerms);
        });

        privacyLink.addEventListener('click', function () {
            openModal(modalPrivacy);
        });

        optOutAnchorLink.addEventListener('click', scrollToAnchor);

        disableExtensionLink.addEventListener('click', function () {
            openModal(modalDisableExtension);
        });
        buyUpgrade.addEventListener('click', function () {
            openModal(modalUpgrade);
        });
        editTab1Button.addEventListener('click', function () {
            editDialog('tab1');
        });
        editTab2Button.addEventListener('click', function () {
            editDialog('tab2');
        });
        editTab3Button.addEventListener('click', function () {
            editDialog('tab3');
        });
        editTab4Button.addEventListener('click', function () {
            editDialog('tab4');
        });
    editTab5Button.addEventListener('click', function () {
            editDialog('tab5');
        });
    searchButtons.forEach(function(button){
            button.addEventListener('click', function(){
                sendAnalytics({type:'event',category: 'search', action: 'input-middle'});
            });
            
        });


        editTabModal_Submit.addEventListener('click', function () {
                updateTabInfo()
            }),
            //search panel mid od page
            searchElement.addEventListener('keyup', searchKeyUpHandler, false);
        searchElementButton.addEventListener('click', searchClickHandler, false);

        //show/hide button
        handleButton.addEventListener('click', speedDialHandler, false);

        //top menu(navbar) dropwodn menu "Watch movies"
        dropDownMenu.addEventListener('click', dropDownMenuHandler, false);
        dropDownMenu.addEventListener('blur', hideDropDown, true);

    };

 

window.addEventListener('DOMContentLoaded', function () {
    _attachEvents();
    searchElement.focus();
     sendAnalytics({type:'pageview'});
    // lets try this
});
//autocomplite panel
