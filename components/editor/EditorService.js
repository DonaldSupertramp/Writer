var service = (function(){

    var editorInstance;

    var editMode = false;

    function loadJSON(path, success, error)
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success)
                        success(JSON.parse(xhr.responseText));
                } else {
                    if (error)
                        error(xhr);
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
    }

    function setEditorInstance(instance){
        editorInstance = instance;
        editorInstance.addEventListener('click',function(){
            function getCaretCharacterOffsetWithin(element) {
                var caretOffset = 0;
                var doc = element.ownerDocument || element.document;
                var win = doc.defaultView || doc.parentWindow;
                var sel;
                if (typeof win.getSelection != "undefined") {
                    sel = win.getSelection();
                    if (sel.rangeCount > 0) {
                        var range = win.getSelection().getRangeAt(0);
                        var preCaretRange = range.cloneRange();
                        preCaretRange.selectNodeContents(element);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        caretOffset = preCaretRange.toString().length;
                    }
                } else if ( (sel = doc.selection) && sel.type != "Control") {
                    var textRange = sel.createRange();
                    var preCaretTextRange = doc.body.createTextRange();
                    preCaretTextRange.moveToElementText(element);
                    preCaretTextRange.setEndPoint("EndToEnd", textRange);
                    caretOffset = preCaretTextRange.text.length;
                }
                return caretOffset;
            }
        });
    }

    function resetHighlight(){
        var regEx1 = new RegExp('<span class="hl">','gi');
        var regEx2 = new RegExp('</span>','gi');

        editorInstance.innerHTML = editorInstance.innerHTML.replace(regEx1,'');
        editorInstance.innerHTML = editorInstance.innerHTML.replace(regEx2,'');
    }

    function toggleHighlightmode(e){

        if(!e.altKey) return;

        var words = editorInstance.innerText.split(' ');

        resetHighlight();

        function checkMatches(target){

            var matches = [];
console.log(target);
            loadJSON(target + '.json',
                function(data) {

                    var keys = Object.keys(data);

                    words.forEach(function(word){

                        word = word.trim();

                        if(word.substr(-1) == ',' || word.substr(-1) == '.' || word.substr(-1) == ';' || word.substr(-1) == ':') word = word.substring(0,word.length-1);

                        if(target == 'nounsnew'){

                            data = data[0];

                            console.dir(data['X']);
                            console.dir(data['G']);
                            debugger;

                            data[word[0].toUpperCase()].some(function(key){

                                var found;

                                if(word == key){
                                    found = true;
                                    if(matches.indexOf(word) == -1) matches.push(word);
                                }

                                return found;
                            });

                        }

                        else if(target == 'verbs'){
                            keys.some(function(key){

                                var found;

                                for(var prop in data[key]) {
                                    if(data[key][prop] == word){
                                        found = true;
                                        if(matches.indexOf(word) == -1) matches.push(word);
                                    }
                                }
                                return found;

                            });
                        }
                        else{

                            keys.some(function(key){

                                var found;

                                if(data[key] == word){
                                    found = true;
                                    if(matches.indexOf(word) == -1) matches.push(word);
                                }

                                return found;

                            });
                        }


                    });

                    matches.forEach(function(it){

                        var regEx = new RegExp('\\b' +it+'\\b','gi');

                        editorInstance.innerHTML = editorInstance.innerHTML.replace(regEx,'<span class="hl">'+it+'</span>');
                    });

                }
            );
        }

        switch(e.keyCode){

            case 86:

                checkMatches('verbs');

                break;

            case 78:

                checkMatches('nounsnew');

                break;

            case 65:

                checkMatches('adverbs');

                break;


            case 80:

                checkMatches('prepositions');

                break;


            case 74:

                checkMatches('adjectives');

                break;


            case 75:

                checkMatches('conjunctions');

                break;

        }

    }

    return{
        toggleHightlightmode: toggleHighlightmode,
        setEditorInstance: setEditorInstance
    }


})();

export {service}

//Namespace management idea from http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
(function( cursorManager ) {

    //From: http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
    var voidNodeTags = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];

    //From: http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    //Basic idea from: http://stackoverflow.com/questions/19790442/test-if-an-element-can-contain-text
    function canContainText(node) {
        if(node.nodeType == 1) { //is an element node
            return false;
        } else { //is not an element node
            return false;
        }
    };

    function getLastChildElement(el){
        var lc = el.lastChild;
        while(lc && lc.nodeType != 1) {
            if(lc.previousSibling)
                lc = lc.previousSibling;
            else
                break;
        }
        return lc;
    }

    //Based on Nico Burns's answer
    cursorManager.setEndOfContenteditable = function(contentEditableElement)
    {

        while(getLastChildElement(contentEditableElement) &&
        canContainText(getLastChildElement(contentEditableElement))) {
            contentEditableElement = getLastChildElement(contentEditableElement);
        }

        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        {
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

}( window.cursorManager = window.cursorManager || {}));