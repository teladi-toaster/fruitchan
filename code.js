// ==UserScript==
// @name         fruitchan
// @namespace    http://github.com/teladi-toaster
// @version      2023-12-15
// @description  assigns randomly chosen (but deterministic) emoji to replies, to make it easier to remember comment IDs apart
// @author       (You)
// @source       https://github.com/teladi-toaster/fruitchan.git
// @match        https://boards.4channel.org/*
// @match        https://boards.4chan.org/*
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/fruits-vegetables/fruit-icon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const AMENDED_ATTR = "fruitchanAmended";
    const SYMBOLS = [ "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🫑", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍨", "🍧", "🍦", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧋", "🧃", "🧉", "🧊", "🥢", "🍽", "🍴", "🥄", "🔪", "🧋", "🏺", ];
    function fnv1a(data) {
        const prime = 16777619;
        let hash = 2166136261;
        for(let i=0; i<data.length; i++) {
            hash *= prime;
            hash ^= data[i];
        }
        return hash;
    }
    function fixupNumber(numElem) {
        const reNumStr = /([0-9]+)/;
        let m = numElem.textContent.match(reNumStr)
        if (m == null) { return; };
        let num = m[1];
        let hash = fnv1a(num);
        let symbol = SYMBOLS[Math.abs(hash % SYMBOLS.length)];
        numElem.textContent = numElem.textContent.replace(reNumStr, (m) => {
            return `${m} ${symbol}`;
        });
        numElem.setAttribute(AMENDED_ATTR, AMENDED_ATTR);
    }
    function fixupLink(linkElem) {
        const reNumStr = /(?<=>>)([0-9]+)/;
        let m = linkElem.textContent.match(reNumStr)
        if (m == null) { return; };
        let num = m[1];
        let hash = fnv1a(num);
        let symbol = SYMBOLS[Math.abs(hash % SYMBOLS.length)];
        linkElem.textContent = linkElem.textContent.replace(reNumStr, (m) => {
            return `${m} ${symbol}`;
        });
        linkElem.setAttribute(AMENDED_ATTR, AMENDED_ATTR);
    }
    function fixupLinks() {
        var numbers = document.querySelectorAll(`.postNum.desktop a:nth-child(2):not([${AMENDED_ATTR}])`);
        numbers.forEach(fixupNumber);
        var links = document.querySelectorAll(`.quotelink:not([${AMENDED_ATTR}])`);
        links.forEach(fixupLink);
    }
    function changeCallback(mutationList, observer) {
        fixupLinks();
    }
    const thread = document.querySelector(".thread");
    const board = document.querySelector(".board");
    const body = document.querySelector("body");
    const obsConfig = { childList: true };
    const observer = new MutationObserver(changeCallback);
    observer.observe(thread, obsConfig);
    observer.observe(board, obsConfig); // browsing All
    observer.observe(body, obsConfig); // hover preview
    fixupLinks();
})();
