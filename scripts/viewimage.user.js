// ==UserScript==
// @name            View Image
// @namespace       https://github.com/bijij/ViewImage
// @version         2.1.1
// @description     This userscript re-implements the "View Image" and "Search by image" buttons into google images.
// @author          Bae Junehyeon
// @run-at          document-end
// @include         http*://*.google.tld/search*tbm=isch*
// @include         http*://*.google.tld/imgres*
// @note            Based on Userscript Version 2.0.1 (https://gist.github.com/bijij/58cc8cfc859331e4cf80210528a7b255/b2def8f34acc55906402bfed6922b20fa7c45607) & synced with Chrome Extension (https://github.com/bijij/ViewImage/blob/5c6269a9f56f22fdc4ce3c93449fb4d163923927/js/content-script.js)
// ==/UserScript==
'use strict';

function addLinks(node) {

    var object = node.closest('.irc_c[style*="visibility: visible;"][style*="transform: translate3d(0px, 0px, 0px);"]');

    if (!object)
        object = node.closest('.irc_c[style*="transform: translate3d(0px, 0px, 0px);"]');


    // Stop if object not found
    if (object === null) {
        return;
    }

    // Remove previously generated elements
    var oldExtensionElements = object.querySelectorAll('.ext_addon');
    for (var i = oldExtensionElements.length - 1; i >= 0; i--) {
        var element = oldExtensionElements[i];
        element.parentElement.removeChild(element);
    }

    var redesign = false;

    // Retrive image links, and image url

    // imageLinks is the "Visit", "View Image", and "Save" links with the buttons
    var imageLinks = object.querySelector('._FKw.irc_but_r > tbody > tr');
    if (!imageLinks)
        imageLinks = object.querySelector('.irc_but_r > tbody > tr');

    // Google Images redesign
    if (!imageLinks) {
        imageLinks = object.querySelector('.Qc8zh > .irc_ab');
        if (imageLinks)
            redesign = true;
    }


    // imageText is the text below the header, with the 'website', 'WxH', and 'Search By Image' links
    var imageText = object.querySelector('._cjj > .irc_it > .irc_hd > ._r3');
    if (!imageText)
        imageText = object.querySelector('.Qc8zh > .irc_it > .irc_hd > .rn92ee');
    if (!imageText)
        imageText = object.querySelector('.Qc8zh > .irc_it > .irc_hd > .irc_dsh');


    // globeIcon is the span containing the globe svg in the "Visit" button
    var globeIcon = document.querySelector('._RKw._wtf._Ptf');
    if (!globeIcon)
        globeIcon = document.querySelector('.RL3J9c.z1asCe.GYDk8c');
    if (!globeIcon && redesign)
        globeIcon = imageLinks.querySelector('a:nth-of-type(1) > div > span:nth-of-type(1)');


    // viewImageText is the text span node for the "Visit" button
    var viewImageText = document.querySelector('._WKw');
    if (!viewImageText)
        viewImageText = document.querySelector('.Tl8XHc');
    if (!viewImageText && redesign)
        viewImageText = imageLinks.querySelector('a:nth-of-type(1) > div > span:nth-of-type(2)');


    // Retrive the image;
    var image = object.querySelector('img[alt^="Image result"][src]:not([src^="https://encrypted-tbn"]).irc_mut, img[src].irc_mi');

    // Override url for images using base64 embeds
    if (image === null || image.src === '' || image.src.startsWith('data')) {
        var thumbnail = document.querySelector('img[name="' + object.dataset.itemId + '"]');
        if (thumbnail === null) {
            // If no thumbnail found, try getting image from URL
            var url = new URL(window.location);
            var imgLink = url.searchParams.get('imgurl');
            if (imgLink) {
                image = new Object();
                image.src = imgLink;
            }
        } else {
            var meta = thumbnail.closest('.rg_bx').querySelector('.rg_meta');

            var metadata = JSON.parse(meta.innerHTML);

            image = new Object();
            image.src = metadata.ou;
        }
    }

    // If the above doesn't work, use the link in related images to find it
    if (image === null || image.src === '' || image.src.startsWith('data')) {
        var target_image = object.querySelector('img.target_image');
        if (target_image) {
            var link = target_image.closest('a');
            if (link) {
                // Some extensions replace google image links with their original links
                if (link.href.match(/^[a-z]+:\/\/(?:www\.)?google\.[^/]*\/imgres\?/)) {
                    var link_url = new URL(link.href);
                    var new_imgLink = link_url.searchParams.get('imgurl');
                    if (new_imgLink) {
                        image = new Object();
                        image.src = new_imgLink;
                    }
                } else {
                    image = new Object();
                    image.src = link.href;
                }
            }
        }
    }

    // Supress error in console
    if (image === null)
        return;

    // Create more sizes button
    var moreSizes = document.createElement('a');
    moreSizes.setAttribute('href', '#'); // TODO: Figure out how to generate a more sizes url
    moreSizes.setAttribute('class', 'ext_addon o5rIVb _ZR irc_hol irc_lth _r3');
    moreSizes.setAttribute('style', 'pointer-events:none'); // Disable click for now

    // Insert text into more sizes button
    var moreSizesText = document.createElement('span');
    image.sizeText = moreSizesText;
    moreSizesText.innerHTML = object.querySelector('.irc_idim').innerHTML;
    moreSizes.appendChild(moreSizesText);

    // Create Search by image button
    var searchByImage = document.createElement('a');
    searchByImage.setAttribute('href', '/searchbyimage?image_url=' + image.src);
    searchByImage.setAttribute('target', '_blank'); // COMMENT THIS TO NOT OPEN IN NEW TAB
    searchByImage.setAttribute('class', 'ext_addon o5rIVb _ZR irc_hol irc_lth _r3');

    // Insert text into Search by image button
    var searchByImageText = document.createElement('span');
    searchByImageText.innerHTML =  '<span>以图搜图</span>';

    searchByImage.appendChild(searchByImageText);

    // Append More sizes & Search by image buttons
    if (imageText) {
        imageText.appendChild(moreSizes);
        imageText.appendChild(searchByImage);
    }

    // Create View image button
    var viewImageTextClone = viewImageText.cloneNode(true);
    var viewImage, viewImageLink, globeParent;

    var old_btn = document.getElementById('viewimage-btn');
    if (old_btn)
        old_btn.parentNode.removeChild(old_btn);

    if (!redesign) {
        viewImage = document.createElement('td');
        viewImage.setAttribute('class', 'ext_addon');

        viewImageLink = document.createElement('a');
        viewImage.appendChild(viewImageLink);

        viewImageLink.appendChild(viewImageTextClone);
        globeParent = viewImageLink;
    } else {
        viewImage = document.createElement('a');
        viewImage.classList.add('o5rIVb');
        viewImageLink = viewImage;

        var viewImageDiv = document.createElement('div');
        viewImageDiv.classList.add('NDcgDe');
        viewImageDiv.classList.add('EWkRMe'); // padding-right: 10px
        viewImage.appendChild(viewImageDiv);

        viewImageDiv.appendChild(viewImageTextClone);
        globeParent = viewImageDiv;
    }

    viewImage.id = 'viewimage-btn';

    // Add globe to View image button
    // Soft-fail if globeIcon is not found
    if (globeIcon) {
        globeParent.insertBefore(globeIcon.cloneNode(true), globeParent.firstChild);
    }

    // Set the text for the View Image button
    viewImageTextClone.innerText = "查看原图";

    // Add View image button URL
    viewImageLink.setAttribute('href', image.src);
    viewImageLink.setAttribute('target', '_blank');
    viewImage.appendChild(viewImageLink);

    // Add View image button to Image Links
    var save = imageLinks.childNodes[1];
    imageLinks.insertBefore(viewImage, save);
}


// Define the mutation observer
var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];

        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (var j = 0; j < mutation.addedNodes.length; j++) {
                var newNode = mutation.addedNodes[j];

                if (newNode.nodeType === Node.ELEMENT_NODE) {
                    if (newNode.classList.contains('irc_mi') | newNode.classList.contains('irc_mut') | newNode.classList.contains('irc_ris')) {
                        addLinks(newNode);
                    }
                }
            }
        }
    }
});

// Get options and start adding links
var objects = document.querySelectorAll('.irc_c');
for (var i = 0; i < objects.length; i++) {
    addLinks(objects[i]);
}

observer.observe(document.body, {
    childList: true,
    subtree: true
});


// inject CSS into document
var customStyle = document.createElement('style');
customStyle.innerText = '._r3:hover:before{display:inline-block;pointer-events:none} ._r3{margin: 0 4pt!important}';
document.head.appendChild(customStyle);
