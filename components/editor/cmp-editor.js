var element = (function(){

    var self = this;

    var component;

    var EditorService;

    return{

       ready: function(){

           var self = this;
           component = this;

           System.import('components/editor/EditorService.js')
           .then(function(M){
                    EditorService = M.service;
                    EditorService.setEditorInstance(self.$.editor);
               });


           self.$.editor.addEventListener('keydown',function(e){
               EditorService.toggleHightlightmode(e);
           });

       }
    }

})();

Polymer('cmp-editor',element);
