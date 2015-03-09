var element = (function(){

    var self = this;

    var component;

    return{

       ready: function(){

           var self = this;
           component = this;

           self.$.textarea.addEventListener('keydown',function(e){

                if(e.keyCode == 13){

                    self.content.push({
                        focused: false,
                        content: self.$.current.value
                    });
                }

           });

           self.$.current.focus();

           self.content = [];

       }
    }

})();

Polymer('cmp-editor',element);
