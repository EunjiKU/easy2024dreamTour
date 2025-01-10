var preview = preview || (function() {
  var soureces = document.querySelectorAll('[type="text/html"]');

  _.forEach(soureces, function(source) {
      var esc = _.escape(_.trim(source.textContent)),
          preview = $('<div class="o__preview"></div>'),
          demo = $('<div class="o__demo">' + source.textContent + '</div>'),
          code = $('<pre class="o__code"><div class="o__code-title">CODE</div><code class="html">' + esc + '</code><button type="button" class="o__copy">COPY</button></pre>')
      
      preview.append(demo);
      preview.append(code);

      hljs.highlightBlock(code[0]);
      
      $(preview).insertAfter(source);
      $(source).remove();
  });

  copy();

  function copy() {
      var clipboard = new ClipboardJS('.o__copy');
      var codes = document.querySelectorAll('.o__code code');
      var buttons = document.querySelectorAll('.o__copy');

      _.forEach(codes, function(code, i) {
          code.setAttribute('id', 'code' + i);
      });

      _.forEach(buttons, function(button, i) {
          button.setAttribute('data-clipboard-target', '#code' + i);
      });

      clipboard.on('success', function(e) {
          e.trigger.textContent = 'Copied!';

          setTimeout(function() {
              e.trigger.textContent = 'Copy';
          },2000);
      
          e.clearSelection();
      });
  }
})();
