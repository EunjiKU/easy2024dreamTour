const microScript = (function () {
  return {
    commonFn: function () {
      scrollMotionTrigger();

      // [ 헤더 ]
      $(".micro header .all-menu nav a").on("click", function() {
        gsap.to("html, body", .6, {scrollTop: $(".micro .sec").eq($(this).index()).offset().top})
        // gsap.to(window, {duration: 1, scrollTo: $(".micro .sec").eq($(this).index()).offset().top});

        if($(window).innerWidth() < 1023) {
          $(".micro header .all-menu").fadeOut(300);
          $("body").removeClass("stop-scroll");
        }
      });
      
      $(".micro header .ham-btn").on("click", function() {
        $(".micro header .all-menu").fadeIn(300).addClass("on");
        $("body").addClass("stop-scroll");
      });
      $(".micro header .close-btn").on("click", function() {
        $(".micro header .all-menu").fadeOut(300, function() {
          $(".micro header .all-menu").removeAttr("style");
        }).removeClass("on");
        $("body").removeClass("stop-scroll");
      });

      $(window).resize(function () {
        if($(window).innerWidth() >= 1024) {
          if($("body").hasClass("stop-scroll")) {
            $("body").removeClass("stop-scroll");
          }
        } else {
          if($(".micro header .all-menu").hasClass("on")) {
            $("body").addClass("stop-scroll");
          }
        }
      }).resize();


      // [ 비주일 섹션 ]
      // 타임라인
      setTimeout(() => {
        $(".visual-sec .spinner-wrap").addClass("on");

        const tl = gsap.timeline();
        tl.to(".visual-sec .slogans .slogan.en", 1, {className: "slogan en on"})
          .to(".visual-sec .slogans .slogan.en", 0.6, {className: "slogan en on remove"})
          .to(".visual-sec .slogans .slogan.kr", 1, {className: "slogan kr on"})
      }, 400)

      // bg move
      gsap.to($(".visual-sec .bg-wrap"), {
        y: "-30dvh",
        scrollTrigger: {
          trigger: $(".visual-sec"),
          start:  () => "top top",
          end:  () => "bottom top",
          // markers: true,
          scrub: 1,
        },
      });


      // [ 소개 섹션 ]
      // pin
      $(".introduce-sec .bg-wrap .pin-in").each(function (q) {
        gsap.to($(this), {
          scrollTrigger: {
            trigger: $(this),
            start:  () => "top top",
            end:  () => "bottom bottom",
            endTrigger: ".introduce-sec",
            // markers: true,
            pin: true,
          },
        });
      });

      // 숫자 카운트
      function countFunc(countNum, speed) {
        countNum.each((idx, item) => {
          let startNum = 0;
          let lastNum = parseInt($(countNum).attr("data-num"));
          let count = { roll: startNum };

          gsap.to(count, {
            duration: speed,
            roll: $(countNum).attr("data-num"),
            onUpdate: function() {
              let currentNum = Math.floor(count.roll); // 소수점 제거
              $(item).find("span").text(currentNum); // 숫자 업데이트
            },
          });
        });
      }

      // 모션 이동
      $(".introduce-sec .introduce-list .item").each((idx, item) => {
        gsap.to($(item), {
          scrollTrigger: {
            trigger: $(item),
            start: "top 70%",
            end: "bottom 70%",
            onEnter: function() {
              $(".introduce-circle .item").eq(idx).siblings().removeClass("on");
              $(".introduce-circle .item").eq(idx).addClass("on");
              gsap.to($(".introduce-circle"), 1, {
                // y: $(item).position().top,
                // x: $(item).offset().left + $(item).innerWidth()
                y: function() {
                  // 상대적인 비율로 변환
                  return ($(item).find(".item-box").position().top / $(window).height()) * 100 + "dvh";
                },
                x: function() {
                  // 상대적인 비율로 변환
                  return (($(item).offset().left + $(item).innerWidth()) / $(window).width()) * 100 + "vw";
                }
              })
            },
            onEnterBack: function() {
              $(".introduce-circle .item").eq(idx).siblings().removeClass("on");
              $(".introduce-circle .item").eq(idx).addClass("on");
              gsap.to($(".introduce-circle"), 1, {
                // y: $(item).position().top,
                // x: $(item).offset().left + $(item).innerWidth()
                y: function() {
                  // 상대적인 비율로 변환
                  return ($(item).find(".item-box").position().top / $(window).height()) * 100 + "dvh";
                },
                x: function() {
                  // 상대적인 비율로 변환
                  return (($(item).offset().left + $(item).innerWidth()) / $(window).width()) * 100 + "vw";
                }
              })
            },
            // markers: true,
          }
        });
        gsap.to($(item), {
          scrollTrigger: {
            trigger: $(item),
            start: "top 70%",
            end: "bottom 70%",
            once: true,
            onEnter: function() {
              countFunc($(item).find(".num"), 1); // 속도 2초
            },
            // markers: true,
          }
        });
      });


      // [ 비즈니스 섹션 ]
      $(".business-sec .business-list .item:not(:last-child)").each(function (q) {
        gsap.to($(this).find(".motion-div"), {
          scale: 0.55,
          y: "-80rem",
          borderRadius: "80rem 80rem 0 0",
          scrollTrigger: {
            trigger: $(".business-sec .business-list"),
            start: `top+=${$(this).innerHeight() * q} top`,
            end: "bottom top",
            endTrigger: $(this),
            scrub: .8,
          },
        });
      });


      // [ 스와이퍼 섹션 ]
      // swiper
      const microSwiperBg = new Swiper(".bg-list", {
        direction: "vertical",
        speed: 400,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        allowTouchMove: false
      });
      
      const microSwiper = new Swiper(".circle-list", {
        effect: "fade",
        speed: 400,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: ".circle-list .swiper-button-next",
          prevEl: ".circle-list .swiper-button-prev",
        },
        pagination: {
          el: ".circle-list .swiper-pagination",
          clickable: true,
        },
        allowTouchMove: true, // 기본 설정
        breakpoints: {
          1024: {
            allowTouchMove: false, // 1024px 이상일 때 터치 스와이프 비활성화
          },
        },
        on: {
          slideChange: function() {
            microSwiperBg.slideTo(this.activeIndex);
          }
        }
      });
    },
  };
})();

$(window).on("load", function () {
  microScript.commonFn();
});

// 스크롤모션
function scrollMotionTrigger() {
  if ($(".scroll-motion").size() > 0) {
    $(".scroll-motion:visible").each(function (q) {
      gsap.to($(this), {
        scrollTrigger: {
          trigger: $(this),
          start: () => "top 70%",
          end: "bottom top",
          toggleClass: {
            targets: $(".scroll-motion:visible").eq(q),
            className: "active",
          },
          once: true,
          // markers: true,
        },
      });
    });
  }
}