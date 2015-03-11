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


           self.$.editor.addEventListener('keyup',function(e){

               //if(e.keyCode == 13) e.preventDefault();

               EditorService.handleKeyUp(e);

           });
       }
    }

})();

Polymer('cmp-editor',element);
