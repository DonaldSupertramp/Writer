var service = (function(){

    var editorInstance;

    var wordcount;

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

            loadJSON(target + '.json',
                function(data) {

                    data = target == 'nouns' ? data[0]: data;

                    var keys = Object.keys(data);

                    words.forEach(function(word){

                        word = word.trim();

                        // Todo: Replace with RegEx
                        if(word.substr(-1) == ',' || word.substr(-1) == '.' || word.substr(-1) == ';' || word.substr(-1) == ':') word = word.substring(0,word.length-1);

                        if(target == 'nouns'){

                            if(!data.hasOwnProperty(word[0].toUpperCase())) return;

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

                checkMatches('nouns');

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

    // Todo: It seems to be inefficient to split the text into words and calculate the length each time we want to get either readingTime or wordCount

    function getReadingtime(){

        // About 3.34 words per second is the average reading rate
        var r = ((editorInstance.innerText.split(' ').length / 3.34) / 60).toPrecision(2);

        return r > 1 ? r : 1;
    }

    function getWordcount(){
        return editorInstance.innerText.split(' ').length;
    }

    return{
        toggleHightlightmode: toggleHighlightmode,
        setEditorInstance: setEditorInstance,
        getWordcount: getWordcount,
        getReadingtime: getReadingtime
    };


})();

export {service}
