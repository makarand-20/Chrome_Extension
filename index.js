let myLinks = []
let inputEl = document.getElementById("inputEl")
let inputBtn = document.getElementById("inputBtn")
let ulEl = document.getElementById("ulEl")
let delbtn = document.getElementById("delbtn")
let tabbtn = document.getElementById("tabbtn")
let inputallBtn = document.getElementById("inputallBtn")
let openbtn = document.getElementById("openbtn")

const userName = document.querySelector("#searchbar")

const shareButton = document.getElementById('share-button');


shareButton.addEventListener('click', async () => {
    try {
        await navigator.share({
        title: 'Title of shared content',
        text: 'Text of shared content',
        url: 'https://example.com/shared-content'
        });
        console.log('Content shared successfully');
    } catch (error) {
        console.error('Error sharing content:', error);
    }
});


const whatsappShareButton = document.getElementById('whatsapp-share-button');
    whatsappShareButton.addEventListener('click', function(){
        chrome.tabs.query({currentWindow: true}, function(tabs){

            const tabText = tabs.map((tab) => {
                return `${tab.title}: ${tab.url}`;
            }).join('\n');  
        
            // Create a share URL with the tab information
            const shareUrl = `https://web.whatsapp://send?text=${encodeURIComponent(tabText)}`;
        
            // Open the share URL in a new tab
            chrome.tabs.create({url: shareUrl}, (tab) => {
            console.log('WhatsApp share tab created:', tab);
            });
        });
    });

// Get all tabs in the current window


const linksFromLocalStorage = JSON.parse( localStorage.getItem("myLinks") )

if (linksFromLocalStorage) {
    myLinks = linksFromLocalStorage
    render(myLinks)
}

function render(links){
    let listLinks = ""
    for(let i = links.length - 1; i >= 0; i--){
        listLinks += `
            <li class='linkss'>
                <a target = '_blank' href = '${links[i]}'>
                    ${links[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listLinks
}

tabbtn.addEventListener("click", function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLinks.push(tabs[0].url)
        localStorage.setItem("myLinks", JSON.stringify(myLinks) )
        render(myLinks)
        location.reload();
        let notiopt = {
            type : 'basic',
            iconUrl : 'icon.png',
            title : 'URL Saved! ',
            message : 'Url saved, to see the url click on arrow...'
        };
        chrome.notifications.create('savedurlnoti', notiopt)
    })
})

inputallBtn.addEventListener("click", function(){
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          myLinks.push(tabs[i].url)
          localStorage.setItem("myLinks", JSON.stringify(myLinks) )
          render(myLinks)
          location.reload();
        }
      });
})

delbtn.addEventListener("click", function() {
    var result = confirm("Want to delete?");
    if (result) {
        localStorage.clear()
        myLinks = []
        render(myLinks)
        location.reload();
        let notiopt = {
            type : 'basic',
            iconUrl : 'icon.png',
            title : 'All URLs are deleted',
            message : 'Now you can create more urls'
        };
        chrome.notifications.create('savedurlnoti', notiopt)
    }
})

inputBtn.addEventListener("click", function(){
    if(inputEl.value.trim()){ 
        myLinks.push(inputEl.value)
    }
    inputEl.value = ""
    localStorage.setItem("myLinks", JSON.stringify(myLinks) )
    render(myLinks)
    location.reload();
})

openbtn.addEventListener("click", function(){
    for (var i = 0; i < myLinks.length; i++) {
        chrome.tabs.create({ url: myLinks[i] });
    }
})

 
function myFunction() {
    if(linksFromLocalStorage){
        let countofurl = linksFromLocalStorage.length
        chrome.browserAction.setBadgeText({ text: (countofurl).toString()});
    }
    else
        chrome.browserAction.setBadgeText({ text: '0'});
}

userName.addEventListener('input', (e) => {
    const val = e.target.value
    const linkss = document.querySelectorAll(".linkss")
    const linkname = document.getElementsByTagName("a")

    for(i = 0; i < linkname.length; i++){
        let match = linkss[i].getElementsByTagName('a')[0]

        if(match){
            let textvalue = match.textContent || match.innerHTML

            if(new RegExp(val, "i").test(textvalue)){
                linkss[i].style.display = ""
            }
            else{
                linkss[i].style.display = "none"
            }
        }
    }
})
setInterval(myFunction, 500);