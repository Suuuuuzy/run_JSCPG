// original file:/media/data2/jianjia/extension_data/unzipped_extensions/nigpjoecjjkcklfkphnddcjkjmapofho/content.js

start();

function start() {
    const buttons = [
        {
            label: "uLaw Email Read",
            textColor: "white",
            borderRad: 1,
            color: "#850510",
            hoverColor: "#471a1e",
            hoverFColor: "orange",
            className: "tag"
        },
        {
            label: "uLaw Email Sent",
            textColor: "white",
            borderRad: 1,
            color: "#850510",
            hoverColor: "#471a1e",
            hoverFColor: "orange",
            className: "tag"
        },
        {
            label: "uLaw Email Comp",
            textColor: "white",
            borderRad: 1,
            color: "#850510",
            hoverColor: "#471a1e",
            hoverFColor: "orange",
            className: "ulaw0"
        },
    ];

    /*region info
   * textRegion: where you type in gmail
   * containerRegion: the container
   * buttonRegion: where buttons are injected
   * watcherRegion: close child of container region
   * watcherRegion2: for default Gmail view
   * replayAll: reply button reference
   * send: send button reference
   * from: from e-mail address
   * to: to e-mail address
   * title: title/subject of e-mail
   */
    const regions = {
        textRegion: ".Am.aO9.Al.editable.LW-avf",
        containerRegion: ".nH.ar4",
        buttonRegion: ".amn",
        watcherRegion: ".BltHke.nH.oy8Mbf",
        watcherRegion2: ".AO",
        splitViewRegion: ".ae4.Zs",
        replyAll: "span.ams.bkI",
        reply: "span.ams.bkH",
        send: ".T-I.J-J5-Ji.v7",
        from: "span.gD",
        to: "span.g2",
        title: ".hP",
        new_send: ".btC",
        new_send_end: ".gU.az5",
        newMessageRegion: ".nH.VL .no",
        newMessage: ".nH.nn",
        replayForwardComposeRegion: ".ip.adB",
        emailComposeRegion: ".gO.aQY",
        emailComposeEmail: ".oL.aDm.az9",
        emailComposeEmailx: ".vN.vP.a3q",
        emailComposeTitleRegion: ".bAs",
        emailComposeTitle: ".aoT",
        emailComposeTitlex: ".aoD.az6",
    };
    /* 
    New message:
    watch class "no"
    look for class "nH nn" check for length > 0
    look for class "gU az5" insert before td
    .ip.adB
    */

    function composeClicked(button) {
        console.log ("compose button");
        let a1 = $(regions.newMessageRegion);
        let a2 = a1.find(regions.newMessage);

        $(regions.newMessageRegion).find(regions.newMessage).each(function () {
           let a;
           a = $(this).find(regions.emailComposeEmail + " span");
           if (a.length !== 0) {
               console.log ("comp email string found");
               let x = {};
               x.compTo = a.attr( "email");
               console.log("to:" + x.compTo);
               chrome.storage.sync.set({"timeDocketTitle": 'Email Composed'}, function() {
               });
               chrome.storage.sync.set({"timeDocketEmail": x.compTo}, function() {
               });
           } else {
               //console.log ("comp not found");
           }
           a = $(this).find(regions.emailComposeTitleRegion);
           if (a.length !== 0) {
               console.log ("comp title string found");
           } else {
               //console.log ("comp not found");
           }
           a = $(this).find(regions.emailComposeTitle);
           if (a.length !== 0) {
            let sub = a.val();
            console.log ("comp title found " + sub);
            chrome.storage.sync.set({"timeDocketDescription": sub}, function() {
            });
           } else {
               //console.log ("comp not found");
           }
        });
    }
    function buttonClicked(button) {
        //button click action
        if (
            $(regions.watcherRegion).length !== 0 &&
            $(regions.splitViewRegion).length !== 0
        ) {
            buttonClickedHelper(button, regions.watcherRegion);
        } else if ($(regions.watcherRegion2).length !== 0) {
            buttonClickedHelper(button, regions.watcherRegion2);
        }
    }

    function buttonClickedHelper(button, watcherRegion) {
        $(watcherRegion).each(function () {
            let x = {};

            if ($(this).css("display") !== "none") {
                let a;
                a = $(this).find(regions.from);
                if (a.length !== 0) {
                    x.from = a.attr( "email");
                    console.log("from:" + x.from);
                } else {
                    console.log ("from not found");
                }
                a = $(this).find(regions.to);
                if (a.length !== 0) {
                    x.to = a.attr( "email");
                    console.log("to:" + x.to);
                } else {
                    console.log ("to not found");
                }
                a = $(this).find(regions.title);
                if (button.label == "uLaw Email Sent")
                {
                  chrome.storage.sync.set({"timeDocketTitle": 'Email Responded'}, function() {
                  });
                } else {
                  chrome.storage.sync.set({"timeDocketTitle": 'Email Correspondence'}, function() {
                  });
                }
                if (a.length !== 0) {
                    x.title = a.text();
                    console.log("title:" + x.title);
                    chrome.storage.sync.set({"timeDocketDescription": x.title}, function() {
                    });
                } else {
                    console.log ("title not found");
                    chrome.storage.sync.set({"timeDocketDescription": ''}, function() {
                    });
                }

                if (Object.keys(x).length !== 0) {
                    let j = JSON.stringify(x);
                    console.log("Store Email"+x.from);
                    console.log("buttonname "+button.label);
                    if (button.label == "uLaw Email Sent")
                    {
                      chrome.storage.sync.set({"timeDocketEmail": x.to}, function() {
                      });
                    } else {
                      chrome.storage.sync.set({"timeDocketEmail": x.from}, function() {
                      });
                    }
                    console.log ("json is " + j);
                    chrome.runtime.sendMessage({text: j}, function(response) {
                        console.log("Response: ", response);
                    });                
                }
            }
        });
    }

    //adds a single button
    function addButton(button,fn) {
        let newButton = document.createElement("button");
        newButton.innerHTML = button.label;
        newButton.onclick = () => fn(button);
        newButton.className = button.className;
        newButton.style.color = button.textColor;
        newButton.style.title = button.label;
        newButton.style.cursor = "pointer";
        //newButton.style.borderRadius = button.borderRad;
        newButton.style.borderRadius = "4px";
        newButton.style.marginRight = "1rem";
        newButton.style.padding = "8px 3px 8px 3px";
        newButton.style.width = "8rem";
        newButton.style.background = button.color;
        $(newButton).hover(
            function () {
                $(this).css("background-color", button.hoverColor);
                $(this).css("color", button.hoverFColor);
            },
            function () {
                $(this).css("background-color", button.color);
                $(this).css("color", button.textColor);
            }
        );
        return newButton;
    }
    function composeButtons() {
        $(regions.newMessage).each(function () {
            composeButtonHelper(this);
        });
    }

    function composeButtonHelper(obj) {
            let button = buttons[2];
            if ($(obj).find("." + button.className).length === 0) {
                let x = $(obj).find(regions.new_send);
                if (x.length !== 0) {
                    x = x.find(regions.new_send_end);
                    let container = document.createElement("td");

                    let newButton = addButton(buttons[2],composeClicked);
                    container.append(newButton);
                    x.before(container);
                }
            }
    }

    //initialize buttons
    function initButtons() {
        //if in multi-pane view
        if (
            $(regions.watcherRegion).length !== 0 &&
            $(regions.splitViewRegion).length !== 0
        ) {
            initButtonHelper(regions.watcherRegion);
            //if in single-pane view
        } else if ($(regions.watcherRegion2).length !== 0) {
            initButtonHelper(regions.watcherRegion2);
        }
    }

    function initButtonHelper(watcherRegion) {
        // console.log("watcher region:" + watcherRegion);
        $(watcherRegion).each(function () {
            if ($(this).css.display !== "none" && $(this).find(".tag").length === 0) {
                let x = $(this).find(regions.buttonRegion);

                if (x[x.length - 1] !== undefined) {
                    let container = document.createElement("div");

                    if ($(this).find(regions.replyAll).length !== 0) {
                        $(this).find(regions.replyAll)[0].innerHTML = "All";
                    }

                    for (let i = 0; i < buttons.length; i++) {
                        if (buttons[i].className === "tag") {
                           let newButton = addButton(buttons[i],buttonClicked);
                           container.append(newButton);
                        }
                    }

                    x[x.length - 1].appendChild(container);
                }
            }
        });
    }

    //look for changes in DOM element
    function startObserver(region, fn) {
        let inter = setInterval(function () {
            let panel = $(region);

            if (panel.length > 0) {
                var mutationObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(() => fn(mutationObserver));
                });

                mutationObserver.observe(panel[0], {
                    attributes: true,
                    characterData: true,
                    childList: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                });

                clearInterval(inter);
            }
        }, 300);
    }
    //look for changes in DOM element
    function startObserver2(region, fn) {
        let inter = setInterval(function () {
            let panel = $(region);

            if (panel.length > 0) {
                var mutationObserver = new MutationObserver(function (mutations) {
                    mutations.forEach(() => fn(mutationObserver));
                });

                mutationObserver.observe(panel[0], {
                    attributes: false,
                    characterData: false,
                    childList: true,
                    subtree: false,
                    attributeOldValue: false,
                    characterDataOldValue: false
                });

                clearInterval(inter);
            }
        }, 300);
    }

    try {
        startObserver(regions.containerRegion, initButtons);
    } catch (e) {
        console.log("Failed to Initialize");
        console.error();
    }

    try {
        startObserver2(regions.newMessageRegion, composeButtons);
    } catch (e) {
        console.log("Failed to Initialize test regions");
        console.error();
    }

}

