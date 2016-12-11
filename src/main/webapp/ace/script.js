
  function initAce(editor) {
  session=editor.getSession(),
  //      fconsole=$(".faux-console");

    editor.setTheme("ace/theme/tomorrow_night");
    session.setMode("ace/mode/drlfile");

    ace.config.loadModule("ace/ext/language_tools", function() {
          editor.setOptions({
              enableSnippets: true,
              enableBasicAutocompletion: true
          });
  })
  editor.on('mousemove', function(e) {
      var position = e.getDocumentPosition(),
          token = editor.session.getTokenAt(position.row, position.column);
  //    if(token && token.type){
  //      fconsole.text(token.value + " = " + token.type);
  //    }
    });

    $(".dropdown-menu li a").click(function(){
      var theme=$(this).attr("data-value");
      editor.setTheme(theme);
    });

    $(".navbar-form input.find").on("keypress",function(e){
      //session.clearSelection();
      var searchtext=$(this).val() + String.fromCharCode(e.which),
          x=editor.findAll(searchtext,{
             backwards: false,
             wrap: false,
             caseSensitive: false,
             wholeWord: false,
             regExp: false
            });
    });
  }

