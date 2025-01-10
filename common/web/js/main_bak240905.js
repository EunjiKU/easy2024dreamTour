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

      /* -- 주요 추천 도시 -- */
      var index; // 초기 페이지네이션 세팅 필요
      var isFirst = false; // 초기 진행되고 있는 와중에 swiper-slide-active로 이동되게 하기 위한 변수
      var isMove = false; // 광클 방지 변수
      var flowSlideLength = $(".flow-swiper .slide").length // 슬라이드 갯수

      if(flowSlideLength > 6){
        $(".flow-control .slide-number .total").text(flowSlideLength)

        var flowSwiper = new Swiper(".flow-swiper-div", {
          pagination: {
            el: ".flow-swiper-wrap .swiper-pagination",
            type: "progressbar",
          },
          autoplay: {
            delay: 0,
          },
          // allowTouchMove:false,
          speed:2000,
          loop:true,
          slidesPerView: "auto",
          observer:true,
          observeParents:true,
          on:{
            slideChangeTransitionEnd:function(){
              index = Number($(".flow-swiper .swiper-slide-active").attr("data-swiper-slide-index")) + 1
              $(".flow-control .slide-number .current").text(index);
  
            },
            touchEnd: function(){
              // 마우스 드래그를 끝냈을 때 실행
              this.isUserInteracting = true;
            },
            transitionEnd: function(){
              // 슬라이드 이동이 끝났을 때 실행
              if (this.isUserInteracting) {
                flowSwiper.autoplay.start();
                this.isUserInteracting = false; // 상태 초기화
              }
            }
          },
        });
        
        // 슬라이드 재생, 일시정지
        $(".flow-control .btn").on("click", function(){
          if($(this).hasClass("pause")){
            $(this).removeClass("pause").addClass("play");
            flowSwiper.autoplay.stop();
          }else if($(this).hasClass("play")){
            $(this).removeClass("play").addClass("pause");
            setTimeout(function(){
              flowSwiper.autoplay.start();
            }, 100)
          }
        })
  
        // 슬라이드 좌,우 버튼
        $(".flow-arrow > a").each(function(){
          $(this).on("click", function(){
            $(".flow-control .slide-number .current").text(Number($(".flow-swiper .swiper-slide-active").attr("data-swiper-slide-index")) + 1)
            flowSwiper.autoplay.stop();
            handleUserClick()
  
            if($(this).hasClass("left")){ // 왼쪽 이동
              if(!isFirst){
                isFirst = true;
                flowSwiper.setTranslate(flowSwiper.getTranslate());
                flowSwiper.autoplay.stop();
                setTimeout(function(){
                  flowSwiper.slideTo($(".flow-swiper .swiper-slide-active").index() -1, 300)
                }, 0.1)
              }
  
              if(!isMove && isFirst){
                isMove = true;
                setTimeout(function(){
                  flowSwiper.slidePrev(300)
                }, 0.1)
  
                setTimeout(function(){
                  isMove = false;
                }, 301)
              }
            }else if($(this).hasClass("right")){ // 오른쪽 이동
              if(!isFirst){
                isFirst = true;
                flowSwiper.setTranslate(flowSwiper.getTranslate());
                flowSwiper.autoplay.stop();
                setTimeout(function(){
                  flowSwiper.slideTo($(".flow-swiper .swiper-slide-active").index(), 300)
                }, 0.1)
              }
  
              if(!isMove && isFirst){
                isMove = true;
                setTimeout(function(){
                  flowSwiper.slideNext(300)
                }, 0.1)
  
                setTimeout(function(){
                  isMove = false;
                }, 301)
              }
            }
          });
        });
  
        let clickTimeout;
  
        // 지정한 시간 동안 클릭 안했을 경우 체크
        function handleUserClick() {
          // 이전 타이머를 초기화
          clearTimeout(clickTimeout);
  
          // 새로 타이머 설정
          clickTimeout = setTimeout(() => {
            swiper.params.speed = 2000;
            swiper.autoplay.start(0);
            isFirst = false;
          }, 1100);
        }
      }
      /* // -- 주요 추천 도시 -- */
    },
  };
})();

$(window).on("load", function () {
  mainScript.commonFn();
  mainScript.scrollFn();
  mainScript.resizeFn();
  mainScript.swiperFn();
});
