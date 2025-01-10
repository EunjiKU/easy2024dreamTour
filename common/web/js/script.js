let _thisScroll = 0; // 스크롤 up & down 체크위한 변수
let _isScrollTop; // scrollTop 변수
var _dateIndex;
var _totalAdultNum = 0; // 검색바 총 성인 수
var _totalChildNum = 0; // 검색바 총 아동 수
var _clickNum; // 달력 좌우 버튼 클릭 횟수
var _roomNum = 1;
var bottomGap = 20  // 20 = footer와 quick 사이 여백
var fixBottomoGap = 100;
var _isFirstOpen = false;

let $Chkpop;  // [비교하기] 선택 팝업
let $ComparePop;  // [비교하기] 비교 팝업
let chkItemEl;  // [비교하기] 선택 팝업, 아이템
let compareItemEl;  // [비교하기] 비교 팝업, 아이템
let delteIdx; // [비교하기] 삭제 아이템의 인덱스번호
let deleteChkItem;  // [비교하기] 삭제 아이템

let $rangeSlider; // [Input, Range]
let $rangeAmountMore; // [Input, Range]
let $rangeAmountLess; // [Input, Range]
let rangeData;  // [Input, Range]

const commonScript = (function () {
  return {
    init:function(){
      if(window.location.href.indexOf("trthotel.easymedia.kr") > -1 || window.location.href.indexOf('127.0.0.1') > -1 || window.location.href.indexOf("http://eznet1.easymedia.kr") > -1 || (window.location.href.indexOf(":4434") > -1 && window.location.href.indexOf("htldev.therailntel.com") > -1)){
        if($("#header").html() == '')
        {
          $("#header").empty().load("/html/web/header.html", function() {
            gsap.delayedCall(0.2, function() {
              commonScript.headerFooterFn();
            });
          });
        }
        else{
          commonScript.headerFooterFn();
        }
        if($("footer").html() == ''){
          $("footer").empty().load("/html/web/footer.html");
        }
      }else if($("#header").html() != ''){
        commonScript.headerFooterFn();
      }

      // [팝업]
      if($(".layer-popup.main-pop").hasClass("on")) {
        openPopupMain($(".layer-popup.main-pop .pop-area"));
      }
      if($(".layer-popup:not(.main-pop, .chk-pop)").hasClass("on")) {
        openPopup($(".layer-popup.on"));
      }

    },
    headerFooterFn: function(){
      if($("#header").length > 0) {
        let gnbNum = -1;

        selectMotionFunc();
        
        // $("#header nav .gnb").off().on("mouseenter focusin", function() {
        //   $("#header").addClass("active");
        // });

        // $("#header nav .gnb").off("mouseleave").on("mouseleave", function() {
        //   $("#header nav .gnb > li").removeClass("on");
        //   gnbNum = -1;
        // });

        $("#header nav .gnb > li").off().on("mouseenter focusin", function() {
          if(gnbNum != $(this).index()) {
            // $(this).siblings().removeClass("on");
            // $(this).addClass("on");
            // $("#header nav .gnb > li").not(".on").find(".two-depth").stop(true, true).fadeOut(400);
            $(this).siblings().find(".two-depth").stop(true, true).fadeOut(400);
            $(this).find(".two-depth").stop(true, true).fadeIn(400);
          }
          gnbNum = $(this).index();
        });

        $("#header").off("mouseleave").on("mouseleave", function(){
          $(".two-depth").stop(true, true).fadeOut(400);
          // $("#header").removeClass("active");
          gnbNum = -1;
        });
      }
    },
    commonFn: function () {
      // 바탕화면 클릭시 닫히는 스크립트
      $('body').click(function(e){
        if($(e.target).parents().hasClass("trip-input-div") || $(e.target).parents().hasClass("trip-select-wrap") || $(e.target).parents().hasClass("trip-room") || $(e.target).parents().hasClass("trip-date") || $(e.target).parents().hasClass("stay-day")){
          
        }else{
          if($(".trip-recent-srch").hasClass("on")){ // 최근 검색어
            $(".trip-recent-srch").removeClass("on");
          }

          if($(".trip-date").hasClass("on")){ // 체크인, 체크아웃
            $(".trip-date").removeClass("on");
          }

          if($(".stay-day").hasClass("on")){ // 숙박일수
            $(".stay-day").removeClass("on");
            $(".stay-day").find(".day-list").stop(true, true).slideUp();
          }

          if($(".trip-room").hasClass("on")){ // 객실
            $(".trip-room").removeClass("on");
            $(".trip-sel-area .trip-room .room-info-sel").removeClass("on");

            // _totalAdultNum = 0;
            // _totalChildNum = 0;

            // $(".room-con-box").each(function(q){
            //   if($(this).data('yn') == "N"){
            //     $(this).not(":first-child").remove();
            //     $(this).find(".adult input").val(2);
            //     $(this).find(".adult input").attr("data-val", 2);
            //     $(this).find(".child input").val(0);
            //     $(this).find(".child input").attr("data-val", 0);
            //     $(this).find(".child-chk-div").removeClass("on");
            //     $(this).find(".child-chk").not(":first-child").remove();
            //   }
              
            //   if($(this).data('yn') == "Y"){
            //     $(this).find(".form-input").each(function(){
            //       $(this).find("input").val($(this).find("input").data('prev'))
            //       $(this).find("input").attr("value", $(this).find("input").data('prev'))
            //       $(this).find("input").attr("data-val", $(this).find("input").data('prev'));
                  
            //       if($(this).hasClass("child")){
            //         if($(this).find("input").val() == 0){
            //           $(this).parents(".form-child").siblings(".minus").addClass("disabled")
            //           $(this).parents(".room-con-box").find(".child-chk").not(":first-child").remove();
            //           $(this).parents(".room-con-box").find(".child-chk-div").removeClass("on");
            //         }else{
            //           $(this).siblings("button").removeClass("disabled");
            //           $(this).parents(".room-con-box").find(".child-chk-div").addClass("on");
            //           if($(this).parents(".room-con-box").find(".child-chk").length > $(this).find("input").val()){
            //             $(this).parents(".room-con-box").find(".child-chk").slice($(this).find("input").val()).remove()
            //           }else{
            //             for(var i = $(this).parents(".room-con-box").find(".child-chk").length; i < $(this).find("input").val(); i++){
            //               childInfoClone = $(this).closest(".room-con-box").find(".child-chk:last").clone(true);
            //               $(this).parents(".room-con-box").find(".child-chk-div").append(childInfoClone);
            //               $(this).closest(".room-con-box").find(".child-chk:last .tit .num").text($(this).closest(".room-con-box").find(".child-chk").length)
            //             }
            //           }
            //         }
            //       }else if($(this).hasClass("adult")){
            //         if($(this).find("input").val() != 1){
            //           $(this).siblings("button").removeClass("disabled");
            //         }
            //       }
                  
            //       if(parseInt($(this).parents(".room-con-div").find(".form-input").eq(0).find("input").val()) + parseInt($(this).parents(".room-con-div").find(".form-input").eq(1).find("input").val()) <= 8){
            //         $(this).parents(".room-con-div").find(".plus").removeClass("disabled")
            //       }else{
            //         $(this).parents(".room-con-div").find(".plus").addClass("disabled")
            //       }
                  
            //     })
            //   }

              
            // })

            // $(this).find(".adult").each(function(){
            //   _totalAdultNum += Number($(this).find("input").val())
            // })
            // $(this).find(".child").each(function(){
            //   _totalChildNum += Number($(this).find("input").val())
            // })

            // setTimeout(function(){
            //   $(".room-info").eq(0).find(".num").text($(".room-con-box:last-child .title .num").text()) // 객실
            //   $(".room-info").eq(1).find(".num").text(_totalAdultNum) // 성인
            //   $(".room-info").eq(2).find(".num").text(_totalChildNum) // 아동
            // }, 0.003)
            
          }
        }
      });

      $(".gate-btn > div").each(function(){
        $(this).on("mouseenter", function(){
          $(this).addClass("on");
          $(this).siblings().addClass("dimd");
        });
        $(this).on("mouseleave", function(){
          $(this).removeClass("on");
          $(this).siblings().removeClass("dimd");
        });
      });

      // 탑버튼 클릭
      $(".btn-top").on("click", function(){
        gsap.to("html, body", 1, {scrollTop:0, ease:Power3.easeOut})
      })

      // 토글 버튼
      $(".toggle-btn").each(function(){
        $(this).on("click", function(){
          if(!$(this).hasClass("on")){
            $(this).addClass("on");

            if($(this).parents().hasClass("recent-srch-wrap")){
              // $(this).find(".toggle-txt").text("최근 검색어 끄기")
              $(this).parents(".recent-srch-wrap").find(".recent-word").show();
            }
          }else{
            $(this).removeClass("on");

            if($(this).parents().hasClass("recent-srch-wrap")){
              // $(this).find(".toggle-txt").text("최근 검색어 켜기");
              $(this).parents(".recent-srch-wrap").find(".recent-word").hide();
            }
          }

          if($(this).parents().hasClass("mypage-area")){
            if(!$(this).hasClass("on")){
              $(".booking-history-list .list").removeClass("on");
              $(".booking-history-list .list .detail").stop(true, true).slideUp()
            }else{
              $(".booking-history-list .list").addClass("on");
              $(".booking-history-list .list .detail").stop(true, true).slideDown()
            }
            
          }

          if($(this).hasClass("compare")) { // 호텔 목록, 숙소비교 버튼
            if(!$(this).hasClass("on")) {
              $(".chk-pop").stop().fadeOut(400).removeClass("on");
              if($(".chk-pop").hasClass("fix")) $(".quick-fixed-area").stop().animate({bottom: `${bottomGap}px`}, 200);
            } else {
              if($(".compare-btn input").filter(":checked").length > 0) {
                $(".chk-pop").stop().fadeIn(400).addClass("on");
                if($(".chk-pop").hasClass("fix")) $(".quick-fixed-area").stop().animate({bottom: `${fixBottomoGap}px`}, 200);
              }
            }
          }
        });
      });

      // 프린트 버튼
      // $(".print-btn").on('click', function(){
      //   $("body").addClass("pop-print");
      //   window.print();
      // });
      
      // $(".print-btn").on('click', function () {
      //   $("body").addClass("pop-print");
      //   window.print();
    
      //   // 프린트 창 닫힘을 확인하는 타이머
      //   const intervalId = setInterval(() => {
      //     if (!window.matchMedia("print").matches) {
      //       // 프린트 창이 닫힌 것으로 간주
      //       $("body").removeClass("pop-print");
      //       clearInterval(intervalId); // 타이머 중지
      //     }
      //   }, 100); // 100ms 간격으로 확인
      // });

      $(".print-btn").on('click', function () {
        $("body").addClass("pop-print");
        
        window.print();
        
        // 일정 시간 후 pop-print 클래스 제거
        setTimeout(() => {
          $("body").removeClass("pop-print");
        }, 100);
      });

      // 탭 메뉴 (클릭 & 스크롤 시, 앵커 이동)
      if($(".tab-menu").size() > 0){
        hotelDetailTab();
      }

      // 좋아요 버튼
      // $(".like-btn").on("click", function() {
      // $(document).on("click", ".like-btn", function() {
      //   if ($(this).hasClass("on")) {
      //     $(this).removeClass("on");
      //     $(this).attr("title", "호텔 좋아요 추가");
      //   } else {
      //     $(this).addClass("on");
      //     $(this).attr("title", "호텔 좋아요 취소");
      //   }
      // });
      $(document).on("click", ".like-btn", function() {
        const $likeBtn = $(this);
        const isLiked = $likeBtn.hasClass("on");
        
        $likeBtn.find(".like-tooltip").remove();
        
        const tooltipText = isLiked ? "관심숙소 삭제" : "관심숙소 저장";
        const tooltip = $('<div class="like-tooltip"></div>').text(tooltipText);
        $likeBtn.append(tooltip);
        
        if (isLiked) {
          $likeBtn.removeClass("on");
        } else {
          $likeBtn.addClass("on");
        }
      
        // tooltip.fadeIn().css("transform", "translateY(0)");
        tooltip.fadeIn();
      
        setTimeout(() => {
          tooltip.fadeOut(() => {
            tooltip.remove();
          });
        }, 1000);
      });

      // 툴팁
      $(".tooltip-wrap .tooltip-btn").off().on("mouseenter", function(){
          $(this).parents(".tooltip-wrap").find(".tooltip-box").stop(true,true).fadeIn(200);
      });
      $(".tooltip-wrap").on("mouseleave", function(){
          $(this).find(".tooltip-box").stop(true,true).fadeOut(200);
      });

      // 테이블 아코디언
      if($(".table-acco-btn").size() > 0 || $(".white-acco-area").size() > 0 || $(".faq-acco-area").size() > 0 || $(".booking-history-wrap")){
        $(".table-acco-btn").each(function(){
          $(this).on("click", function(){
            if(!$(this).hasClass("on")){
              $(this).addClass("on");
              $(this).next(".form-table").stop(true, true).slideDown();
            }else{
              $(this).removeClass("on");
              $(this).next(".form-table").stop(true, true).slideUp();
            }
          })
        });

        $(document).on("click", ".white-acco-area .acco-list .acco-tit", function(){
          if(!$(this).parents(".acco-list").hasClass("on")){
            $(this).parents(".acco-list").addClass("on");
            $(this).parents(".acco-list").find(".acco-con").stop(true, true).slideDown(() => {
              if($(".tab-menu").length > 0) { // 호텔상세, 탭 이동 재계산
                ScrollTrigger.refresh();
              }
            });
            
            if($(this).parents(".acco-list").find(".txt-chk").length > 0) txtChkFunc($(this).parents(".acco-list"));  // 3줄 이상 더보기

          }else{
            $(this).parents(".acco-list").removeClass("on");
            $(this).parents(".acco-list").find(".acco-con").stop(true, true).slideUp(() => {
              if($(".tab-menu").length > 0) { // 호텔상세, 탭 이동 재계산
                ScrollTrigger.refresh();
              }
            });
          } 
        });

        $(".white-acco-area .acco-list").each(function(){
          if($(this).hasClass("on")){
            $(this).find(".acco-con").show(0, () => {
              if($(this).find(".txt-chk").length > 0) txtChkFunc($(this));  // 3줄 이상 더보기
              if($(".tab-menu").length > 0) { // 호텔상세, 탭 이동 재계산
                ScrollTrigger.refresh();
              }
            });
          }
        });

        $(document).on("click", ".faq-acco-area .acco-list .acco-tit", function(){
          if(!$(this).parents(".acco-list").hasClass("on")){
            $(this).parents(".acco-list").addClass("on")
            $(this).siblings(".acco-con").stop(true, true).slideDown();
          }else{
            $(this).parents(".acco-list").removeClass("on")
            $(this).siblings(".acco-con").stop(true, true).slideUp();
          }
        });

        $(document).on("click", ".booking-history-list .list button", function(){
          if(!$(this).parents(".list").hasClass("on")){
            $(this).parents(".list").addClass("on")
            $(this).parents(".list").find(".detail").stop(true, true).slideDown();
          }else{
            $(this).parents(".list").removeClass("on")
            $(this).parents(".list").find(".detail").stop(true, true).slideUp();
          }
        });
      }

      // 지도보기 팝업 리스트 열기, 닫기 버튼
      $(".pop-filter-layout .fold-btn").on("click", function(){
        if($(this).parents(".pop-filter-layout").find(".list-area").hasClass("on")){
          $(this).parents(".pop-filter-layout").find(".list-area").removeClass("on");
        }else{
          $(this).parents(".pop-filter-layout").find(".list-area").addClass("on");
        }
      });

      // 지도보기 mouseenter
      mapHotelList();

      // promotion url copy
      if($(".view-detail-area").size() > 0){
        $(".url-copy").on("click", function(){
          const currentUrl = window.location.href;
  
          const copyToClipboard = (text) => {
              const textarea = document.createElement('textarea');
              textarea.value = text;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
          };
  
          copyToClipboard(currentUrl);
  
          alert(`URL이 복사되었습니다 - ${currentUrl}`)
        });
      }

      // 탭 기능
      $(document).on("click", ".tab-func-area .tab-btn", function(){
        var thisIndex = $(this).index();
        if(!$(this).hasClass("on")){
          // 팝업 내 스크롤 이동 후, 닫고 다시 열었을때 팝업 스크롤 맨 위로 원복
          $(this).parents(".layer-popup").find(".scroll-area").scrollTop(0).scrollLeft(0);

          $(this).parents(".tab-func-area").find(".tab-btn-area .tab-btn").removeClass("on");
          $(this).addClass("on");
          $(this).parents(".tab-func-area").find(".tab-con-area .tab-con").removeClass("on");
          $(this).parents(".tab-func-area").find(".tab-con-area .tab-con").eq(thisIndex).addClass("on");
        }
      });

      // 약관 전체 동의
      if($(".agree-acco").size() > 0){
        $(".agree-acco .check-list .check-list-con").show();

        $(".agree-acco .check-list").each(function(){
          $(this).find(".click-div").on("click", function(e){
            if(!$(this).parents(".check-list").hasClass("on")){
              $(this).parents(".check-list").addClass("on");
              $(this).siblings(".check-list-con").stop(true, true).slideDown()
            }else{
              $(this).parents(".check-list").removeClass("on");
              $(this).siblings(".check-list-con").stop(true, true).slideUp()
            }
          });
        })
      }

      // 마이페이지 호텔 예약내역 조회 검색기간
      // if($(".mypage-area").size() > 0){
      //   $(".period-btn button").on("click", function(){
      //     if(!$(this).hasClass("on")){
      //       $(".period-btn").find("button").removeClass("on");
      //       $(this).addClass("on");

      //       if($(this).index() == 0){
      //         $(".form-date-w .form-date input").datepicker("enable")
      //       }else{
      //         $(".form-date-w .form-date input").datepicker("disable")
      //       }
      //     }
      //   })
      // }

      if($(".reserve-check").size() > 0){
        $(".reserve-check .btn-border-round").off().on("click", function(){
          $(".reserve-check .form-select select option:first-child").prop("selected", true);
          $(".reserve-check .form-input input").val("");
          $(".reserve-check .form-input input").attr("value", "");
          $(".period-btn").find("button").removeClass("on");
          $(".period-btn").find("button").eq(0).addClass("on");
          // $(".reserve-check .form-date-w .form-date input").datepicker("enable");
          // $(".reserve-check .form-date-w .form-date input").datepicker("setDate", "");

          $(".reserve-check .form-checkbox input").prop("checked", false);
        });
      }

      // ---- 목록 [비교하기 팝업] START ----
      if($(".chk-pop").length > 0) {
        let itemIdx;
        let itemIdxEq;
        let delteItem;
        $Chkpop = $(".chk-pop");
        $ComparePop = $(".compare-pop");
        chkItemEl = $Chkpop.find(".chk-list .item").eq(0).clone(true);
        
        // [목록], 비교하기 버튼 init
        // $(".compare-btn input").filter(":checked").each((idx, item) => {
        //   // 목록 아이템 추가 & 팝업 아이템 추가
        //     // data-compare 순서 할당
        //     $(item).parents(".product-list .item").data("compare", idx + 1);
        //     $(item).parents(".product-list .item").attr("data-compare", idx + 1);
        //     $Chkpop.find(".chk-list .item").eq(idx).data("compare", idx + 1);
        //     $Chkpop.find(".chk-list .item").eq(idx).attr("data-compare", idx + 1);
        //     $Chkpop.find(".chk-list .item").eq(idx).addClass("on");

        //     // 팝업 아이템에 데이터값 넣기
        //     if($(item).parents(".product-list .item").find(".img-wrap img").length > 0) {
        //       $Chkpop.find(".chk-list .item").eq(idx).find(".img-wrap img").attr("src", 
        //         $(item).parents(".product-list .item").find(".img-wrap img").attr("src")
        //       );
        //     } else {
        //       $Chkpop.find(".chk-list .item").eq(idx).find(".img-wrap img").remove();
        //     }
        //     $Chkpop.find(".chk-list .item").eq(idx).find(".e-name").text( 
        //       $(item).parents(".product-list .item").find(".e-name").text()
        //     );
        //     if($(item).parents(".product-list .item").find(".k-name").length > 0) {
        //       $Chkpop.find(".chk-list .item").eq(idx).find(".k-name").text( 
        //         $(item).parents(".product-list .item").find(".k-name").text()
        //       );
        //     } else {
        //       $Chkpop.find(".chk-list .item").eq(idx).find(".k-name").remove();
        //     }
        //     $Chkpop.find(".chk-list .item").eq(idx).find("a").attr("href", 
        //       $(item).parents(".product-list .item").find("a").attr("href")
        //     );

        //     // [비교하기 팝업], 카운트 숫자
        //     // [비교하기 팝업], 비교하기 버튼 disabled
        //     chkPopLengthBtnFunc();
        // });

        $(document).on('click', ".compare-btn input", function() {
        // $(".compare-btn input").on("click", function() {
          if(!$(this).is(':checked')) { // 체크 해제할 때 실행...
            // 목록 아이템 0개면 [비교하기 팝업] 닫기
            if($(".compare-btn input").filter(":checked").length === 0) {
              $Chkpop.stop().fadeOut(400, function() {
                $Chkpop.removeAttr("style");
                $Chkpop.removeClass("fix");
              }).removeClass("on");
              if($(".quick-fixed-area").css("position") == "fixed" && $Chkpop.hasClass("fix")) $(".quick-fixed-area").stop().animate({bottom: `${bottomGap}px`}, 200);
            }

            // 목록 아이템 삭제 & 팝업 아이템 삭제
            // data-compare 순서 재할당
            delteItem = $(this).parents(".product-list .item");
            delteIdx = delteItem.data("compare");
            deleteChkItem = $Chkpop.find(`.chk-list .item[data-compare="${delteIdx}"]`);

            delteItem.removeData("compare");
            delteItem.removeAttr("data-compare");
            deleteChkItem.remove();
            $Chkpop.find(".chk-list").append(chkItemEl);
            chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성

            // data-compare 순서 재할당
            dataCompareVarFunc();

            // [비교하기 팝업], 카운트 숫자
            // [비교하기 팝업], 비교하기 버튼 disabled
            chkPopLengthBtnFunc();

          } else {  // 체크 될 때 실행...
            // 목록 아이템 3개 초과 클릭 시 alert
            if($(".compare-btn input").filter(":checked").length > 3) { 
              alert("최대 3개의 숙소만 비교하실 수 있습니다.");
              $(this).prop("checked", false);
              return;
            }

            // [비교하기 팝업], 열기
            if(!$Chkpop.hasClass("on")) {
              $Chkpop.stop().fadeIn(400).addClass("on").css("left", -$(window).scrollLeft());
            }

            // 목록 아이템 추가 & 팝업 아이템 추가
            // data-compare 순서 할당
            itemIdx = $(".compare-btn input").filter(":checked").length;
            itemIdxEq = itemIdx - 1

            $(this).parents(".product-list .item").data("compare", itemIdx);
            $(this).parents(".product-list .item").attr("data-compare", itemIdx);
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).data("compare", itemIdx);
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).attr("data-compare", itemIdx);
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).addClass("on");

            // 팝업 아이템에 데이터값 넣기
            if($(this).parents(".product-list .item").find(".img-wrap img").length > 0) {
              $Chkpop.find(".chk-list .item").eq(itemIdxEq).find(".img-wrap img").attr("src", 
                $(this).parents(".product-list .item").find(".img-wrap img").attr("src")
              );
            } else {
              $Chkpop.find(".chk-list .item").eq(itemIdxEq).find(".img-wrap img").remove();
            }
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).find(".e-name").text( 
              $(this).parents(".product-list .item").find(".e-name").text()
            );
            if($(this).parents(".product-list .item").find(".k-name").length > 0) {
              $Chkpop.find(".chk-list .item").eq(itemIdxEq).find(".k-name").text( 
                $(this).parents(".product-list .item").find(".k-name").text()
              );
            } else {
              $Chkpop.find(".chk-list .item").eq(itemIdxEq).find(".k-name").remove();
            }
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).find("a").attr("href", 
              $(this).parents(".product-list .item").find("a").attr("href")
            );

            // [비교하기 팝업], 카운트 숫자
            // [비교하기 팝업], 비교하기 버튼 disabled
            chkPopLengthBtnFunc();
          }
        });

        // // [비교하기 팝업] 팝업 아이템 삭제 버튼 클릭
        // $Chkpop.on("click", ".delete-btn", function() {
        //   comparePopDeleteBtn($(this));
        // });

        // $Chkpop.on("click", ".delete-btn", function() {
        //   // 목록 아이템 삭제 & 팝업 아이템 삭제
        //   // data-compare 순서 재할당
        //   deleteChkItem = $(this).parents(".item");
        //   delteIdx = deleteChkItem.data("compare");

        //   deleteChkItem.remove();
        //   $Chkpop.find(".chk-list").append(chkItemEl);
        //   chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성

        //   $(`.product-list .item[data-compare="${delteIdx}"]`).find($(".compare-btn input")).prop("checked", false);
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).removeData("compare");
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).removeAttr("data-compare");

        //   // data-compare 순서 재할당
        //   dataCompareVarFunc();

        //   // 목록 아이템 0개면 [비교하기 팝업] 닫기
        //   if($(".compare-btn input").filter(":checked").length === 0) $Chkpop.stop().fadeOut(400, function() {$Chkpop.removeAttr("style");}).removeClass("on");

        //   // [비교하기 팝업], 카운트 숫자
        //   // [비교하기 팝업], 비교하기 버튼 disabled
        //   chkPopLengthBtnFunc();
        // });

        // [비교하기 팝업] 리셋 버튼 클릭
        $($Chkpop).find(".reset-btn").on("click", function() {
          //  [비교하기 팝업] 닫기
          $Chkpop.stop().fadeOut(400, function() {$Chkpop.removeAttr("style");}).removeClass("on");

          // 목록 아이템 삭제 & 팝업 아이템 삭제
          // data-compare 삭제
          $(".compare-btn input").filter(":checked").parents(".product-list .item").removeData("compare");
          $(".compare-btn input").filter(":checked").parents(".product-list .item").removeAttr("data-compare");
          $(".compare-btn input").filter(":checked").prop("checked", false);

          // [비교하기 팝업], 카운트 숫자 0
          $Chkpop.find(".count .green-txt").text(0);
          $Chkpop.find(".chk-list").empty();
          for (var i = 1; i <= 3; i++) {
            $Chkpop.find(".chk-list").append(chkItemEl);
            chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성
          }

          // [비교하기 팝업], 비교하기 버튼 disabled
          $Chkpop.find(".compare-pop-btn").prop('disabled', true);
        });

        // [비교하기 팝업] 닫기 버튼 클릭
        $($Chkpop).find(".popclose-btn").on("click", function() {
          if($Chkpop.hasClass("fix")) {
            $Chkpop.removeClass("fix");
            if($(".quick-fixed-area").css("position") == "fixed") $(".quick-fixed-area").stop().animate({bottom: `${bottomGap}px`}, 200);
          } else {
            $Chkpop.addClass("fix");
            if($(".quick-fixed-area").css("position") == "fixed") $(".quick-fixed-area").stop().animate({bottom: `${fixBottomoGap}px`}, 200);;
          }
        });

        // ---------------------------------------------

        compareItemEl = $ComparePop.find(".compare-list > .item").eq(0).clone(true);

        // [비교하기 팝업] 비교하기 버튼 클릭
        $($Chkpop).find(".compare-pop-btn").on("click", function() {
          $(".compare-btn input").filter(":checked").each((idx, item) => {
            $ComparePop.find(".compare-list > .item").eq(idx).addClass("on");
            $ComparePop.find(".compare-list > .item").eq(idx).data("compare", idx + 1);
            $ComparePop.find(".compare-list > .item").eq(idx).attr("data-compare", idx + 1);

            // 팝업2 아이템에 데이터값 넣기
            if($(`.product-list .item[data-compare="${idx + 1}"]`).find(".img-wrap img").length > 0) {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".img-wrap img").attr("src",
                $(`.product-list .item[data-compare="${idx + 1}"]`).find(".img-wrap img").attr("src")
              )
            } else {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".img-wrap img").remove();
            }
            $ComparePop.find(".compare-list > .item").eq(idx).find(".e-name").text( 
              $(`.product-list .item[data-compare="${idx + 1}"]`).find(".e-name").text()
            );
            if($(`.product-list .item[data-compare="${idx + 1}"]`).find(".k-name").length > 0) {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".k-name").text( 
                $(`.product-list .item[data-compare="${idx + 1}"]`).find(".k-name").text()
              );
            } else {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".k-name").remove();
            }
            if($(`.product-list .item[data-compare="${idx + 1}"]`).find(".stars").length > 0) {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".stars").html(
                $(`.product-list .item[data-compare="${idx + 1}"]`).find(".stars").html()
              );
            } else {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".stars").remove();
            }
            if($(`.product-list .item[data-compare="${idx + 1}"]`).find(".location").length > 0) {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".location .txt").text( 
                $(`.product-list .item[data-compare="${idx + 1}"]`).find(".location .txt").text()
              );
            } else {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".location").remove();
            }
            $ComparePop.find(".compare-list > .item").eq(idx).find(".infos .txt span").text( 
              $(".trip-sel-area.resrch .list-day.on").text().replace(/[^0-9]/g, "")
            );
            if($(`.product-list .item[data-compare="${idx + 1}"]`).find(".price").length > 0) {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".price .money").text( 
                $(`.product-list .item[data-compare="${idx + 1}"]`).find(".price .money").text()
              );
              // 마감임박일 경우...
              if($(`.product-list .item[data-compare="${idx + 1}"]`).find(".price span").length < 2) {
                $ComparePop.find(".compare-list > .item").eq(idx).find(".price span:last").remove();
                $ComparePop.find(".compare-list > .item").eq(idx).find(".infos .txt").remove();
              }
            } else {
              $ComparePop.find(".compare-list > .item").eq(idx).find(".price").remove();
            }
            $ComparePop.find(".compare-list > .item").eq(idx).find("a").attr("href", 
              $(`.product-list .item[data-compare="${idx + 1}"]`).find("a").attr("href")
            );
          });
        })

        // [비교하기 팝업2] 팝업 아이템 삭제 버튼 클릭
        // $ComparePop.on("click", ".delete-btn", function() {
        //   // 목록 아이템 삭제 & 팝업 아이템 삭제 & 팝업2 아이템 삭제
        //   // data-compare 순서 재할당
        //   deleteChkItem = $(this).parents(".item");
        //   delteIdx = deleteChkItem.data("compare");

        //   deleteChkItem.remove();
        //   $ComparePop.find(".compare-list").append(compareItemEl);
        //   compareItemEl = $ComparePop.find(".compare-list > .item:last").clone(true); // 새로운 복사본 생성
          
        //   $Chkpop.find(`.chk-list .item[data-compare="${delteIdx}"]`).remove();
        //   $Chkpop.find(".chk-list").append(chkItemEl);
        //   chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성

        //   $(`.product-list .item[data-compare="${delteIdx}"]`).find($(".compare-btn input")).prop("checked", false);
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).removeData("compare");
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).removeAttr("data-compare");

        //   // data-compare 순서 재할당
        //   dataCompareVarFunc();

        //   // 목록 아이템 0개면 [비교하기 팝업], [비교하기 팝업2] 닫기
        //   if($(".compare-btn input").filter(":checked").length === 0) {
        //     $ComparePop.fadeOut(200, function() {
        //       $Chkpop.stop().fadeOut(400, function() {$Chkpop.removeAttr("style");}).removeClass("on");
        //     }).removeClass("on");
        //     $("body").removeClass("stop-scroll");
        //   }

        //   // [비교하기 팝업], 카운트 숫자
        //   // [비교하기 팝업], 비교하기 버튼 disabled
        //   chkPopLengthBtnFunc();
        // });

        // [비교하기 팝업2] 닫기 버튼 클릭
        // $ComparePop.find(".popclose-btn").on("click", function() {
        //   $ComparePop.find(".compare-list").empty();
        //   for (var i = 1; i <= 3; i++) {
        //     $ComparePop.find(".compare-list").append(compareItemEl);
        //     compareItemEl = $ComparePop.find(".compare-list > .item:last").clone(true); // 새로운 복사본 생성
        //   }
        // });
      }
      // ---- 목록 [비교하기 팝업] END ----
    },
    tripSrchBarFn:function(){

      // 주요 추천 도시
      var mainCitySwiper = []
      if($(".main-city-wrap").size() > 0){
        $(".main-city-box .swiper-container").each(function(q){
          if($(this).find(".city").length > 8){
            $(this).addClass("mainCitySwiper" + q);

            mainCitySwiper[q] =  new Swiper($(this), {
              navigation: {
                nextEl: $(this).parents(".main-city-box").find(".swiper-button-next"),
                prevEl: $(this).parents(".main-city-box").find(".swiper-button-prev"),
              },
              slidesPerView: 4,
              slidesPerColumn: 2,
              slidesPerGroup: 8, 
              spaceBetween:8,
              observer:true,
              observeParents:true,
            });
          }else{
            $(this).parents(".main-city-box").find(".circle-btn").hide()
          }
        });
      }

      // 검색바 최근검색어, 주요 도시 클릭
      $(document).on("click", ".trip-recent-srch button", function(){
        if(!$(this).hasClass("tab-btn")){
          $(".trip-recent-srch").removeClass("on");
          $(this).parents(".trip-input-div").find("input").val($(this).find(".txt").text());
          calendarHeiFn();
          $(".trip-sel-area .trip-sel-wrap .trip-date").addClass("on");
          if($(".calendar .check.in").size() <= 0){
            chkInOutFn()
          }
        }
      });

      $(".trip-sel-area.resrch .trip-sel-wrap .trip-recent-srch").on("click", function(e){
        e.preventDefault();

        if($(".stay-day").hasClass("on")){ // 숙박일 수 열려 있는 경우 닫기
          $(".stay-day").removeClass("on");
          $(".stay-day .day-list").stop(true, true).slideUp();
        }
      })

      // 객실 팝업 열기
      $(".trip-sel-area .room-info-wrap").off().on("click", function(){
        if(!$(".trip-sel-area .trip-room").hasClass("on")){
          $(".trip-sel-area .trip-sel-wrap .trip-date").removeClass("on");
          $(".trip-sel-area .trip-room").addClass("on");
        }
        if($(".trip-sel-area .trip-recent-srch").hasClass("on")){ // 목적지 검색 열려 있는 경우 닫기
          $(".trip-sel-area .trip-recent-srch").removeClass("on")
        }

        if($(".stay-day").hasClass("on")){ // 숙박일 수 열려 있는 경우 닫기
          $(".stay-day").removeClass("on");
          $(".stay-day .day-list").stop(true, true).slideUp();
        }
      });

      // 달력 팝업 열기
      $(".calendar-wrap").on("click", function(e){
        e.preventDefault();

        if($(".stay-day").hasClass("on")){ // 숙박일 수 열려 있는 경우 닫기
          $(".stay-day").removeClass("on");
          $(".stay-day .day-list").stop(true, true).slideUp();
        }
      })

      // 체크인, 체크아웃 default값
      // if(!$(".trip-sel-area").hasClass("resrch")) { // 목록, 상세의 검색바의 경우 디폴트값 있으면 안됨. 데이터가 들어가 있어야해서 빠짐
      //   getNewDate(); // 날짜
      //   getDayOfWeek(); // 요일
      // }

      $(".calendar .week-div .today").prevAll("a").addClass("disabled"); // 오늘 날짜 기준으로 그 전 날짜는 선택 안되게 막기

      if(!$(".trip-sel-area").hasClass("resrch")) { // 메인에서만
        chkInOutFn();
      }

      // 숙박일수 선택
      $(".stay-day .list-day").on("click", function(){
        const $this = $(this);
        const stayNights = parseInt($this.text().split("박")[0]);
        const $calendar = $(".calendar");
        const $date = $calendar.find(".week-div > a").not(".disabled");
        const $checkIn = $calendar.find(".check.in");
        
        // 기본 UI 업데이트
        isCheck = false;
        $(".trip-sel-area .trip-sel-wrap .trip-date .checkin-wrap .date-txt").eq(1).removeClass("on");
        $(".stay-day .list-day").removeClass("on");
        $this.addClass("on");
        $(".select-day").text($this.text());
        $(".stay-day").removeClass("on").find(".day-list").stop(true, true).slideUp(200);
      
        // 달력 초기화
        const resetCalendar = () => {
          $calendar.find(".check.out span").not(".date").remove();
          $calendar.find(".check.out").removeClass("check out");
          $date.removeClass("ing");
          $calendar.find(".disabled").removeClass("ing");
        }
        resetCalendar();
      
        // 체크인 인덱스 찾기
        const checkInIndex = $date.index($checkIn);
        
        // 체크아웃 날짜 설정
        const setCheckOut = (index) => {
          $date.eq(index).addClass("check out").append("<span>체크아웃</span>");
          $checkIn.nextUntil($(".check.out")).addClass("ing");
        }
      
        // 월 간격 체크 및 처리
        const handleMonthGap = () => {
          const checkOutMonth = parseInt($(".check.out").closest(".calendar").find("select option:selected").text().split("-")[1]);
          const checkInMonth = parseInt($checkIn.closest(".calendar").find("select option:selected").text().split("-")[1]);
          const checkOutYear = parseInt($(".check.out").closest(".calendar").find("select option:selected").text().split("-")[0]);
          const checkInYear = parseInt($checkIn.closest(".calendar").find("select option:selected").text().split("-")[0]);
      
          if(checkOutMonth > checkInMonth || checkOutYear > checkInYear) {
            $(".check.out").prevAll("a").addClass("ing");
            $checkIn.closest(".calendar").nextUntil($(".check.out").closest(".calendar")).find(".week-div > a").addClass("ing");
            $calendar.find(".disabled").removeClass("ing");
          }
        }
      
        // 최대 숙박일수 체크 및 처리
        if($date.length <= checkInIndex + stayNights) {
          setCheckOut($date.length - 1);
          handleMonthGap();
          $checkIn.removeClass("ing").prevAll("a").removeClass("ing");
          $(".check.out").removeClass("ing");
      
          setTimeout(() => {
            const ingLength = $(".calendar .week-div .ing").length;
            $(".stay-day .list-day").removeClass("on").eq(ingLength).addClass("on");
            $(".select-day").text($(".stay-day .list-day").eq(ingLength).text());
            alert(`현재 체크인 기준 최대 숙박일수는 ${ingLength + 1}일입니다.`);
          }, 10);
        } else {
          setCheckOut(checkInIndex + stayNights);
          handleMonthGap();
        }
      
        checkOutTxtFn();
      
        // UI 상태 업데이트
        if(!$(".trip-sel-area .trip-recent-srch").hasClass("on")) {
          $(".trip-sel-area .trip-sel-wrap .trip-date").removeClass("on");
          $(".trip-sel-area .trip-room").addClass("on");
        }
      });

      // 숙박일수 클릭시 슬라이드 펼치기
      $(".stay-day .select-day").on("click", function(){
        if(!$(this).parents(".stay-day").hasClass("disabled")){
          if(!$(this).parents(".stay-day").hasClass("on")){
            $(this).parents(".stay-day").addClass("on");
            $(this).siblings(".day-list").stop(true, true).slideDown(200);
            if($(".list-day").hasClass("on")){
              gsap.to($(".day-list"), 0, {scrollTop:0})
              gsap.to($(".day-list"), 0, {scrollTop:$(".list-day.on").position().top})
            }
          }else{
            $(this).parents(".stay-day").removeClass("on");
            $(this).siblings(".day-list").stop(true, true).slideUp(200);
          }
        }
      });

      // 체크인, 체크아웃 팝업 열기
      $(".checkin-wrap").on("click", function(){
        if($(".trip-sel-area .trip-room").hasClass("on")){
          $(".trip-sel-area .trip-room").removeClass("on")
        }
        if($(".trip-sel-area .trip-recent-srch").hasClass("on")){
          $(".trip-sel-area .trip-recent-srch").removeClass("on")
        }

        if($(".trip-sel-area .stay-day").hasClass("on")){
          $(".trip-sel-area .stay-day").removeClass("on");
          $(".trip-sel-area .stay-day .day-list").stop(true, true).slideUp(200);
        }

        calendarHeiFn();

        if($(".calendar-wrap .check.in").size() <= 0){
          chkInOutFn();
        }

        $(this).parents(".trip-date").addClass("on");
      });

      dateClickFn();

      _clickNum = $(".calendar.on").index();
      // 달력 내 좌,우 버튼 클릭 시 left 위치 이동
      $(document).on("click", ".calendar-wrap .scroll-area > button", function(){
        if(!$(this).hasClass("disabled")){
          if($(this).hasClass("prev-btn")){ // prev button
            if($(".calendar-wrap .next-btn").hasClass("disabled")){
              $(".calendar-wrap .next-btn").removeClass("disabled")
            }
            _clickNum--;

            if(_clickNum == 0){
              $(".calendar-wrap .prev-btn").addClass("disabled")
            }
          }else if($(this).hasClass("next-btn")){ // next button
            if($(".calendar-wrap .prev-btn").hasClass("disabled")){
              $(".calendar-wrap .prev-btn").removeClass("disabled")
            }
            _clickNum++;

            if(_clickNum == $(".calendar-wrap .calendar").length - 2){
              $(".calendar-wrap .next-btn").addClass("disabled")
            }
          }

          if(_clickNum < $(".calendar-wrap .calendar").length){
            $(".calendar-wrap .calendar").removeClass("on");
            $(".calendar-wrap .calendar").eq(_clickNum).addClass("on");
            $(".calendar-wrap .calendar").each(function(q){
              $(this).css("left", 404*(q-_clickNum));
            });
          }
        }
      });

      $(".room-info-sel").on("click", function(e){ // 객실 팝업 클릭 시 숙박일수 드롭다운 열려있으면 닫히도록
        e.preventDefault();

        if($(".stay-day").hasClass("on")){
          $(".stay-day").removeClass("on");
          $(".stay-day .day-list").stop(true, true).slideUp();
        }
      });

      var newRoom = $(".trip-sel-area .room-con-box").clone(true); // 객실 clone

      // 객실 추가, 삭제 버튼
      $(document).on("click", ".trip-sel-area .trip-room .room-tit-wrap button", function(){
        if($(this).hasClass("plus") && !$(this).hasClass("disabled")){ // 객실 추가
          $(this).parents(".room-tit-wrap").find(".minus").removeClass("disabled");

          if($(".trip-sel-area .room-con-box").length < 8){ // 최대 객실 수인 8보다 작을 경우 객실 수 추가
            _roomNum++;
            newRoom = $(".trip-sel-area .room-con-box:last-child").clone(true);
            $(".room-con-wrap").append(newRoom);
            $(".trip-sel-area .room-con-box:last-child").find(".adult input").val(2);
            $(".trip-sel-area .room-con-box:last-child").find(".adult input").attr("value", 2);
            $(".trip-sel-area .room-con-box:last-child").find(".adult input").data("val", 2);
            $(".trip-sel-area .room-con-box:last-child").find(".adult").siblings(".minus").removeClass("disabled");
            $(".trip-sel-area .room-con-box:last-child").find(".adult").siblings(".plus").removeClass("disabled");
            $(".trip-sel-area .room-con-box:last-child").find(".child input").val(0);
            $(".trip-sel-area .room-con-box:last-child").find(".child input").attr("value", 0);
            $(".trip-sel-area .room-con-box:last-child").find(".child input").data("val", 0);
            $(".trip-sel-area .room-con-box:last-child").find(".child").siblings(".minus").addClass("disabled");
            $(".trip-sel-area .room-con-box:last-child").find(".child").siblings(".plus").removeClass("disabled");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div").removeClass("on");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk").not(":first-child").remove();
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk .birth input").val("");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk .birth input").attr("value", "");
            $(".trip-sel-area .room-con-box:last-child").find(".person-wrap:nth-child(2) .minus").addClass("disabled");
            $(".trip-sel-area .room-con-box:last .title .num").text($(".trip-sel-area .room-con-box").length)

            if($(".trip-sel-area .room-con-box").length == 8){ // 최대 객실 수가 되었을 경우 추가 버튼 disabled 처리
              $(this).addClass("disabled");
            }
          }
        }else if($(this).hasClass("minus") && !$(this).hasClass("disabled")){ // 객실 삭제
          $(this).parents(".room-tit-wrap").find(".plus").removeClass("disabled");
          _roomNum--;
          $(".trip-sel-area .room-con-box:last-child").remove() // 객실 수 맨 밑에서부터 삭제

          if($(".trip-sel-area .room-con-box").length == 1){ // 객실 수가 1개가 됐을 경우 삭제 버튼 disabled 처리
            $(this).addClass("disabled");
          }
        }

        $(this).closest(".room-num").find(".form-input input").val(_roomNum)
        $(this).closest(".room-num").find(".form-input input").attr("value", _roomNum)
        $(this).closest(".room-num").find(".form-input input").attr("data-val", _roomNum)

        $(".room-info").eq(0).find(".num").text($(".room-con-box:last-child .title .num").text()) // 객실 바 객실 수에 총 갯수 넣기

        totalPeopleNumFn();
        formReCheck();
      });

      // 객실 인원 추가 및 삭제
      var childInfoClone = $(".trip-sel-area .trip-room .child-chk").clone(true);

      $(document).on("click", ".trip-sel-area .trip-room .person button", function(){
        var personNum = parseInt($(this).closest(".person-wrap").find(".form-input input").val());
        var minPersonNum; // 최소 인원
        var maxPersonNum; // 최대 인원

        if($(this).hasClass("minus") && !$(this).hasClass("disabled")){ // minus
          $(this).closest(".person-wrap").find(".plus").removeClass("disabled");

          if($(this).closest(".person-wrap").index() % 2 == 0){ // 성인
            minPersonNum = 1
          }else{ // 아동
            minPersonNum = 0;

            $(this).closest(".room-con-box").find(".child-chk:last .form-input input").val("")
            $(this).closest(".room-con-box").find(".child-chk:last .form-input input").attr("value", "");
            if(personNum == 1){
              $(this).closest(".room-con-box").find(".child-chk-div").removeClass("on");
            }else{
              $(this).closest(".room-con-box").find(".child-chk:last").remove();
              $(this).closest(".room-con-box").find(".child-chk:last .tit .num").text($(this).closest(".room-con-box").find(".child-chk").length);
            }

            formReCheck()
          }
          
          if(personNum > minPersonNum){ // 최소 인원 되면 minus button disabled
            personNum = personNum - 1;
            $(this).closest(".person-wrap").find(".form-input input").val(personNum)
            $(this).closest(".person-wrap").find(".form-input input").attr("value", personNum)
            $(this).closest(".person-wrap").find(".form-input input").attr("data-val", personNum)

            if(personNum == minPersonNum){
              $(this).addClass("disabled")
            }
          }

          if(parseInt($(this).parents(".room-con-div").find(".form-input").eq(0).find("input").val()) + parseInt($(this).parents(".room-con-div").find(".form-input").eq(1).find("input").val()) <= 8){
            $(this).parents(".room-con-div").find(".plus").removeClass("disabled")
          }
        }else if($(this).hasClass("plus") && !$(this).hasClass("disabled")){ // plus
          $(this).closest(".person-wrap").find(".minus").removeClass("disabled");

          if($(this).closest(".person-wrap").index() % 2 == 0){ // 성인
            maxPersonNum = 9
          }else{ // 아동
            maxPersonNum = 8;

            $(this).closest(".room-con-box").find(".child-chk-div").addClass("on");

            if(personNum > 0){
              $(this).closest(".room-con-box").find(".child-chk-div").append(childInfoClone);
              childInfoClone = $(this).closest(".room-con-box").find(".child-chk:last").clone(true);
              $(this).closest(".room-con-box").find(".child-chk:last .tit .num").text($(this).closest(".room-con-box").find(".child-chk").length)
            }

            formReCheck();
          }

          if(personNum < maxPersonNum){ // 최대 인원 되면 plus button disabled
            personNum = personNum + 1;
            $(this).closest(".person-wrap").find(".form-input input").val(personNum)
            $(this).closest(".person-wrap").find(".form-input input").attr("value", personNum)
            $(this).closest(".person-wrap").find(".form-input input").attr("data-val", personNum)

            if(personNum == maxPersonNum){
              $(this).addClass("disabled")
            }
          }

          if(parseInt($(this).parents(".room-con-div").find(".form-input").eq(0).find("input").val()) + parseInt($(this).parents(".room-con-div").find(".form-input").eq(1).find("input").val()) > 8){
            $(this).parents(".room-con-div").find(".plus").addClass("disabled")
          }
        }

        totalPeopleNumFn();
      });

      // 객실 각각 삭제
      $(document).on("click", ".trip-room .room-con-box > .delete-btn", function(){
        _roomNum--;
        $(this).parents(".room-con-box").remove();
        $(".room-num .plus").removeClass("disabled");
        $(".trip-room .room-con-box").each(function(q){
          $(this).find(".title .num").text(q+1)
        });

        $(".room-info").eq(0).find(".num").text($(".room-con-box:last-child .title .num").text()) 

        $(".room-num .form-input input").val($(".room-con-box:last-child .title .num").text())
        $(".room-num .form-input input").attr("value", $(".room-con-box:last-child .title .num").text())
        $(".room-num .form-input input").attr("data-val", $(".room-con-box:last-child .title .num").text())

        if(parseInt($(".room-con-box:last-child .title .num").text()) == 1){
          $(".room-num .minus").addClass("disabled");
        }

        totalPeopleNumFn();
      })

      
      // 아동 생년월일 확인 버튼 클릭
      $(document).on("click", ".child-chk .btn-square-l", function(){
        if($(this).siblings(".form-input").find("input").val() == ""){
          alert("생년월일을 입력해 주세요.");
          $(this).prev(".form-input").find("input").focus()
        }else{
          var birthdate = $(this).siblings(".form-input").find("input").val();
          const confirmBtn = $(this);

          if (!/^\d*$/.test(birthdate)) {
            birthdate = birthdate.replace(/\D/g, ""); // 숫자만 남김
          }

          if (!/^\d{8}$/.test(birthdate)) {
            alert('생년월일을 YYYYMMDD 형식으로 입력해주세요.')
            $(this).prev(".form-input").find("input").val("");
            $(this).parent(".child-chk").find(".form-input").find("input").val(""); 
            return;
          }

          // 만 나이 계산
          let age = 0;

          age = calcFullAgeFn(birthdate, confirmBtn);

          if(age > 17){
            alert("만 17세까지만 아동에 해당합니다.");
            $(this).prev(".form-input").find("input").val("");
            $(this).prev(".form-input").find("input").focus();
            $(this).parent(".child-chk").find(".form-input").find("input").val(""); 
          }else{
            if(age !== undefined){
              $(this).siblings(".form-input:nth-of-type(1)").find("input").data("val", $(this).siblings(".form-input:nth-of-type(1)").find("input").val())
              $(this).siblings(".form-input:nth-of-type(1)").find("input").attr("data-val", $(this).siblings(".form-input:nth-of-type(1)").find("input").val())
              $(this).siblings(".form-input:last-child").find("input").val('만 ' + age + '세');
              $(this).siblings(".form-input:last-child").find("input").attr("value", '만 ' + age + '세');
              $(this).siblings(".form-input:last-child").find("input").data("val", '만 ' + age + '세')
              $(this).siblings(".form-input:last-child").find("input").attr("data-val", '만 ' + age + '세')
            }
          }
        }
      })

      // 객실 적용하기 버튼 클릭
      $(".trip-sel-area .room-info-sel .btn-wrap button").on("click", function(){
        let isAlertShown = false;
        $(".child-chk-div").each(function(){
          if($(this).hasClass("on")){
            $(this).find(".child-chk").each(function(){
              if(!isAlertShown && $(this).find(".form-input input:read-only").val() == ""){
                alert(`${$(this).find(".tit").text()}의 만 나이를 입력해 주세요.`);
                $(this).find(".form-input:nth-of-type(1) input").focus();
                isAlertShown = true;
                return;
              }

              const emptyInputs = $(this).parents(".room-con-wrap").find(".child-chk-div.on .child-chk .form-input:nth-of-type(1) input").filter(function(){
                return $(this).val().trim() === '';
              }).length; // 만 나이를 계산하지 않은 input
              
              if(emptyInputs == 0){ // 만 나이를 모두 계산 했을 경우
                $(".trip-sel-area .trip-sel-wrap .trip-room").removeClass("on");
              }

              
            });
          }
        });

        if ($('.child-chk-div').filter(function() { return !$('.child-chk-div').hasClass('on'); }).length > 0) {
          $(".trip-sel-area .trip-sel-wrap .trip-room").removeClass("on");
        }
      })

      // 검색바 내용 리셋
      $(".trip-sel-area .reset-btn").on("click", function(){
        $(".trip-sel-area .trip-sel-wrap .trip-input .form-input input").val("");
        isCheck = false;
        getNewDate(); // 날짜
        getDayOfWeek(); // 요일
        $(".day-list .list-day").removeClass("on");
        $(".day-list .list-day").eq(0).addClass("on");
        $(".stay-day .select-day").text($(".day-list .list-day.on").text())
        $(".calendar-wrap .calendar .week-div a").removeClass("ing");
        $(".calendar-wrap .calendar .week-div .check").find("span").not(".date").remove();
        $(".calendar-wrap .calendar .week-div .check").removeClass("check in out");
        // 받아온 날짜에 맞춰 체크인, 체크아웃 class 추가
        chkInOutFn()
        $(".stay-wrap select").val(1).prop("selected", true);

        // 객실 초기화 - 객실 1, 성인 2, 아동 0이 default
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info").eq(0).find(".num").text(1)
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info").eq(1).find(".num").text(2)
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info").eq(2).find(".num").text(0)
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .room-con-box:not(:first-child)").remove();
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .child-chk-div").removeClass("on")
        $(".trip-sel-area .trip-sPel-wrap .trip-room .room-info-sel .child-chk-div .child-chk:not(:first-child)").remove()
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .child-chk-div .child-chk input").val("")
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .room-con-div .adult").find("input").val(2)
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .room-con-div .adult").find("input").attr("data-val", 2)
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .room-con-div .child").find("input").val(0)
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .room-con-div .child").find("input").attr("data-val", 0)
        $(".room-num input").val(1)
        $(".room-num input").attr("value",1)
        $(".room-num input").attr("data-val",1)
      });
      
    },
    scrollFn: function () {
      // 고정 검색 바
      if($(".trip-sel-area.resrch").size() > 0 && 80 <= $(window).scrollTop()) {
        $(".trip-sel-area.resrch").addClass("fix");
      }
      // 탭 메뉴
      if($(".tab-menu").size() > 0 && $(".tab-menu").offset().top <= $(window).scrollTop() + 80) {
        $(".tab-menu .tab-wrap").addClass("fix");
      }
      // 메인팝업
      if($(".layer-popup.main-pop.on").find(".pop-area.on").length == 2) {
        $(".layer-popup.main-pop").css("left", -$(window).scrollLeft());
      }

      $(window).on("scroll", function(){
        _isScrollTop = $(window).scrollTop();

        //////// down ////////
        if (_isScrollTop > _thisScroll) {
          // 고정 검색 바
          if($(".trip-sel-area.resrch").size() > 0 && 80 <= _isScrollTop) {
            $(".trip-sel-area.resrch").addClass("fix");
          }

          // 탭 메뉴
          if($(".tab-menu").size() > 0 && $(".tab-menu").offset().top <= _isScrollTop + 80) {
            $(".tab-menu .tab-wrap").addClass("fix");
          }
        }
        
        //////// up ////////
        if (_isScrollTop < _thisScroll) {
          // 고정 검색 바
          if($(".trip-sel-area.resrch").size() > 0 && 80 > _isScrollTop) {
            $(".trip-sel-area.resrch").removeClass("fix").removeAttr("style");
          }

          // 탭 메뉴
          if($(".tab-menu").size() > 0 && $(".tab-menu").offset().top > _isScrollTop + 80) {
            $(".tab-menu .tab-wrap").removeClass("fix").removeAttr("style");
          }
        }

        // 가로 스크롤
        if($(".fixed-wrap").size() > 0) {
          $(".fixed-wrap.fix").css("left", -$(window).scrollLeft());
        }
        if($(".trip-sel-area.resrch").size() > 0) {
          $(".trip-sel-area.resrch.fix").css("left", -$(window).scrollLeft());
        }
        if($(".chk-pop.on").size() > 0) {
          $(".chk-pop").css("left", -$(window).scrollLeft());
        }
        if($(".layer-popup.main-pop.on").find(".pop-area.on").length == 2) {
          $(".layer-popup.main-pop").css("left", -$(window).scrollLeft());
        }

        if(_isScrollTop > 0){
          $(".quick-fixed-area .quick-area").addClass("on");
        }else{
          $(".quick-fixed-area .quick-area").removeClass("on");
        }

        // 퀵, top버튼 position 변경
        quickRePosition();

        _thisScroll = _isScrollTop;
      })
      $(".map-pop .pop-cont > .scroll-area").on("scroll", function(){
        // 가로 스크롤
        $(".filter-area").css("left", -$(this).scrollLeft());

      })
    },
    resizeFn: function () {
      $(window).resize(function () {
      }).resize();
    },
    swiperFn: function () {
      // 주요 추천 도시
      if($("#wrap").hasClass("main") && $(".like-list-swiper").size() > 0){
        likeListSwiperFn();
      }

      // green, gray border swiper - 전체 이미지
      if($(".gray-btn-swiper").size() > 0){
        grayBtnSwiperFn();

        if($(".hotel-img-pop").size() > 0){
          $(document).on("click", ".gray-btn-swiper .tab-btn", function() {
            var thisIndex = $(this).index()
            if(!$(this).hasClass("on")){
              // 팝업 내 스크롤 이동 후, 닫고 다시 열었을때 팝업 스크롤 맨 위로 원복
              $(this).parents(".layer-popup").find(".scroll-area").scrollTop(0).scrollLeft(0);
              
              $(".gray-btn-swiper .tab-btn").removeClass("on");
              $(".hotel-img-div .hotel-img").removeClass("on");
              $(this).addClass("on");
              $(".hotel-img-div .hotel-img").eq(thisIndex).addClass("on");
            }
          });
        }
      }

      // 전체 이미지 상세
      if($(".hotel-img-swiper").size() > 0){
        var hotelImgSwiper = new Swiper(".hotel-img-swiper .swiper-container", {
          navigation: {
            nextEl: ".hotel-img-swiper .swiper-button-next",
            prevEl: ".hotel-img-swiper .swiper-button-prev",
          },
          pagination: {
            el: '.hotel-img-swiper .swiper-pagination',
            type: 'fraction',
          },
          loop:true,
          slidesPerView: "auto",
          observer:true,
          observeParents:true,
        });
      }
    },
    formChkFn:function(){
      selectMotionFunc();

      // input에 값 입력 시 내용 지우기 버튼 생성
      formReCheck();

      // form date 클릭
      // $(".form-date input").datepicker({
      //   dateFormat:"yy-mm-dd"
      // });

      // [Input] 인풋들 Reset
      function inputReset($inputItem) {
        if($inputItem.parents(".form-range").length) {
          // 슬라이더 초기값으로 설정
          $rangeSlider.slider("values", [rangeData.minValue, rangeData.maxValue]);
          
          // 입력 필드 초기화
          $rangeAmountMore.val(rangeData.minValue);
          $rangeAmountLess.val(rangeData.maxValue);

          // 입력 값 변경 처리
          inputNumChange($rangeAmountMore);
          inputNumChange($rangeAmountLess);
          // let $rangeSlider = $(".form-range").find(".slider-range");
          // let $rangeAmountMore = $(".form-range").find(".form-input.more input");
          // let $rangeAmountLess = $(".form-range").find(".form-input.less input");
          // let rangeData = JSON.parse($rangeSlider.attr("data-range"));
          
          // $rangeSlider.slider("values", 0, rangeData.minValue);
          // $rangeAmountMore.val($rangeSlider.slider("values", 0));
          // inputNumChange($rangeAmountMore);

          // $rangeSlider.slider("values", 1, rangeData.maxValue);
          // $rangeAmountLess.val($rangeSlider.slider("values", 1));
          // inputNumChange($rangeAmountLess);
        } else {
          if ($inputItem.attr("type") === "checkbox") $inputItem.prop("checked", false);
          if ($inputItem.attr("type") === "radio") $inputItem.prop("checked", false);
          if ($inputItem.attr("type") === "text") $inputItem.val("");
        }
      }

      // ---- 필터 START ----
      if($(".filter-pop").length > 0) {
        // ❗ 동적 인풋 테스트 ❗
        // 필터 셋팅
        if($(".test").length > 0) {
          setTimeout(() => {
            $(".test").append(`<div class="form-checkbox">
                                <input type="checkbox" id="Service-1" name="">
                                <label for="Service-1"><span>호텔 편의시설1</span></label>
                              </div>`);
            $(".test2").append(`<li>
                              <div class="form-checkbox">
                                <input type="checkbox" id="pop-Service-1" name="">
                                <label for="pop-Service-1"><span>호텔 편의시설1</span></label>
                              </div>
                            </li>`);
          })
        }

        // 필터 체크박스 & 라디오 init
        // $(".filter:has(.icon-txt-btn.close)").each((idx, item) => {
        //   if($(item).find(".opt-group input:checked").length > 0) {
        //     $(item).addClass("chk");
        //   }
        // });
        // $(".filter:has(.icon-txt-btn.open) .opt-group input:checked").each((idx, item) => {
        //   let targetId = "pop-" + $(item).attr("id");
        //   $(item).parents(".filter").addClass("chk");
        //   $("#" + targetId).prop("checked", $(item).prop("checked")).attr("data-checked", "Y");
        //   $("#" + targetId).parents(".filter-pop").find(".tab-btn").eq($("#" + targetId).parents(".tab-con").index()).addClass("chk");
        // });

        // 필터 팝업 검색 버튼 click
        $(".filter-pop .srch-btn").on("click", function() {
          let findFilterId = $(this).parents(".filter-pop").find(".opt-group input").eq(0).attr("id").replace("pop-", "");
          let targetId;
          
          $(this).parents(".filter-pop").find(".opt-group input").each((idx, item) => {
            targetId = $(item).attr("id").replace("pop-", "");
            $("#" + targetId).prop("checked", $(item).prop("checked"));
            if ($(item).prop("checked")) {
              $(item).attr("data-checked", "Y");
            } else {
              $(item).removeAttr("data-checked");
            }
          });
          $('[data-apply="N"]').removeAttr("data-apply");

          if($("#" + findFilterId).parents(".opt-group").find("input:checked").length > 0) {
            $("#" + findFilterId).parents(".filter").addClass("chk");
          } else {
            $("#" + findFilterId).parents(".filter").removeClass("chk");
          }

          // ( 팝업 닫기 )
          // 지도보기 팝업일 경우
          $(this).parents(".filter-pop").fadeOut(200).removeClass("on");
          if(!$(".layer-popup.map-pop").hasClass("on")) {
            $("body").removeClass("stop-scroll");
          }
        });

        // 필터 팝업 리셋 버튼 click
        $(".filter-pop .reset-btn").on("click", function() {
          $(this).parents(".filter-pop").find(".tab-btn").removeClass("chk");
          $(this).parents(".filter-pop").find(".opt-group input").prop("checked", false).attr("data-apply", "N");
        });

        // 체크박스 & 라디오 change
        $(document).on("click", ".filter-pop .opt-group input", function() {
        // $(".filter-pop .opt-group input").on("change", function() {
          $(this).attr("data-apply", "N");
          filterMark(false, $(this));
        });

        // 팝업 체크박스 & 라디오 change
        $(document).on("click", ".filter:has(.icon-txt-btn.close) .opt-group input", function() {
        // $(".filter:has(.icon-txt-btn.close) .opt-group input").on("change", function() {
          filterMark($(this), false);
        });
        $(document).on("click", ".filter:has(.icon-txt-btn.open) .opt-group input", function() {
        // $(".filter:has(.icon-txt-btn.open) .opt-group input").on("change", function() {
          let targetId = "pop-" + $(this).attr("id");

          if($(this).is(":radio")) {  // 라디오인 경우
            let name =  $("#" + targetId).attr("name");
            $(`input[name="${name}"]`).prop("checked", false);
            $(`input[name="${name}"]`).removeAttr("data-checked");

            $("#" + targetId).prop("checked", true);
            $("#" + targetId).attr("data-checked", "Y");
          } else {
            $("#" + targetId).prop("checked", $(this).prop("checked"));

            if ($(this).prop('checked')) {
              $("#" + targetId).attr("data-checked", "Y");
            } else {
              $("#" + targetId).removeAttr("data-checked");
            }
          }

          filterMark($(this), $("#" + targetId));
        });

        // 필터 초기화
        $(".filter .reset-btn:not(.all)").on("click", function() {
          let targetId = $(this).parents(".filter").find(".opt-group input").eq(0).attr("id");
  
          $(this).parents(".filter").find("input").each(function(idx, item) {
            inputReset($(item));
          });
          $(this).parents(".filter").removeClass("chk");
  
          if($(this).parents(".filter").find(".icon-txt-btn.open").length > 0) {
            $("#pop-" + targetId).parents(".filter-pop").find("input").prop("checked", false).removeAttr("data-checked");
            $("#pop-" + targetId).parents(".filter-pop").find(".tab-btn").removeClass("chk");
          }
        });

        // 필터 전체 초기화
        $(".filter-area .reset-btn.all").on("click", function() {
          $(".filter").removeClass("chk");
          $(".filter-pop .tab-btn").removeClass("chk");
          $(this).parents(".filter-area").find("input").each(function(idx, item) {
            inputReset($(item))
          });
          $(".filter-pop .opt-group input").prop("checked", false).removeAttr("data-checked");
        });
      }
      // ---- 필터 END ----

      // 숫자 ,
      $("input.num").on("input", function() {
        inputNumChange($(this));
      });
      $("input.num").each(function(idx, item) {
        inputNumChange($(item));
      })

      // [Checkbox] 전체체크박스
      $(".form-checkbox .Chk-All").on("click", function() {
        if($(this).is(":checked")) {
          $(this).parents(".opt-group").find(".form-checkbox input[type='checkbox']").prop("checked", true)
        } else {
          $(this).parents(".opt-group").find(".form-checkbox input[type='checkbox']").prop("checked", false)
        }

        
      })
      let chkTotal = 0;
      let chkChecked = 0;
      $(".form-checkbox input[type='checkbox']").click(function() {
				chkTotal = $(this).parents(".opt-group").find(".form-checkbox input[type='checkbox']").not(".Chk-All").length;
				chkChecked = $(this).parents(".opt-group").find(".form-checkbox input[type='checkbox']:checked").not(".Chk-All").length;

        if(chkTotal != chkChecked) {
          $(this).parents(".opt-group").find(".Chk-All").prop("checked", false);
        } else {
          $(this).parents(".opt-group").find(".Chk-All").prop("checked", true);
        }
			});

      // 필터 더보기 버튼 (4개 이상 시)
      $(".filter .icon-txt-btn.close").on("click", function() {
        if($(this).hasClass("on")) {
          $(this).removeClass("on").find("span").text("더보기");
        } else {
          $(this).addClass("on").find("span").text("닫기");
        }
      });
    },
    formRangeCreate: function() {
      

      if($(".form-range").length > 0) {
        $rangeSlider = $(".form-range").find(".slider-range");
        $rangeAmountMore = $(".form-range").find(".form-input.more input");
        $rangeAmountLess = $(".form-range").find(".form-input.less input");
        rangeData = JSON.parse($rangeSlider.attr("data-range"));
      
        $rangeSlider.slider({
            range: true,
            min: rangeData.min,
            max: rangeData.max,
            values: [rangeData.minValue, rangeData.maxValue],
            slide: function(event, ui) {
                $rangeAmountMore.val(ui.values[0]);
                $rangeAmountLess.val(ui.values[1]);
      
                inputNumChange($rangeAmountMore);
                inputNumChange($rangeAmountLess);
            }
        });
      
        $rangeAmountMore.val($rangeSlider.slider("values", 0));
        $rangeAmountLess.val($rangeSlider.slider("values", 1));
        inputNumChange($rangeAmountMore);
        inputNumChange($rangeAmountLess);
      
        $rangeAmountMore.on("change", function() {
          let newValue = parseInt(inputNumChangeRest($(this).val()));
          $rangeSlider.slider("values", 0, parseInt(inputNumChangeRest($(this).val())));
          if (newValue >= $rangeSlider.slider("values", 1) || newValue < rangeData.minValue) {
            newValue = rangeData.minValue;
            $(this).val(newValue);
          }
          $rangeSlider.slider("values", 0, newValue);
          inputNumChange($rangeAmountMore);
        });
        $rangeAmountLess.on("change", function() {
          let newValue = parseInt(inputNumChangeRest($(this).val()));
          if (newValue <= $rangeSlider.slider("values", 0) || newValue > rangeData.maxValue) {
            newValue = rangeData.maxValue;
            $(this).val(newValue);
          }
          $rangeSlider.slider("values", 1, newValue);
          inputNumChange($rangeAmountLess);
        });
      }

      if($(".form-range .form-group input").is(":disabled")){
        $(".form-range").find(".slider-range").slider({
          disabled:true
        })
      }
    },
    skeletonFn: function() {
      // @ 페이지 로딩 완료되면, 하단 스크립트가 실행되어야합니다. (일괄적)
      $(".skeleton-loading").not(".each").fadeOut(400, function() {
        $(".skeleton-loading").not(".each").remove();
      });

      // @ each가 붙어있는 스켈레톤은 개별적으로 삭제 되는 스켈레톤입니다.
      // $(".skeleton-loading.each").fadeOut(400, function() {
      //   $(".skeleton-loading.each").remove();
      // });
    }
  };
})();

$(window).on("load", function () {
  commonScript.init();
  commonScript.commonFn();
  commonScript.tripSrchBarFn();
  commonScript.scrollFn();
  commonScript.resizeFn();
  commonScript.swiperFn();
  commonScript.formChkFn();
  commonScript.formRangeCreate();
});

// 스크롤모션
function scrollMotionTrigger() {
  if ($(".scroll-motion").size() > 0) {
    $(".scroll-motion:visible").each(function (q) {
      gsap.to($(this), {
        scrollTrigger: {
          trigger: $(this),
          start: () => "top 85%",
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

const formReCheck = () => {
  var newRoom = $(".trip-sel-area .room-con-box:last-child").clone(true); // 객실
  var childInfoClone = $(".trip-sel-area .trip-room .room-con-box:last-child .child-chk:last-child").clone(true); // 아동

  $(".form-search, .form-input").each(function(q){
    $(this).off().on("focusin", function() {
      // $(this).addClass("focus");
      if(!$(this).find("input").is('[readonly]')) {
        if($(this).find("input").val() !== ""){
          $(this).find(".delete-btn").show();
        }
      }

      if($(this).parents().hasClass("trip-input")){
        $(this).parents(".trip-input").addClass("on");
        $(this).parents(".trip-input-div").find(".trip-recent-srch").addClass("on");
        $(this).parents(".trip-sel-area").find(".trip-room").removeClass("on");

        if($(".stay-day").hasClass("on")){
          $(".stay-day").removeClass("on");
          $(".stay-day .day-list").stop(true, true).slideUp(200);
        }
      }

      if($(this).parents(".trip-sel-area").find(".trip-date").hasClass("on")){
        $(this).parents(".trip-sel-area").find(".trip-date").removeClass("on");
      }

      if($(".stay-day").hasClass("on")){ // 숙박일 수 열려 있는 경우 닫기
        $(".stay-day").removeClass("on");
        $(".stay-day .day-list").stop(true, true).slideUp();
      }
    });

    $(this).find("input").off().on("focusout", function(){
      // $(this).parents(".form-search, .form-input").removeClass("focus")
      setTimeout(function(){
        $(".form-search, .form-input").eq(q).find(".delete-btn").hide();
      }, 150)

      if($(this).parents().hasClass("trip-input")){
        $(this).parents(".trip-input").removeClass("on");
      }

      // 검색바 내의 인풋들
      if($(this).parents().hasClass("room-con-box")){
        if(parseInt($(this).val()) + parseInt($(this).parents(".person-wrap").siblings().find("input").val()) > 9){
          alert("객실 당 최대인원은 9명입니다.");
          $(this).closest(".person").find(".plus").addClass("disabled");
          $(this).closest(".person").find(".minus").removeClass("disabled");
          $(this).val(9 - parseInt($(this).parents(".person-wrap").siblings().find("input").val()))
          $(this).attr("value", (9 - parseInt($(this).parents(".person-wrap").siblings().find("input").val())))
          $(this).attr("data-val", (9 - parseInt($(this).parents(".person-wrap").siblings().find("input").val())))
          $(this).data("val", (9 - parseInt($(this).parents(".person-wrap").siblings().find("input").val())))
          
        }else if(parseInt($(this).val()) + parseInt($(this).parents(".person-div").siblings(".person-div").find(".person").find("input").val()) == 9){
          $(this).parents(".room-con-div").find(".plus").addClass("disabled");
          $(this).parents(".room-con-div").find(".minus").removeClass("disabled");
        }else{
          $(this).parents(".room-con-div").find(".plus").removeClass("disabled");
          $(this).attr("data-val", $(this).val());
        }
        
        if($(this).closest(".person-wrap").index() == 1){ // 아동
          if($(this).val() == ""){
            $(this).val(0);
            $(this).parents(".person").find(".minus").addClass("disabled")
            $(this).parents(".room-con-box").find(".child-chk-div").removeClass("on");
            $(this).parents(".room-con-box").find(".child-chk-div .child-chk .form-input input").val("")
          }

          $(this).closest(".person-wrap").find(".minus").removeClass("disabled");
          $(this).closest(".room-con-box").find(".child-chk-div .child-chk").not(".child-chk:first-child").remove();
          $(this).closest(".room-con-box").find(".child-chk-div").addClass("on");

          for(var i=1; i<$(this).closest(".person-wrap").find("input").val(); i++){
            $(this).closest(".room-con-box").find(".child-chk-div").append(childInfoClone);
            childInfoClone = $(this).closest(".room-con-box").find(".child-chk:last-child").clone(true);
            $(this).closest(".room-con-box").find(".child-chk:last-child .tit .num").text($(this).closest(".room-con-box").find(".child-chk").length)
          }

          if($(this).val() == 0){
            $(this).closest(".person-wrap").find(".minus").addClass("disabled");
            console.log(123)
            $(this).parents(".room-con-box").find(".child-chk-div").removeClass("on");
            $(this).parents(".room-con-box").find(".child-chk-div .child-chk .form-input input").val("")
          }
        }else{
          if(!$(this).parents().hasClass("child-chk-div")){
            if($(this).val() == "" || $(this).val() < 1){
              alert("1~9 사이의 성인 인원 수를 입력해 주세요.")
              $(this).val(1)
              $(this).parents(".person").find(".minus").addClass("disabled")
            }else if($(this).val() == 1){
              $(this).parents(".person").find(".minus").addClass("disabled");
            }else if($(this).val() == 9){
              $(this).parents(".person").find(".minus").removeClass("disabled");
            }
          }
        }

        if(parseInt($(this).parents(".room-con-div").find(".form-input").eq(0).find("input").val()) + parseInt($(this).parents(".room-con-div").find(".form-input").eq(1).find("input").val()) <= 8){
          $(this).parents(".room-con-div").find(".plus").removeClass("disabled")
        }else{
          $(this).parents(".room-con-div").find(".plus").addClass("disabled")
        }

        totalPeopleNumFn();
      }

      // 객실 수
      if($(this).parents().hasClass("room-tit-wrap")){
        if($(this).val() == "" || $(this).val() > 8 || $(this).val() < 1){
          alert("1~8 사이의 객실 수를 입력해 주세요.");
          $(this).val(1);
          $(".room-con-box").not(":first-child").remove();
          $(this).parents(".room-num").find(".minus").addClass("disabled");
          $(this).parents(".room-num").find(".plus").removeClass("disabled");
        }else{
          $(this).data("val", $(this).val())
          $(this).attr("data-val", $(this).val())
          $(this).closest(".room-num").find(".minus").removeClass("disabled");
          if(parseInt($(this).val()) < $(".trip-sel-area .room-con-box").length){
            _roomNum = $(this).data("val");
            $(".trip-sel-area .room-con-box").slice(_roomNum).remove()
            
            if(_roomNum == 1){
              $(this).parents(".room-num").find(".minus").addClass("disabled");
            }else{
              $(this).closest(".room-num").find(".plus").removeClass("disabled");
            }
          }else{
            for(var i=_roomNum; i<$(this).closest(".room-num").find("input").val(); i++){
              $(".room-con-wrap").append(newRoom);
              newRoom = $(".trip-sel-area .room-con-box:last").clone(true);
              $(".trip-sel-area .room-con-box:last .form-input.adult input").val(2);
              $(".trip-sel-area .room-con-box:last .form-input.adult input").data("val", 2);
              $(".trip-sel-area .room-con-box:last .child-chk-div").removeClass("on");
              $(".trip-sel-area .room-con-box:last .child-chk-div .child-chk").not(":last-child").remove();
              $(".trip-sel-area .room-con-box:last .form-input.child input").val(0);
              $(".trip-sel-area .room-con-box:last .form-input.child input").data("val", 0);
              $(".trip-sel-area .room-con-box:last .person-wrap:nth-child(2) .plus-minus-input .minus").addClass("disabled");
              $(".trip-sel-area .room-con-box:last .title .num").text($(".trip-sel-area .room-con-box").length);
              
              if($(".trip-sel-area .room-con-box").length == 8){
                $(this).closest(".room-num").find(".plus").addClass("disabled");
              }
            }
          }
          
        }
        _roomNum = parseInt($(".room-num input").val())
        $(".room-info").eq(0).find(".num").text($(this).val())

        totalPeopleNumFn();
      }
    })

    $(this).find(".delete-btn").off().on("click", function(){
      $(this).hide();
      $(this).parents(".input-btn-wrap").siblings("input").attr("value", "").val("").focus();

      if($(this).parents().hasClass("child-chk-div")){
        $(this).parents(".child-chk").find("input:read-only").val("");
      }
    })

    $(this).find("input").on("keyup", function(e) {
      if(!$(this).is('[readonly]')){
        if($(this).val() !== "") {
          $(this).closest(".form-search, .form-input").find(".delete-btn").show();
        } else {
          $(this).closest(".form-search, .form-input").find(".delete-btn").hide();
        }
        if($(this).parents().hasClass("birth")){
          const input = e.target;
          let value = input.value;

          // 숫자와 하이픈(`-`)만 유지, 다른 문자는 제거
          value = value.replace(/[^0-9-]/g, "");

          // 입력값에서 숫자만 추출
          const numericValue = value.replace(/-/g, "");
          
          // 최대 8자리 숫자로 제한
          if (numericValue.length > 8) {
            numericValue = numericValue.slice(0, 8);
          }

          // 숫자 입력에 따라 하이픈 자동 추가 (사용자가 입력한 하이픈 유지)
          let formattedValue = numericValue;
          if (numericValue.length >= 7) {
            formattedValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4, 6)}-${numericValue.slice(6)}`;
          } else if (numericValue.length >= 5) {
            formattedValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
          }

          // 사용자 입력한 하이픈을 병합하여 결과 반영
          if (value.includes("-")) {
            const manualHyphens = value.split("").filter(char => char === "-").length;
            const autoHyphens = formattedValue.split("").filter(char => char === "-").length;
            if (manualHyphens > autoHyphens) {
              formattedValue = value;
            }
          }
    
          // 입력값 업데이트
          input.value = formattedValue;

          if (e.keyCode == 8) {
            $(this).parents(".child-chk").find("input:read-only").val("");
          }
        }
      }
    });

    if($(this).parents().hasClass("room-sel-wrap")){
      $(this).find("input").on("keypress", function(e) {
        if(e.keyCode && e.keyCode == 13){
          $(this).blur();
          $(this).parents(".room-num").find(".form-input input").val(_roomNum)
          $(this).parents(".room-num").find(".form-input input").attr("value", _roomNum)
          // $(this).parents(".room-num").find(".form-input input").attr("data-val", _roomNum)
        }
      });
    }
  });

  $(".form-checkbox input, .form-checkbox label").on("click", function(e){
    if (
      $(this).parents().hasClass("compare-btn") ||
      $(this).parents(".filter-pop").length > 0 ||
      $(this).parents(".filter").length > 0
    ) {
      // 하나라도 false면 return으로 종료
      return;
    }

    // 모든 조건을 통과했을 경우 실행
    e.stopPropagation();
  })
}

// 우측 하단 퀵메뉴 및 탑버튼
const quickRePosition = () => {
  var bottomGap = 20; // 20 = footer와 quick 사이 여백
  
  // 퀵, top버튼 footer만나면 position 변경
  // (비교하기 팝업 하단에 fix 여부 확인)
  if($(".quick-fixed-area").size() > 0){
    if ($(window).scrollTop() + window.innerHeight >= $("footer").offset().top + (!$(".chk-pop").hasClass("fix") || !$(".toggle-btn.compare").hasClass("on") ? 0 : fixBottomoGap - bottomGap)) {
      $(".quick-fixed-area").css({
        "position": "absolute",
        "bottom": $("footer").innerHeight() + bottomGap
      });
    } else {
      $(".quick-fixed-area").css({
        "position": "fixed",
        "bottom": `${bottomGap + (!$(".chk-pop").hasClass("fix") || !$(".toggle-btn.compare").hasClass("on") ? 0 : fixBottomoGap - bottomGap)}px`
      });
    }
  }
}

const getNewDate = () => {
  // 체크인 날짜 세팅 - 오늘 기준 +7일
  let today = new Date();
  let checkInDate = today.setDate(today.getDate() + 14);
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  month = month >= 10 ? month : "0" + month; //month 두자리로 출력
  day = day >= 10 ? day : "0" + day; //day 두자리로 출력

  $(".chk-in-out").eq(0).find(".year").text(year);
  $(".chk-in-out").eq(0).find(".month").text(month);
  $(".chk-in-out").eq(0).find(".date").text(day);

  // 체크아웃 날짜 세팅 - 체크인에 +1일
  let tomorrow = today.setDate(today.getDate() + 1);
  let tomorrowYear = today.getFullYear();
  let tomorrowMonth = today.getMonth() + 1;
  let tomorrowDay = today.getDate();
  tomorrowMonth = tomorrowMonth >= 10 ? tomorrowMonth : "0" + tomorrowMonth; //month 두자리로 출력
  tomorrowDay = tomorrowDay >= 10 ? tomorrowDay : "0" + tomorrowDay; //day 두자리로 출력

  $(".chk-in-out").eq(1).find(".year").text(tomorrowYear);
  $(".chk-in-out").eq(1).find(".month").text(tomorrowMonth);
  $(".chk-in-out").eq(1).find(".date").text(tomorrowDay);
}

// 요일 세팅
const getDayOfWeek = () => {
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  // 오늘
  let today = new Date();
  var day = today.getDay();
  var dayLabel = week[day];

  $(".chk-in-out").eq(0).find(".day").text(dayLabel)
  
  // 내일
  let tomorrow = new Date().setDate(new Date().getDate() + 1);
  today.setDate(today.getDate() + 1);
  let dayOfWeek = today.getDay();
  let dayName = week[dayOfWeek];

  $(".chk-in-out").eq(1).find(".day").text(dayName)
}

// 요일 구하기
const inputGetDay = (dateString) => {
  // 입력된 문자열을 Date 객체로 변환
  const date = new Date(dateString);
  
  // 요일을 배열로 정의 (일요일부터 토요일까지)
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  // Date 객체에서 요일을 숫자로 반환 (0: 일요일 ~ 6: 토요일)
  const dayOfWeek = date.getDay();

  // 요일 배열에서 해당하는 요일 반환
  return daysOfWeek[dayOfWeek];
}

const checkInTxtFn = () => { // 체크인 텍스트 날짜 입력하는 공통 함수
  $(".chk-in-out").eq(0).find(".year").text($(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[0])
  $(".chk-in-out").eq(0).find(".month").text($(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[1])
  if(parseInt($(".calendar .week-div .check.in").text()) < 10){
    $(".chk-in-out").eq(0).find(".date").text('0'+$(".calendar .week-div .check.in .date").text())
  }else{
    $(".chk-in-out").eq(0).find(".date").text($(".calendar .week-div .check.in  .date").text())
  }
  $(".chk-in-out").eq(0).find(".day").text(inputGetDay(`'${$(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[0]}-${$(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[1]}-${$(".calendar .week-div .check.in").text().split("체")[0]}'`))
}
const checkOutTxtFn = () => { // 체크아웃 텍스트 날짜 입력하는 공통 함수
  $(".chk-in-out").eq(1).find(".year").text($(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[0])
  $(".chk-in-out").eq(1).find(".month").text($(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[1])
  if(parseInt($(".calendar .week-div .check.out").text()) < 10){
    $(".chk-in-out").eq(1).find(".date").text('0'+$(".calendar .week-div .check.out .date").text())
  }else{
    $(".chk-in-out").eq(1).find(".date").text($(".calendar .week-div .check.out .date").text())
  }
  $(".chk-in-out").eq(1).find(".day").text(inputGetDay(`'${$(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[0]}-${$(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div select option:selected").text().split("-")[1]}-${$(".calendar .week-div .check.out").text().split("체")[0]}'`))
}

// 객실 성인, 아동 합산 수 구하기
const totalPeopleNumFn = () => {
  _totalAdultNum = 0;
  _totalChildNum = 0;

  $(".room-con-box").each(function(){
    $(this).find(".adult").each(function(){
      _totalAdultNum += Number($(this).find("input").val()) // 모든 객실 성인 수 합산
    })
    $(this).find(".child").each(function(){
      _totalChildNum += Number($(this).find("input").val()) // 모든 객실 아동 수 합산
    })
  })

  $(".room-info").eq(1).find(".num").text(_totalAdultNum) // 객실 바 성인 수에 합산 수 넣기
  $(".room-info").eq(2).find(".num").text(_totalChildNum) // 객실 바 아동 수에 합산 수 넣기
}

// [Select] 화살표 모션
const selectMotionFunc = () => {
  $(".form-select select").off().focus(function(){
    $(this).parents(".form-select").addClass("active");
  });

  $(".form-select select").blur(function(){
    $(this).data('isopen', false);
    $(this).parents(".form-select").removeClass("active");
  });

  $(".form-select select").on("change", function(){
    // alignWidth($(this));

    $(this).closest(".form-select").removeClass("active");
  });
    
  $(".form-select select").on("mouseup", function(e) {
    let open = $(this).data("isopen");

    if(open) {
      $(this).parents(".form-select").removeClass("active");
    } else {
      $(this).parents(".form-select").addClass("active");
    }
    
    $(this).data("isopen", !open);
  });

  function alignWidth(item){
    var $select = item;
    var $temp = $('<div>').css({
      'position': 'absolute',
      'visibility': 'hidden',
      'white-space': 'nowrap'
    }).appendTo('body');
    var selectedText = item.find('option:selected').text();
    $temp.text(selectedText);
    var newWidth = $temp.width();
    $select.width(newWidth); 
    $temp.remove()
  }

  $(".form-select.align").each(function(){
    alignWidth($(this).find("select"));
  });
}

// 공통 팝업
function openPopup(popName, comebackEl) {
  let POPUP = $(popName);
  let COMEBACKEL = $(comebackEl);

  if (!POPUP.hasClass("on")) {
    POPUP.fadeIn(200).addClass("on");

    // 지도보기 팝업일 경우
    if (POPUP.hasClass("map-pop")) {
      $(".filter-area").hide(0, function() {
        $(".filter-area").fadeIn(200);
      });
    }
  } else {
    POPUP.css("display", "block");
  }

  // 팝업 내 스크롤 이동 후, 닫고 다시 열었을때 팝업 스크롤 맨 위로 원복
  POPUP.find(".scroll-area").scrollTop(0).scrollLeft(0);
  POPUP.find(".filter-pop-wrap").length > 0 && POPUP.find(".filter-pop-wrap").scrollTop(0).scrollLeft(0);
  POPUP.hasClass("map-pop") && $(".filter-area .scroll-area").scrollTop(0).scrollLeft(0);

  setTimeout(() => {
    $("body").addClass("stop-scroll");
  }, 200)

  // 팝업 닫기 버튼 클릭
  POPUP.find(".popclose-btn").off("click.popup").on("click.popup", function() {
    closePopup(POPUP, COMEBACKEL);
  });

  // 팝업 외부 클릭
  $(document).off("mouseup.popupClose").on("mouseup.popupClose", function(e) {
    if (POPUP.has(e.target).length === 0 && e.target.tagName !== "HTML" && !$(e.target).closest(".filter-area").length) {
      closePopup(POPUP, COMEBACKEL);
      $(document).off("mouseup.popupClose");
    }
  });
}

// 팝업 닫기 함수
function closePopup(POPUP, COMEBACKEL) {
  POPUP.fadeOut(200, function() {
    if(POPUP.hasClass("filter-pop")) {  // [필터 팝업], 필터 값 복구
      filterPopupRestore(POPUP);
    }
    COMEBACKEL.focus();
    if(POPUP.hasClass("compare-pop")) { // [비교하기 팝업2]
      POPUP.find(".compare-list").empty();
      for (var i = 1; i <= 3; i++) {
        POPUP.find(".compare-list").append(compareItemEl);
        compareItemEl = POPUP.find(".compare-list > .item:last").clone(true); // 새로운 복사본 생성
      }
    }
  }).removeClass("on");

  // 지도보기 팝업이 아닐 경우 스크롤 방지 클래스 제거
  if (!$(".layer-popup.map-pop").hasClass("on") || !POPUP.hasClass("filter-pop")) {
    $("body").removeClass("stop-scroll");
    $("#wrap").removeClass("stop-scroll");
  }
}

// 메인 팝업
let mainPopupSwiper = undefined;
function openPopupMain(popName) {
  let POPUP = $(popName);

  if(POPUP.find(".pop-swiper").size() > 0){
    if($(".pop-swiper").length > 0) popMainSwiper();
  }

  if(!POPUP.hasClass("on")) {
    POPUP.addClass("on");
  }

  $("#wrap").removeClass("stop-scroll");
  $("body").removeClass("stop-scroll");
  
  if($(".main-pop .pop-area.on").length == 2) { // 팝업이 2개일 경우
    $("#wrap").addClass("stop-scroll");
  } else { // 팝업이 1개일 경우
    $("body").addClass("stop-scroll");
  }
  
  POPUP.find(".popclose-btn").off("click").on("click", function() {
    let closeClickPop = $(this).closest(".pop-area");

    if($(".main-pop .pop-area.on").length == 2) { // 팝업이 2개일 경우
      closeClickPop.hide(200).fadeOut(200, function(){
        closeClickPop.removeClass("on");
      });
      $("#wrap").removeClass("stop-scroll");
      $("body").addClass("stop-scroll");
      POPUP.parents(".main-pop").css({"min-width":"unset", left:""});
    } else {  // 팝업이 1개일 경우
      closeClickPop.fadeOut(200, function() {
        closeClickPop.parents(".main-pop").removeClass("on");
        closeClickPop.removeClass("on");
        $("body").removeClass("stop-scroll");
      });
    }
  });

  // 팝업 외부 클릭
  $(document).off("mouseup.popupClose").on("mouseup.popupClose", function(e) {
    if(!$(e.target).closest(".pop-area").length && e.target.tagName !== "HTML"){
      $(".main-pop").fadeOut(200, function(){
        $(".main-pop").removeClass("on");
        $(".main-pop .pop-area").removeClass("on");
        $("#wrap").removeClass("stop-scroll");
        $("body").removeClass("stop-scroll");
      })
      $(document).off("mouseup.popupClose");
    }
  });
}

// 메인 팝업 swiper
function popMainSwiper() {
  let popSwiperSlideLength = $('.pop-swiper .swiper-slide').length;

  mainPopupSwiper = new Swiper(".pop-swiper.swiper-container", {
    slidesPerView: 1,
    observer: true,
    observeParents: true,
    touchRatio: popSwiperSlideLength > 1 ? 1 : 0,
    speed: popSwiperSlideLength > 1 ? 400 : 0,
    loop: popSwiperSlideLength > 1 ? true: false,
    watchOverflow: true,
    autoplay: popSwiperSlideLength > 1 ? {
      delay: 4000,
      disableOnInteraction: false,
    } : false,
    pagination: {
      el: ".pop-swiper .swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".pop-swiper .swiper-button-next",
      prevEl: ".pop-swiper .swiper-button-prev",
    },
  });

  $('.pop-swiper .autoplay-btn').click(function () {
    if ($(this).hasClass('on')) {
      mainPopupSwiper.autoplay.start();
      $(this).removeClass('on');
    } else {
      mainPopupSwiper.autoplay.stop();
      $(this).addClass('on');
    }
  })
}

// 지도보기 마커
function mapHotelList(){
  $(".hotel-marker").each(function(){
    if($(this).hasClass("on")){
      $(this).find(".marker-con").show();
    }
    
    if($(".pop-filter-layout").size() <= 0){
      $(this).on("mouseenter", function(){
        $(".hotel-marker").removeClass("on");
        $(".hotel-marker .marker-con").hide();
        $(this).addClass("on");
        $(this).find(".marker-con").show();
      });
    }
  });
}

// [필터 팝업] * 표시
function filterMark(inputChk, inputPopChk) {
  if(inputChk) {
    if(inputChk.parents(".opt-group").find("input:checked").length > 0) {
      inputChk.parents(".filter").addClass("chk");
    } else {
      inputChk.parents(".filter").removeClass("chk");
    }
  }

  if(inputPopChk) {
    if(inputPopChk.parents(".form-checkbox").length > 0) { // 체크박스
      if(inputPopChk.parents(".tab-con").find("input:checked").length > 0) {
        $(inputPopChk).parents(".filter-pop").find(".tab-btn").eq(inputPopChk.parents(".tab-con").index()).addClass("chk");
      } else {
        $(inputPopChk).parents(".filter-pop").find(".tab-btn").eq(inputPopChk.parents(".tab-con").index()).removeClass("chk");
      }
    } else if(inputPopChk.parents(".form-radio").length > 0) { // 라디오
      if(inputPopChk.parents(".tab-con").find("input:checked").length > 0) {
        $(inputPopChk).parents(".filter-pop").find(".tab-btn").removeClass("chk");
        $(inputPopChk).parents(".filter-pop").find(".tab-btn").eq(inputPopChk.parents(".tab-con").index()).addClass("chk");
      }
    }
  }
}

// 상세 더보기 버튼 (3줄 이상 시)
function txtChkFunc(txtItem) {
  txtItem.find(".txt-chk").each((idx, item) => {
    if($(item).find(".txt").innerHeight() > 50) { // 2줄 크기 48px + 여유 2px
      $(item).siblings(".btn-wrap").show();

      $(item).siblings(".btn-wrap").find(".icon-txt-btn.close").off().on("click", function() {
        if($(this).hasClass("on")) {
          $(this).removeClass("on").find("span").text("더보기");
          $(item).css("max-height", 48);  // 48px은 2줄 크기로 측정
        } else {
          $(item).css("max-height", "unset");
          $(this).addClass("on").find("span").text("닫기");
        }

        setTimeout(()=> {
          ScrollTrigger.refresh();
        }, 100);
      })
    } else {
      $(item).siblings(".btn-wrap").hide();
    }
  });
};

// 필터 팝업, 필터 값 복구
const filterPopupRestore = (POPUP) => {
  POPUP.find('[data-apply="N"]').prop("checked", false);
  POPUP.find('[data-checked="Y"]').prop("checked", true);
  POPUP.find('[data-apply="N"]').removeAttr("data-apply");

  POPUP.find(".tab-con").each((idx, item) => {
    if($(item).find(".opt-group input:checked").length > 0) {
      $(item).parents(".filter-pop").find(".tab-btn").eq($(item).index()).addClass("chk");
    } else {
      $(item).parents(".filter-pop").find(".tab-btn").eq($(item).index()).removeClass("chk");
    }
  });
}

// 만 나이 계산
function calcFullAgeFn(birthdate, confirmBtn) {
  // 생년, 월, 일 추출

  const year = parseInt(birthdate.slice(0, 4), 10);
  const month = parseInt(birthdate.slice(4, 6), 10);
  const day = parseInt(birthdate.slice(6, 8), 10);

  // 체크인 날짜
  const today = new Date();
  const chkInYear = parseInt($(".chk-in-out").eq(0).find(".date-txt .year").text());
  const chkInMonth = parseInt($(".chk-in-out").eq(0).find(".date-txt .month").text());
  const chkInDate = parseInt($(".chk-in-out").eq(0).find(".date-txt .date").text());

  const date = new Date(year, month - 1, day); // 월은 0부터 시작하므로 -1
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    alert("잘못된 생년월일입니다. 올바른 날짜를 입력해 주세요.");
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").focus();
    return;
  }

  if (date > today) {
    alert("미래 날짜는 생년월일로 입력할 수 없습니다.");
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").focus();
    return;
  }

  // 만나이 계산
  let chkInAge = chkInYear - year;

  if (chkInMonth < month || (chkInMonth === month && chkInDate < day)) {
    chkInAge--; // 생일이 아직 지나지 않은 경우 만나이에서 1을 뺌
  }

  return chkInAge;
}

function grayBtnSwiperFn(){
  var grayBtnSwiper = new Swiper(".gray-btn-swiper", {
    slidesPerView: "auto",
    observer:true,
    observeParents:true,
  });
}

function likeListSwiperFn(){
  if($(".like-list-swiper .swiper-slide").length > 4) {
    var flowSwiper = new Swiper(".like-list-swiper .swiper-container", {
      navigation: {
        nextEl: ".like-list-swiper .swiper-button-next",
        prevEl: ".like-list-swiper .swiper-button-prev",
      },
      slidesPerView: "auto",
      observer:true,
      observeParents:true,
    });
  }
}

function calendarHeiFn(){
  $(".trip-select-div").find(".trip-date .calendar-wrap").show();
  if(!_isFirstOpen){
    _isFirstOpen = true;
    var maxHeight = 0;
    $(".calendar-div .calendar").each(function(i){
      let currentHeight = $(this).outerHeight(true);
        
      if (currentHeight > maxHeight) {
          maxHeight = currentHeight;
      }

      if(maxHeight > $(".trip-sel-area .trip-sel-wrap .trip-date .scroll-area").height()){
        $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-div").height(maxHeight);
        $(".trip-sel-area .trip-sel-wrap .trip-date .scroll-area").height($(".trip-sel-area .trip-sel-wrap .trip-date .calendar-div").height() - 76); // 상하 패딩값
        $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-wrap").css("width", "908px");
      }

      $(this).css("left", 404*i);
      if($(".trip-sel-area").hasClass("resrch")){
        calendarPositionCalFn();
      }
      $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-div").addClass("on");
    })
  }
  $(".trip-select-div").find(".trip-date .calendar-wrap").hide();
  
  $(".trip-select-div").find(".trip-date .calendar-wrap").removeAttr("style", "display:none");
}

function todayCheckFn(){
  $(".year-month-div .form-select").each(function(){
    if(new Date().getMonth() + 1 == parseInt($(this).find("select option:selected").text().split("-")[1]) && new Date().getFullYear() == parseInt($(this).find("select option:selected").text().split("-")[0])){
      $(this).closest(".calendar").find(".week-div > a").each(function(){
        if(parseInt($(this).text()) == new Date().getDate()){
          $(this).addClass("today");
          if(!$(".check.in").hasClass("today")) {  // 서브페이지 검색바에서, today와 checkin이 겹칠 경우,,,
            $(this).append("<span>오늘</span>")
          }
        }
      })
    }
  });
  
  $(".today").prevAll("a").addClass("disabled"); // 오늘 기준 전 날짜 다 disabled 처리
}

function chkInOutFn(){
  // 받아온 날짜에 맞춰 체크인, 체크아웃 class 추가
  $(".year-month-div").each(function(){
    if($(".chk-in-out").eq(0).find(".month").text() == $(this).find("select option:selected").text().split("-")[1] && $(".chk-in-out").eq(0).find(".year").text() == $(this).find("select option:selected").text().split("-")[0]){ // 검색바의 체크인 달과 달력 팝업 내의 달의 텍스트가 같다면
      $(this).closest(".calendar").find(".week-div a").each(function(q){
        if(parseInt($(".chk-in-out").eq(0).find(".date").text()) == $(this).text()){ // 검색바의 체크인 날짜와 달 내의 날짜 텍스트가 같다면
          $(this).addClass("check in");
          $(this).append("<span>체크인</span>");
        }
      });
    }
    if($(".chk-in-out").eq(1).find(".month").text() == $(this).find("select option:selected").text().split("-")[1] && $(".chk-in-out").eq(1).find(".year").text() == $(this).find("select option:selected").text().split("-")[0]){ // 검색바의 체크아웃 달과 달력 팝업 내의 달의 텍스트가 같다면
      $(this).closest(".calendar").find(".week-div a").each(function(q){
        if(parseInt($(".chk-in-out").eq(1).find(".date").text()) == $(this).find("span").text()){ // 검색바의 체크아웃 날짜와 달 내의 날짜 텍스트가 같다면
          $(this).addClass("check out");
          $(this).append("<span>체크아웃</span>");
        }
      });
    }
  });
}

function dateClickFn(){
  // 달력 내 날짜 클릭 (체크인, 체크아웃)
  var isCheck = false;
  var checkInYear; // 체크인 해당 날짜의 년도
  var checkOutYear; // 체크아웃 해당 날짜의 년도
  var checkInMonth; // 체크인 해당 날짜의 월
  var checkOutMonth; // 체크아웃 해당 날짜의 월
  var stayNum; // 숙박일수
  var $date = $(".calendar .week-div > a").not(".disabled"); // disabled를 제외한 달력 날짜

  // 오늘 날짜에 today class 추가
  // todayCheckFn();

  $date.each(function(q){
    $(this).off().on("click", function(){
      if(!$(this).hasClass("disabled")){
        if(!isCheck){ // 체크인 클릭
          isCheck = true;
          $date.removeClass("check in"); // 체크인 class 지우기;
          $date.removeClass("check out"); // 체크아웃 class 지우기;
          $date.removeClass("ing"); // 체크인과 체크아웃 사이 ing class 지우기

          $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-wrap .calendar .week-div > a").not(".in, .ing").find("span").not(".date").remove(); // 체크인과 ing를 제외하고 전체 a 태그에서 날짜 span빼고 다 삭제
          if(!$(this).hasClass("today")){ // 체크인이 오늘이 아닐 경우
            $(".today").append("<span>오늘</span>"); // 오늘 텍스트 추가
          }

          $(".trip-date .checkin-wrap .date-txt").eq(1).addClass("on"); // 체크아웃 날짜 잠시 안보이게 함
          $(".stay-wrap .select-day").text("0박"); // 숙박일수 0박으로 설정
          $(".stay-wrap .stay-day .day-list .list-day").removeClass("on"); // 체크 되어있던 숙박일수 체크해제
          $(this).addClass("check in"); // 체크인 class 추가
          $(this).append("<span>체크인</span>"); // 체크인 텍스트 추가

          checkInTxtFn();// 클릭한 날짜 검색바 영역에 텍스트로 넣기

          if($(this).parents(".calendar").index() + 1 == $(".calendar-div .calendar").length && parseInt($(this).find(".date").text()) == $(this).parents(".calendar").find("a").not(".disabled").length){
            $(".stay-day").addClass("disabled");
          }

          $(".trip-room .room-info-sel .child-chk-div").each(function(){
            if($(this).hasClass("on")){
              $(this).find(".child-chk").each(function(){
                if($(this).find(".form-input:not(.birth) input").val() != ""){
                  var birthdate = $(this).find(".birth").find("input").val();

                  if (!/^\d*$/.test(birthdate)) {
                    birthdate = birthdate.replace(/\D/g, ""); // 숫자만 남김
                  }

                  // 만 나이 계산
                  let age = 0;

                  age = calcFullAgeFn(birthdate);

                  if(age > 17){
                    alert("만 17세까지만 아동에 해당합니다.");
                    $(".trip-date").removeClass("on");
                    $(".trip-room").addClass("on");
                    $(this).find(".birth").find("input").val('');
                    $(this).find(".birth").find("input").attr("value", "")
                    $(this).find(".birth").find("input").data("val", "")
                    $(this).find(".birth").find("input").attr("data-val", "")
                    $(this).find(".birth").find("input").focus();
                    $(this).find(".form-input:last-child input").val('');
                    $(this).find(".form-input:last-child input").attr("value", '');
                    $(this).find(".form-input:last-child input").data("val", '')
                    $(this).find(".form-input:last-child input").attr("data-val", '')
                  }else{
                    if(age !== undefined){
                      $(this).find(".birth").find("input").data("val", $(this).find(".birth").find("input").val())
                      $(this).find(".birth").find("input").attr("data-val", $(this).find(".birth").find("input").val())
                      $(this).find(".form-input:last-child input").val('만 ' + age + '세');
                      $(this).find(".form-input:last-child input").attr("value", '만 ' + age + '세');
                      $(this).find(".form-input:last-child input").data("val", '만 ' + age + '세')
                      $(this).find(".form-input:last-child input").attr("data-val", '만 ' + age + '세')
                    }
                  }
                }
              })
            }
          })
        }else{ // 체크아웃 클릭
          if(!$(this).hasClass("in")){
            isCheck = false;

            $(".trip-date .checkin-wrap .date-txt").eq(1).removeClass("on"); // 체크아웃 날짜 보이게 함
            $(this).addClass("check out"); // 체크아웃 class 추가
            $(this).append("<span>체크아웃</span>"); // 체크아웃 텍스트 추가

            checkOutYear = parseInt($(".calendar .week-div .check.out").closest(".calendar").find("select option:selected").text().split("-")[0]);
            checkInYear = parseInt($(".calendar .week-div .check.in").closest(".calendar").find("select option:selected").text().split("-")[0]);

            if(checkOutYear <= checkInYear){ // 체크아웃 년도가 체크인 년도보다 작거나 같을 경우
              $(".calendar .week-div .check.out").addClass("in");
              $(".calendar .week-div .check.in").addClass("out");
              $(".calendar .week-div .check").eq(0).removeClass("out");
              $(".calendar .week-div .check").eq(1).removeClass("in");
              $(".stay-day").removeClass("disabled");
              
              if($(".today").hasClass("check")){
                $date.not(".ing").find("span").not(".date").remove();
              }else{
                $date.not(".ing, .today").find("span").not(".date").remove();
              }
              
              $date.removeClass("ing");
              $(".calendar .week-div .check.in").append("<span>체크인</span>");
              $(".calendar .week-div .check.out").append("<span>체크아웃</span>");

              // 체크인, 체크아웃 월 및 년도 다시 받아오기
              checkInMonth = parseInt($(".calendar .week-div .check.in").closest(".calendar").find("select option:selected").text().split("-")[1]);
              checkInYear = parseInt($(".calendar .week-div .check.in").closest(".calendar").find("select option:selected").text().split("-")[0]);
              checkOutMonth = parseInt($(".calendar .week-div .check.out").closest(".calendar").find("select option:selected").text().split("-")[1]);
              checkOutYear = parseInt($(".calendar .week-div .check.out").closest(".calendar").find("select option:selected").text().split("-")[0]);

              
              if(checkOutMonth > checkInMonth){ // 체크아웃 월과 체크인 월 비교
                $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
                $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing");
                $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing"); // ex) 9-11월인 경우 10월 전체 다 체크
              }else if(checkOutMonth < checkInMonth){
                $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
                $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing"); // ex) 9-11월인 경우 10월 전체 다 체크
              }

              $(".calendar .week-div .disabled").removeClass("ing");
            }else{ // 체크아웃 년도가 체크인 년도보다 클 경우
              $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing");
              $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
            }

            $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing");
            $(".calendar .week-div .disabled").removeClass("ing");

            
            $(".stay-wrap .stay-day .day-list .list-day").eq($(".ing").length).addClass("on"); // 숙박일수 계산해서 해당 일수에 on class 추가
            $(".stay-wrap .select-day").text($(".stay-wrap .stay-day .day-list .list-day.on").text()); // 계산된 숙박일수 텍스트 보여지게 함

            // 클릭한 날짜 검색바 영역에 텍스트로 넣기
            checkInTxtFn();
            checkOutTxtFn();
            
            // 체크아웃을 90박보다 더 길게 선택 했을 경우
            if(parseInt($(".calendar .week-div .ing").length) > 89){
              var checkInIndex;
              alert("숙박일은 90일을 넘길 수 없습니다.");
              $date.removeClass("ing");
              $(".calendar .week-div .check.out").find("span").not(".date").remove()
              $(".calendar .week-div .check.out").removeClass("check out");
              $(".stay-day .list-day").removeClass("on");
              $(".stay-day .list-day").eq($(".calendar .week-div .ing").length).addClass("on");
              $(".select-day").text( $(".stay-day .list-day").eq($(".calendar .week-div .ing").length).text());
              $date.each(function(q){
                if($(this).hasClass("check in")){
                  checkInIndex =  q;
                }
              });
              $date.eq(checkInIndex + parseInt($(".stay-wrap .select-day").text().split("박")[0])).addClass("check out"); // 클릭한 index값에 숙박일수를 더한 날짜에 체크아웃 설정
              $(".calendar .week-div .check.out").append("<span>체크아웃</span>");
              checkOutTxtFn();
            }else{
              // 달력 닫히고 객실 열림
              $(".trip-sel-area .trip-sel-wrap .trip-date").removeClass("on");
              $(".trip-sel-area .trip-room").addClass("on");
            }
          }
        }
      }
    });
  });
}

function calendarPositionCalFn(){
  // 해당 체크인 캘린더에 on클래스 추가 & left 이동
  $(".calendar.on").removeClass("on");
  if($(".calendar").last().find(".check.in").length > 0) {
    $(".check.in").parents(".calendar").prev().addClass("on");
  } else {
    $(".check.in").parents(".calendar").addClass("on");
  }

  // 캘린더 버튼
  _clickNum = $(".calendar.on").index();
  if(_clickNum == 0){
    $(".calendar-wrap .prev-btn").addClass("disabled")
  } else {
    $(".calendar-wrap .prev-btn").removeClass("disabled")
  }
  if(_clickNum == $(".calendar-div .calendar").length - 2){
    $(".calendar-wrap .next-btn").addClass("disabled")
  } else {
    $(".calendar-wrap .next-btn").removeClass("disabled")
  }
  $(".calendar-div .calendar").each(function(q){
    $(this).css("left", 404*(q-_clickNum));
  });
}


// [Input] input에 num클래스 있는 요소들에 콤마 추가
// [Input] 숫자 입력 시, 콤마 생성
function inputNumChange(numVale) {
  $(numVale).val(Number($(numVale).val().replace(/[^0-9]/g, '')).toLocaleString());
  // $(numVale).val($(numVale).val().replace(/\,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}
// [Input] 숫자 입력 시, 콤마 리셋
function inputNumChangeRest(value) {
  return value.replace(/,/g, '');
}


function chkPopLengthBtnFunc() {
  // [비교하기 팝업], 카운트 숫자
  $Chkpop.find(".count .green-txt").text($Chkpop.find(".chk-list .item.on").length);

  // [비교하기 팝업], 비교하기 버튼 disabled
  if($Chkpop.find(".chk-list .item.on").length >= 2) {
    $Chkpop.find(".compare-pop-btn").prop('disabled', false);
  } else {
    $Chkpop.find(".compare-pop-btn").prop('disabled', true);
  }
}

// data-compare 순서 재할당
function dataCompareVarFunc() {
  let delteIdxChange;

  $(".compare-btn input").filter(":checked").each((idx, item) => {
    $Chkpop.find(".chk-list .item").eq(idx).data("compare", idx + 1);
    $Chkpop.find(".chk-list .item").eq(idx).attr("data-compare", idx + 1);
    
    if($ComparePop.hasClass("on")) {
      $ComparePop.find(".compare-list > .item").eq(idx).data("compare", idx + 1);
      $ComparePop.find(".compare-list > .item").eq(idx).attr("data-compare", idx + 1);
    }

    if(delteIdx < $(item).parents(".product-list .item").data("compare")) {
      delteIdxChange = $(item).parents(".product-list .item").data("compare") - 1;
      $(item).parents(".product-list .item").data("compare", delteIdxChange);
      $(item).parents(".product-list .item").attr("data-compare", delteIdxChange);
    }
  });
}

// [비교하기 팝업] 팝업 아이템 삭제 버튼 클릭
// @ 개발팀 btnCmprDel클릭이벤트 내부에 comparePopDeleteBtn(~) 함수호출해주세요!
function comparePopDeleteBtn (deleteBtn) {
  // 목록 아이템 삭제 & 팝업 아이템 삭제
  // data-compare 순서 재할당
  deleteChkItem = deleteBtn.parents(".item");
  delteIdx = deleteChkItem.data("compare");

  deleteChkItem.remove();
  $Chkpop.find(".chk-list").append(chkItemEl);
  chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성

  $(`.product-list .item[data-compare="${delteIdx}"]`).find($(".compare-btn input")).prop("checked", false);
  $(`.product-list .item[data-compare="${delteIdx}"]`).removeData("compare");
  $(`.product-list .item[data-compare="${delteIdx}"]`).removeAttr("data-compare");

  // data-compare 순서 재할당
  dataCompareVarFunc();

  // 목록 아이템 0개면 [비교하기 팝업] 닫기
  if($(".compare-btn input").filter(":checked").length === 0) $Chkpop.stop().fadeOut(400, function() {$Chkpop.removeAttr("style");}).removeClass("on");
  $Chkpop
  // [비교하기 팝업], 카운트 숫자
  // [비교하기 팝업], 비교하기 버튼 disabled
  chkPopLengthBtnFunc();
}

function comparePopDeleteInnerBtn(deleteBtn){
  // 목록 아이템 삭제 & 팝업 아이템 삭제 & 팝업2 아이템 삭제
  // data-compare 순서 재할당
  deleteChkItem = deleteBtn.parents(".item");
  delteIdx = deleteChkItem.data("compare");

  deleteChkItem.remove();
  $ComparePop.find(".compare-list").append(compareItemEl);
  compareItemEl = $ComparePop.find(".compare-list > .item:last").clone(true); // 새로운 복사본 생성
  
  $Chkpop.find(`.chk-list .item[data-compare="${delteIdx}"]`).remove();
  $Chkpop.find(".chk-list").append(chkItemEl);
  chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성

  $(`.product-list .item[data-compare="${delteIdx}"]`).find($(".compare-btn input")).prop("checked", false);
  $(`.product-list .item[data-compare="${delteIdx}"]`).removeData("compare");
  $(`.product-list .item[data-compare="${delteIdx}"]`).removeAttr("data-compare");

  // data-compare 순서 재할당
  dataCompareVarFunc();

  // 목록 아이템 0개면 [비교하기 팝업], [비교하기 팝업2] 닫기
  if($(".compare-btn input").filter(":checked").length === 0) {
    $ComparePop.fadeOut(200, function() {
      $Chkpop.stop().fadeOut(400, function() {$Chkpop.removeAttr("style");}).removeClass("on");
    }).removeClass("on");
    $("body").removeClass("stop-scroll");
  }

  // [비교하기 팝업], 카운트 숫자
  // [비교하기 팝업], 비교하기 버튼 disabled
  chkPopLengthBtnFunc();
}

function hotelDetailTab(){
  let isAnchorScroll = true;
  let $tabMenuItem = $(".tab-menu .tab-wrap .tab");
  let $tabCont = $(".tab-conts .tab-cont");

  const anchorScrollFunc = (idx) => {
    if (isAnchorScroll) {
      $($tabMenuItem).eq(idx).siblings().removeClass("on");
      $($tabMenuItem).eq(idx).addClass("on");
    }
  }


  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  // 스크롤
  $($tabCont).each((idx, item) => {
    ScrollTrigger.create({
      trigger: item,
      start: () => `top-=50px 160px`,
      end: () => `bottom 160px`,
      // markers: true,
      onEnter: () => {
        anchorScrollFunc(idx);
      },
      onEnterBack: () => {
        anchorScrollFunc(idx);
      },
      onLeaveBack: () => {
        anchorScrollFunc(idx);
      },
    })
  });

  // 클릭
  $($tabMenuItem).off().on("click", function() {
    isAnchorScroll = false;

    let tabContItem = $($tabCont).eq($(this).index());
    let tabContOffset = $(tabContItem).offset().top - 160;

    $("html, body").animate({
      scrollTop: tabContOffset - 50
    }, 400);

    setTimeout(() => {
      isAnchorScroll = true;
      anchorScrollFunc($(this).index())
    }, 400);
  });
}