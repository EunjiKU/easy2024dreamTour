var quick = quick || (function() {
  var headings = document.querySelectorAll('.heading');

  setTargetID();
  draw();

  function setTargetID() {
      var sections = document.querySelectorAll('.section');

      _.forEach(sections, function(section, i) {
          section.setAttribute('id', 'target' + i);
      });
  }

  function draw() {
      var root = document.createElement('div'),
          list = document.createElement('div');

      root.classList.add('quick');
      list.classList.add('quick__list');

      _.forEach(headings, function(heading, i) {
          var item = document.createElement('div'),
              link = document.createElement('a');

          item.classList.add('quick__item');
          link.classList.add('quick__link');
          link.setAttribute('href', '#target' + i);
          link.textContent = heading.textContent;

          item.appendChild(link);
          list.appendChild(item);
      });

      root.appendChild(list);

      $('.menulist').prepend(root);
  }
})();

var router = router || (function() {
  var links = document.querySelectorAll('a.tr');

  _.forEach(links, function(link) {
      var path = link.getAttribute('href');

      link.setAttribute('title', '화면ID: ' + path);
  });
})();

$(document).on('ready', function() {
  $(window).on('scroll', function() {
      if ( $(document).scrollTop() < 100 ) {
          $('.function').removeClass('-active');
      } else {
          $('.function').addClass('-active');
      }
  });

  $('.function').on('click', '.function__top', function() {
      $('html, body').animate({
          scrollTop: 0
      });
  });

  $('.table a').attr('target','_blank');

  var latestTop;

  $('.table a').on('click', function(e) {
      latestTop = $(e.currentTarget).offset().top;

      $(e.currentTarget).addClass('-latest').siblings().removeClass('-latest');

      $('.function__latest').addClass('-active');
  });

  $('.function').on('click', '.function__latest', function() {
      $('html, body').animate({
          scrollTop: latestTop - 200
      });
  });
  $('.table a').each(function(i, el) {
      var path = $(el).attr('href');
      var filename = path.substring(path.lastIndexOf('/') + 1, path.length);
      var screenID = filename.split('.')[0];

      if (screenID !== 'Null') {
          var SID = $('<span class="o__id">' + screenID + '</span>')
          $(el).children('div:nth-last-child(4)').prepend(SID);
      }

      $(this).find('div').eq(8).mouseover(function(e) { //iframe 미리보기
          e.preventDefault();
          
          $('.myframe').attr('src', path).show();
      }).mouseout(function(e) {
          e.preventDefault();

          $('.myframe').hide();
      });

  });

  $('.filter').on('click', function (e) {
      $(e.currentTarget).toggleClass('-active').siblings().removeClass('-active');
  });

  $('.wa').on('click', function() {
      $('.table').toggleClass('-filter-wa').removeClass('-filter-dmo');
  });

  $('.dmo').on('click', function() {
      $('.table').toggleClass('-filter-dmo').removeClass('-filter-wa');
  });        
  
  //var first = $('.-wa').length;
  //var second = $('.-dmo').length;
  var Before = $('i[progress=""]').length;
  var Ing = $('i[progress="작업중"]').length;
  var Confirm = $('i[progress="수정중"]').length;
  var Complete = $('i[progress="완료"]').length;
  var All = Before + Ing + Confirm + Complete;
  var Progress = Complete / All * 100;
  var Floor = Math.floor(Progress);


  //console.log(first, second);

  $('.total_all').text(All);
  $('.total_before').text(Before);
  $('.total_ing').text(Ing);
  $('.total_confirm').text(Confirm);
  $('.total_ok').text(Complete);
  $('.total_progress').text(Floor + '%');

  $('.contents .section').each(function() {
      var second = $('table>.-wa').length;
      var Str = $(this).find('.heading > div').attr('class');
      var Device = '.' + Str.substr(Str.length-3, 3);
      var TotalBox = $('.heading .totalBox').filter(Device);
      var Table = TotalBox.parent('.heading').siblings('.table');
      var Before = Table.find('i[progress=""]').length;
      var Ing = Table.find('i[progress="작업중"]').length;
      var Confirm = Table.find('i[progress="수정중"]').length;
      var Complete = Table.find('i[progress="완료"]').length;
      var All = Before + Ing + Confirm + Complete;
      var Progress = Complete / All * 100;
      var Floor = Math.floor(Progress);

      TotalBox.find('.total_all').text(All);
      TotalBox.find('.total_before').text(Before);
      TotalBox.find('.total_ing').text(Ing);
      TotalBox.find('.total_confirm').text(Confirm);
      TotalBox.find('.total_ok').text(Complete);
      TotalBox.find('.total_progress').text(Floor + '%');
  });
  
});
