(function(){

  var articles = [
    {html: "article_1", id: "article_1", url: "/article_1", title: "title 1"},
    {html: "article_2", id: "article_2", url: "/article_2", title: "title 2"},
    {html: "article_3", id: "article_3", url: "/article_3", title: "title 3"},
    {html: "article_4", id: "article_4", url: "/article_4", title: "title 4"},
    {html: "article_5", id: "article_5", url: "/article_5", title: "title 5"}
  ];

  var offset_from_bottom = 50;

  var old_article;

  var scroll_position = function(){
    return $('.content-scroll').scrollTop() + $('.content-scroll').height();
  };

  var page_length = function(){
    return $('.content').height() - offset_from_bottom;
  };

  var scrolled_down_past_all_articles = function(){
    return (scroll_position() > page_length()); 
  };

  var is_scrolling_down = function(){
    var last_position = 0;
    return function(new_position){
      var result = last_position < new_position;
      last_position = new_position;
      return result;
    }
  }();

  article_at_scroll_position = function(){
    var container = $('.content-scroll');
    var scroll_position = $('.content-scroll').scrollTop();
    return(
      $('article.scroll_check').filter(function(){
        var article = $(this);
        var top_of_article = measure_scrollto(article, container);
        var bottom_of_article = top_of_article + article.height();
        
        return(
          scroll_position > top_of_article && 
          scroll_position < bottom_of_article
        );
      })
    );
  };

  var render = function(article){
    $('.content').append('<article class="scroll_check" id="' + article.id + '" data-title="' + article.title + '" data-url="' + article.url + '"><h1>' + article.html + '</h1></article>');
  };

  var set_history = function(article){
    var data = article.id;
    var title = article.title;
    var url = article.url;
    window.history.pushState(data, title, url);
  };

  var set_title = function(title){
    document.title = title;
  };

  var add_new_article = function(){
    var new_article = articles.pop();
    if(new_article){
      render(new_article);
      set_history(new_article);
      set_title(new_article.title);
    }else{
      console.log('no more articles');
    }
  };

  var measure_scrollto = function(scrollto, container){
    return scrollto.offset().top - container.offset().top + container.scrollTop(); 
  };

  var scroll_to = function(selector){
    var scrollto = $(selector);
    var container = $('.content-scroll');
    var top = measure_scrollto(scrollto, container);

    container.animate({
      scrollTop: top
    }, 1000);
  };

  var check_for_scroll_change = function(){
    var new_article = article_at_scroll_position();
    if(old_article && old_article[0] && new_article[0] && old_article[0] !== new_article[0]){
      set_title(new_article.data('title'));
      set_history({ id: new_article.attr('id'), title: new_article.data('title'), url: new_article.data('url')});
    }
    old_article = new_article;
  };

  var history_state_change = function(jqevent){
    var article_id = window.history.state;
    var selector = '#' + article_id;
    scroll_to(selector);
    var article = $(selector);
    set_title(article.data('title'));
  };

  var handle_scroll = function(){
    check_for_scroll_change();
    if(scrolled_down_past_all_articles()){
      add_new_article();
    }
  };

  var set_prerendered_article = function(){
    var title = document.title.toString();
    var url = window.location.toString();
    var prerendered = $('article.prerendered');
    prerendered.data('title', title);
    prerendered.data('url', url);
    set_history({id: prerendered.attr('id'), title: title, url: url});
  };

  var init = function(){
    $('.content-scroll').on('scroll', handle_scroll);
    set_prerendered_article();
    $(window).on('popstate', history_state_change);
  };

  $(init);

})();
