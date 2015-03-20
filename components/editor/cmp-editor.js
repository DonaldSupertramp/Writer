var element = (function(){

    var self = this;

    var component;

    var EditorService;

    return{

       ready: function(){

           var self = this;
           component = this;

           this.options = ['verbs','adjectives','adverbs','nouns','prepositions','conjunctions'];

           System.import('components/editor/EditorService.js')
           .then(function(M){
                    EditorService = M.service;
                    EditorService.setEditorInstance(self.$.editor);
               });


           self.$.editor.addEventListener('keydown',function(e){
               EditorService.toggleHightlightmode(e);
               self.wordcount = EditorService.getWordcount();
               self.readingtime = EditorService.getReadingtime();
           });

       },

        highlight: function(e){
            console.dir(e.target.templateInstance);
            var target = e.target;

        }
    }

})();

Polymer('cmp-editor',element);
