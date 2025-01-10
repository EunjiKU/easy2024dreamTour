var _aa;

const mainScript = (function () {
  return {
    commonFn: function () {},
    scrollFn: function () {
      $(window).on("scroll", function () {});
    },
    resizeFn: function () {
      $(window)
        .resize(function () {})
        .resize();
    },
    swiperFn: function () {

      // 특별 프로모션
      promotionSwiperFn()

      // 최근 확인한 호텔
      borderCardSwiperFn()

      // 주요 추천 도시
      flowSwiperFn();
    },
  };
})();

$(window).on("load", function () {
  mainScript.commonFn();
  mainScript.scrollFn();
  mainScript.resizeFn();
  mainScript.swiperFn();
});

function promotionSwiperFn(){
  if($(".promotion-swiper .swiper-slide").length > 1 && $(".promotion-swiper").size() > 0){
    var borderCardSwiper = new Swiper(".promotion-swiper .swiper-container", {
      pagination: {
        el: ".promotion-swiper .swiper-pagination",
      },
      navigation: {
        nextEl: ".promotion-swiper .swiper-button-next",
        prevEl: ".promotion-swiper .swiper-button-prev",
      },
      slidesPerView: "auto",
      observer:true,
      observeParents:true,
    });
  }
}

function borderCardSwiperFn(){
  if($(".border-card-swiper .swiper-slide").length > 1 && $(".border-card-swiper").size() > 0){
    var borderCardSwiper = new Swiper(".border-card-swiper .swiper-container", {
      navigation: {
        nextEl: ".border-card-swiper .swiper-button-next",
        prevEl: ".border-card-swiper .swiper-button-prev",
      },
      slidesPerView: "auto",
      observer:true,
      observeParents:true,
    });
  }
}

function flowSwiperFn(){
  var flowSwiper = []
  if($(".flow-swiper-wrap").size() > 0){
    $(".flow-swiper-div").each(function(q){
      if($(this).find(".slide").length > 6){
        $(this).parents(".flow-swiper-wrap").addClass("flowSwiper" + q);

        flowSwiper[q] =  new Swiper($(this), {
          navigation: {
            nextEl: $(this).parents(".flow-swiper-wrap").find(".swiper-button-next"),
            prevEl: $(this).parents(".flow-swiper-wrap").find(".swiper-button-prev"),
          },
          slidesPerView: "auto",
          observer:true,
          observeParents:true,
        });
      }else{
        $(this).parents(".flow-swiper-wrap").find(".circle-btn").hide()
      }
    });
  }
}
