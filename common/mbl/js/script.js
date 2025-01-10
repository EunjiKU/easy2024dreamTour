let _thisScroll = 0; // 스크롤 up & down 체크위한 변수
let _isScrollTop; // scrollTop 변수
var _totalAdultNum = 0; // 검색바 총 성인 수
var _totalChildNum = 0; // 검색바 총 아동 수
var _chkInDate;
var _chkOutDate;
var _roomNum;
var _dateIndex;
var bottomGap = 20  // 20 = footer와 quick 사이 여백
var fixBottomoGap = 62;
var _isCheck = false;

let $Chkpop;  // [비교하기] 선택 팝업
let $ComparePop;  // [비교하기] 비교 팝업
let chkItemEl;  // [비교하기] 선택 팝업, 아이템
let compareItemEl;  // [비교하기] 비교 팝업, 아이템
let delteIdx; // [비교하기] 삭제 아이템의 인덱스번호
let deleteChkItem;  // [비교하기] 삭제 아이템
var _compareList; // 비교하기 팝업 내 리스트

let $rangeSlider; // [Input, Range]
let $rangeAmountMore; // [Input, Range]
let $rangeAmountLess; // [Input, Range]
let rangeData;  // [Input, Range]

const commonScript = (function () {
  return {
    init:function(){
      if(window.location.href.indexOf("trthotel.easymedia.kr") > -1 || window.location.href.indexOf('127.0.0.1') > -1 || window.location.href.indexOf("http://eznet1.easymedia.kr") > -1 || (window.location.href.indexOf(":4434") > -1 && window.location.href.indexOf("htldev.therailntel.com") > -1 || window.location.href.indexOf("10.86.17.187") > -1 )){
        if($(".all-menu").html() == '')
        {
          $(".all-menu").empty().load("/html/mbl/allMenu.html", function() {
            gsap.delayedCall(0.2, function() {
              commonScript.headerFooterFn();
            });
          });
        }
        else{
          commonScript.headerFooterFn();
        }
        if($("footer").html() == ''){
          $("footer").empty().load("/html/mbl/footer.html");
        }
      }else if($(".all-menu").html() != ''){
        commonScript.headerFooterFn();
      }

      // 팝업
      if($(".layer-popup").hasClass("on")) {
        if($(".layer-popup").hasClass("main-pop")) {
          openPopup($(".layer-popup.main-pop .pop-area"));
        } else {
          openPopup($(".layer-popup.on"));
        }
      }
      // selectMotionFunc();
    },
    headerFooterFn: function(){ 
      if($("#header").length > 0) {

        selectMotionFunc();

        $(".all-menu-btn").on("click", function(){
          $("body").addClass("stop-scroll");
          $(".all-menu").stop(true, true).fadeIn()
        });

        $(".all-menu .close-btn").on("click", function(){
          $("body").removeClass("stop-scroll");
          $(".all-menu").stop(true, true).fadeOut();
        });

        $(".gnb > li").each(function(){
          if($(this).children().hasClass("two-depth")){
            $(this).find(".one-link").on("click", function(){
              if(!$(this).closest("li").hasClass("on")){
                $(this).closest("li").addClass("on");
                $(this).closest("li").find(".two-depth").stop(true, true).slideDown();
              }else{
                $(this).closest("li").removeClass("on");
                $(this).closest("li").find(".two-depth").stop(true, true).slideUp();
              }
            })
          }
        })

        $("#header nav .two-depth .two-link").on("click", function(){
          if(!$(this).hasClass("on")){
            $(this).addClass("on");
            $(this).siblings(".three-depth").stop(true, true).slideUp();
          }else{
            $(this).removeClass("on");
            $(this).siblings(".three-depth").stop(true, true).slideDown();
          }
        })
      }

      if($("footer").length > 0) {
        $(document).on("click", ".dreamtour-btn", function(){
          if(!$(this).hasClass("on")){
            $(this).addClass("on")
            $(this).parents(".bot-area").find(".company-info-w").stop(true, true).slideDown();
          }else{
            $(this).removeClass("on")
            $(this).parents(".bot-area").find(".company-info-w").stop(true, true).slideUp();
          }
        })
      }
    },
    commonFn: function () {
      // 바탕화면 클릭시 닫히는 스크립트
      $('body').click(function(e){
        if($(e.target).parents().hasClass("tooltip-wrap")){
          
        }else{
          if($(".tooltip-wrap").hasClass("on")){
            $(".tooltip-wrap").removeClass("on");
            $(".tooltip-wrap").find(".tooltip-box").stop(true,true).fadeOut(200);
          }
        }
      });

      // 탑버튼 클릭
      $(".btn-top").on("click", function(){
        gsap.to("html, body", 1, {scrollTop:0, ease:Power3.easeOut})
      });

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

          if($(this).parents().hasClass("reserve-result-list")){
            if(!$(this).hasClass("on")){
              $(".gray-detail-acco").removeClass("on");
              $(".gray-detail-acco .detail-con").stop(true, true).slideUp();
            }else{
              $(".gray-detail-acco").addClass("on");
              $(".gray-detail-acco .detail-con").stop(true, true).slideDown();
            }
          }

          if($(this).hasClass("compare")) { // 호텔 목록, 숙소비교 버튼
            if(!$(this).hasClass("on")) {
              $(".chk-pop").stop().fadeOut(400).removeClass("on");
              if($(".chk-pop").hasClass("fix")) $(".fix-btn, .quick-fixed-area").stop().animate({bottom: `${bottomGap}px`}, 200);
            } else {
              if($(".compare-btn input").filter(":checked").length > 0) {
                $(".chk-pop").stop().fadeIn(400).addClass("on");
                if($(".chk-pop").hasClass("fix")) $(".fix-btn, .quick-fixed-area").stop().animate({bottom: `${fixBottomoGap}px`}, 200);
              }
            }
          }
        });
      });

      hotelDetailTab();

      // 좋아요 버튼
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

      if($(".media-query").size() > 0){
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

      // 툴팁
      $(".tooltip-wrap .tooltip-btn").off().on("click", function(){
        if(!$(this).parents(".tooltip-wrap").hasClass("on")){
          $(this).parents(".tooltip-wrap").removeClass("on");
          $(this).parents(".tooltip-wrap").find(".tooltip-box").hide();
          $(this).parents(".tooltip-wrap").find(".tooltip-box").css("left", -$(this).parents(".tooltip-wrap").find(".tooltip-btn").offset().left + 20);
          $(this).parents(".tooltip-wrap").addClass("on");
          $(this).parents(".tooltip-wrap").find(".tooltip-box").stop(true, true).fadeIn(200);
        }
        
      });

      // 테이블 아코디언
      if($(".table-acco-btn").size() > 0 || $(".white-acco-area").size() > 0 || $(".faq-acco-area").size() > 0){
        $(".table-acco-btn").each(function(){
          $(this).on("click", function(){
            if(!$(this).hasClass("on")){
              $(this).addClass("on");
              $(this).parents("tr").next("tr").find(".reserve-acco-con").slideDown();
            }else{
              $(this).removeClass("on");
              $(this).parents("tr").next("tr").find(".reserve-acco-con").slideUp();
            }
          })
        });

        if($(".white-acco-area").size() > 0){
          $(document).on("click", ".white-acco-area .acco-list .acco-tit", function(){
            if(!$(this).parents(".acco-list").hasClass("on")){
              if($(this).parents().hasClass("main-city-wrap")){
                $(this).parents(".white-acco-area").find(".acco-list").removeClass("on");
                $(this).parents(".white-acco-area").find(".acco-list .acco-con").stop(true, true).slideUp();
              }
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
        }
  
        if($(".faq-acco-area .acco-list").size() > 0) {
          $(document).on("click", ".faq-acco-area .acco-list .acco-tit", function(){
            if(!$(this).parents(".acco-list").hasClass("on")){
              $(this).parents(".acco-list").addClass("on")
              $(this).siblings(".acco-con").stop(true, true).slideDown();
            }else{
              $(this).parents(".acco-list").removeClass("on")
              $(this).siblings(".acco-con").stop(true, true).slideUp();
            }
          });
        }
      }

      // 탭 기능
      $(document).on("click", ".tab-func-area .tab-btn", function(){
        var thisIndex = $(this).index();
        if(!$(this).hasClass("on")){
          // 팝업 내 스크롤 이동 후, 닫고 다시 열었을때 팝업 스크롤 맨 위로 원복
          $(this).parents(".layer-popup").find(".scroll-area").scrollTop(0);

          $(this).parents(".tab-func-area").find(".tab-btn-area .tab-btn").removeClass("on");
          $(this).addClass("on");
          $(this).parents(".tab-func-area").find(".tab-con-area .tab-con").removeClass("on");
          $(this).parents(".tab-func-area").find(".tab-con-area .tab-con").eq(thisIndex).addClass("on");
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
      

      // 약관 전체 동의
      if($(".agree-acco").size() > 0){
        $(".agree-acco .check-list .check-list-con").show();

        $(".agree-acco .check-list").each(function(){
          $(this).find(".click-div").on("click", function(){
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

      $(".green-btn-sel").each(function(){
        $(this).find(".btn").each(function(q){
          $(this).on("click", function(){
            if($(this).parents(".green-btn-sel").hasClass("multi")){
              if(!$(this).hasClass("on")){
                $(this).addClass("on");
                // if(q == 0){
                //   $(this).siblings(".btn").addClass("on");
                // }else{
                //   if($(this).parents(".green-btn-sel").find(".btn").not(":first").length === $(this).parents(".green-btn-sel").find(".btn").not(":first").filter(".on").length) {
                //     $(this).siblings(".btn").eq(0).addClass("on")
                //   }
                // }
              }else{
                $(this).removeClass("on");
                // if(q == 0){
                //   $(this).siblings(".btn").removeClass("on");
                // }else{
                //   $(this).siblings(".btn").eq(0).removeClass("on");
                // }
              }
              
            }else{
              if(!$(this).hasClass("on")){
                $(this).parents(".green-btn-sel").find(".btn").removeClass("on");
                $(this).addClass("on");
              }else{
                $(this).removeClass("on");
              }
    
              // if($(this).parents(".green-btn-sel").hasClass("date")){
              //   if($(this).index() == 0){
              //     $(".form-date-w .form-date input").datepicker("enable")
              //   }else{
              //     $(".form-date-w .form-date input").datepicker("disable")
              //   }
              // }
            }
          });
        })
        
      });

      if($(".hidden-data").size() > 0){
        $(".hidden-data .more-btn").on("click", function(){
          if(!$(this).hasClass("on")){
            $(this).addClass("on");
            $(this).parents(".hidden-data").addClass("show");
          }else{
            $(this).removeClass("on");
            $(this).parents(".hidden-data").removeClass("show");
          }
        })
      }

      // 마이페이지 필터 변경
      if($(".mypage-filter-pop").size() > 0){
        $(".mypage-filter-pop .reset-btn").off().on("click", function(){
          $(".mypage-filter-pop .green-btn-sel").each(function(){
            if($(this).hasClass("multi")){
              $(this).find(".btn").removeClass("on");
            }else{
              $(this).find(".btn").removeClass("on");
              $(this).find(".btn").eq(0).addClass("on");
              $(".mypage-filter-pop .form-select select option:first-child").prop("selected", true);
              $(".mypage-filter-pop .srch-input input").val("");
              $(".mypage-filter-pop .srch-input input").attr("value", "");
              // $(".mypage-filter-pop .form-date-w .form-date input").datepicker("enable");
              // $(".mypage-filter-pop .form-date-w .form-date input").datepicker("setDate", "");
            }
          })
        });
      }

      reserveHotelList();

      // ---- 목록 [비교하기 팝업] START ----
      if($(".chk-pop").length > 0) {
        let itemIdx;
        let itemIdxEq;
        let delteItem;
        $Chkpop = $(".chk-pop");
        $ComparePop = $(".compare-pop");
        chkItemEl = $Chkpop.find(".chk-list .item").eq(0).clone(true);

        // [목록], 비교하기 버튼 클릭
        $(document).on('click', ".compare-btn input", function() {
        // $(".compare-btn input").on("click", function() {
          if(!$(this).is(':checked')) { // 체크 해제할 때 실행...
            // 목록 아이템 0개면 [비교하기 팝업] 닫기
            if($(".compare-btn input").filter(":checked").length === 0) {
              $Chkpop.stop().fadeOut(400, function() {
                $Chkpop.removeAttr("style");
                $Chkpop.removeClass("fix");
              }).removeClass("on");
              if($(".quick-fixed-area").css("position") == "fixed" && $(".chk-pop").hasClass("fix")) $(".fix-btn, .quick-fixed-area").stop().animate({bottom: `${bottomGap}px`}, 200);
            }

            // 목록 아이템 삭제 & 팝업 아이템 삭제
            // data-compare 순서 재할당
            delteItem = $(this).parents(".product-list .item");
            delteIdx = delteItem.data("compare");
            deleteChkItem = $Chkpop.find(`.chk-list .item[data-compare="${delteIdx}"]`);

            delteItem.removeData("compare");
            delteItem.removeAttr("data-compare");
            deleteChkItem.remove();
            $Chkpop.find(".chk-list .swiper-wrapper").append(chkItemEl);
            chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성

            // 스와이퍼 이동
            _compareList.slideTo($(".compare-btn input").filter(":checked").length - 1);

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
              $Chkpop.stop().fadeIn(400).addClass("on");
            }

            // 목록 아이템 추가 & 팝업 아이템 추가
            // data-compare 순서 재할당
            itemIdx = $(".compare-btn input").filter(":checked").length;
            itemIdxEq = itemIdx - 1

            $(this).parents(".product-list .item").data("compare", itemIdx);
            $(this).parents(".product-list .item").attr("data-compare", itemIdx);
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).data("compare", itemIdx);
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).attr("data-compare", itemIdx);
            $Chkpop.find(".chk-list .item").eq(itemIdxEq).addClass("on");

            // 스와이퍼 이동
            _compareList.slideTo(itemIdxEq);

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

        // [비교하기 팝업] 팝업 아이템 삭제 버튼 클릭
        // $Chkpop.on("click", ".delete-btn", function() {
        //   // 목록 아이템 삭제 & 팝업 아이템 삭제
        //   // data-compare 순서 재할당
        //   deleteChkItem = $(this).parents(".item");
        //   delteIdx = deleteChkItem.data("compare");

        //   // 스와이퍼 이동
        //   if(deleteChkItem.next(".item").hasClass("on")) {
        //     if(delteIdx == 1) {
        //       _compareList.slideTo(0);
        //     } else if(delteIdx == 2) {
        //       _compareList.slideTo(1);
        //     }
        //   } else {
        //     if(delteIdx == 1) {
        //       _compareList.slideTo(0);
        //     } else if(delteIdx == 2) {
        //       _compareList.slideTo(0);
        //     } else if(delteIdx == 3) {
        //       _compareList.slideTo(1);
        //     }
        //   }

        //   deleteChkItem.remove();
        //   $Chkpop.find(".chk-list .swiper-wrapper").append(chkItemEl);
        //   chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성
          
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).find($(".compare-btn input")).prop("checked", false);
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).removeData("compare");
        //   $(`.product-list .item[data-compare="${delteIdx}"]`).removeAttr("data-compare");
          
        //   // data-compare 순서 재할당
        //   dataCompareVarFunc();

        //   // 목록 아이템 0개면 [비교하기 팝업] 닫기
        //   if($(".compare-btn input").filter(":checked").length === 0) $Chkpop.stop().fadeOut(400).removeClass("on");

        //   // [비교하기 팝업], 카운트 숫자
        //   // [비교하기 팝업], 비교하기 버튼 disabled
        //   chkPopLengthBtnFunc();
        // });

        // [비교하기 팝업] 리셋 버튼 클릭
        $($Chkpop).find(".reset-btn").on("click", function() {
          //  [비교하기 팝업] 닫기
          $Chkpop.stop().fadeOut(400, function() {_compareList.slideTo(0);}).removeClass("on");

          // 목록 아이템 삭제 & 팝업 아이템 삭제
          // data-compare 삭제
          $(".compare-btn input").filter(":checked").parents(".product-list .item").removeData("compare");
          $(".compare-btn input").filter(":checked").parents(".product-list .item").removeAttr("data-compare");
          $(".compare-btn input").filter(":checked").prop("checked", false);

          // [비교하기 팝업], 카운트 숫자 0
          $Chkpop.find(".count .green-txt").text(0);
          $Chkpop.find(".chk-list .swiper-wrapper").empty();
          for (var i = 1; i <= 3; i++) {
            $Chkpop.find(".chk-list .swiper-wrapper").append(chkItemEl);
             chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성
          }

          // [비교하기 팝업], 비교하기 버튼 disabled
          $Chkpop.find(".compare-pop-btn").prop('disabled', true);
        });

        // [비교하기 팝업] 닫기 버튼 클릭
        $($Chkpop).find(".popclose-btn").on("click", function() {
          if($Chkpop.hasClass("fix")) {
            $Chkpop.removeClass("fix");
            if($(".quick-fixed-area").css("position") == "fixed") $(".fix-btn, .quick-fixed-area").stop().animate({bottom: `${bottomGap}px`}, 200);
          } else {
            $Chkpop.addClass("fix");
            if($(".quick-fixed-area").css("position") == "fixed") $(".fix-btn, .quick-fixed-area").stop().animate({bottom: `${fixBottomoGap}px`}, 200);;
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
              $(".resrch-bar .stay").text()
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
        $ComparePop.on("click", ".delete-btn", function() {
          // 목록 아이템 삭제 & 팝업 아이템 삭제 & 팝업2 아이템 삭제
          // data-compare 순서 재할당
          deleteChkItem = $(this).parents(".item");
          delteIdx = deleteChkItem.data("compare");

          deleteChkItem.remove();
          $ComparePop.find(".compare-list").append(compareItemEl);
          compareItemEl = $ComparePop.find(".compare-list > .item:last").clone(true); // 새로운 복사본 생성
          
          $Chkpop.find(`.chk-list .item[data-compare="${delteIdx}"]`).remove();
          $Chkpop.find(".chk-list .swiper-wrapper").append(chkItemEl);
          chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성
          _compareList.slideTo(0)

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
        });

        // [비교하기 팝업2] 닫기 버튼 클릭
        $ComparePop.find(".popclose-btn").on("click", function() {
          $ComparePop.find(".compare-list").empty();
          for (var i = 1; i <= 3; i++) {
            $ComparePop.find(".compare-list").append(compareItemEl);
            compareItemEl = $ComparePop.find(".compare-list > .item:last").clone(true); // 새로운 복사본 생성
          }
        });

      }
      // ---- 목록 [비교하기 팝업] END ----
    },
    tripSrchBarFn:function(){
      _roomNum = $(".room-num input").data('val');

      // 목적지 검색 주요 추천 도시 swiper
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
              slidesPerView: 2,
              slidesPerColumn: 4,
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

      // 목적지 검색 상단 영역 고정
      $(".trip-recent-srch .scroll-area").on("scroll", function(){
        if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
          if($(".trip-sel-area .trip-sel-wrap .pop-tit-wrap").innerHeight() < $(".trip-recent-srch .scroll-area").scrollTop()){
            $(".trip-sel-wrap .trip-recent-srch .top-area").addClass("fixed");
          }else{
            $(".trip-sel-wrap .trip-recent-srch .top-area").removeClass("fixed");
          }
        }
      });

      // 체크인, 체크아웃 상단 영역 고정
      $(".trip-sel-area .calendar-wrap .scroll-area").on("scroll", function(){
        if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
          if($(".trip-sel-area .calendar-wrap .pop-tit-wrap").innerHeight() < $(".trip-sel-area .calendar-wrap .scroll-area").scrollTop()){
            $(".trip-sel-wrap .calendar-wrap .top-area").addClass("fixed");
          }else{
            $(".trip-sel-wrap .calendar-wrap .top-area").removeClass("fixed");
          }
        }
      });

      // 목적지 검색 팝업 열기
      $(".trip-input-val").on("click", function(){
        if($(this).parents().hasClass("trip-input")){
          $("body").addClass("stop-scroll");

          // safari 이슈로, fixed사용을 위해 부모 scroll-area overflow 잠시 auto -> hidden (상세 검색바에서만...)
          if($(".trip-sel-area").hasClass("resrch")) { // 상세 검색바에서만...
            $(".trip-sel-area.resrch .trip-sel-wrap > .scroll-area").css("overflow", "hidden");
          }
          
          $(this).parents(".trip-input").addClass("on");
          $(this).parents(".trip-input-div").find(".trip-recent-srch").css("display", "flex").hide(0).fadeIn(300).addClass("on");

        }
      });

      // 검색바 팝업 뒤로가기 클릭 (전체 데이터 저장된 전의 데이터로 원복, 저장된 전의 데이터가 없을 경우 초기화)
      // $(".trip-sel-wrap .pop-tit-wrap .prev-btn, .trip-sel-area.resrch .bg-pop").off().on("click", function(){
      $(".trip-sel-wrap .pop-tit-wrap .prev-btn, .trip-sel-area.resrch .bg-pop").off().on("click", function(){
        if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
          $("body").removeClass("stop-scroll");
        }
        
        $(".trip-sel-area .trip-input").removeClass("on"); // 목적지 검색 닫기
        $(".trip-sel-area .trip-date").removeClass("on"); // 체크인, 체크아웃 닫기
        $(".trip-sel-area .trip-room").removeClass("on"); // 객실 닫기

        // ## 목적지 검색 ##
        if($(this).parents().hasClass("trip-input-div")){
          $(".trip-sel-area .trip-recent-srch").removeClass("on");
          if($(".trip-sel-area .trip-sel-wrap .trip-input .form-input input").val() == ""){ // 목적지 검색 input에 값이 없을 경우 placeholder 텍스트 입력
            if($(".trip-sel-area .trip-sel-wrap .trip-input .form-input input").data("place") !== ""){
              $(".trip-sel-area .trip-sel-wrap .trip-input .trip-input-val .val").text($(".trip-sel-area .trip-sel-wrap .trip-input .form-input input").data("place"))
            }else{
              $(".trip-sel-area .trip-sel-wrap .trip-input .trip-input-val .val").removeClass("on");
              $(".trip-sel-area .trip-sel-wrap .trip-input .trip-input-val .val").text("지역, 숙소 이름 또는 랜드마크 입력")
            }
          }
          // val, attr를 둘 다 써줘야 dom, script 다 변경됨
          $(".trip-input-div .srch-input input").val($(".trip-input-div .srch-input input").data("place")) // data-place : 전에 입력한 검색 키워드 - 전에 입력한 키워드를 다시 input value값에 넣은 후 창 닫기
          $(".trip-input-div .srch-input input").attr("value", $(".trip-input-div .srch-input input").data("place"))
          $(".trip-recent-srch").fadeOut(() => {
            // safari 이슈로, fixed사용을 위해 부모 scroll-area overflow 복구 (상세 검색바에서만...)
            if($(".trip-sel-area").hasClass("resrch")) { // 상세 검색바에서만...
              $(".trip-sel-area.resrch .trip-sel-wrap > .scroll-area").css("overflow", "");
            }
          });
        }

        // ## 체크인 체크아웃 ##
        if($(this).parents().hasClass("trip-date")){
          var checkInYear; // 체크인 해당 날짜의 년도
          var checkOutYear; // 체크아웃 해당 날짜의 년도
          var $date = $(".calendar .week-div > a").not(".disabled"); // disabled를 제외한 달력 날짜

          _isCheck = false;
          $(".calendar-wrap").fadeOut(() => {
            // safari 이슈로, fixed사용을 위해 부모 scroll-area overflow 복구 (상세 검색바에서만...)
            if($(".trip-sel-area").hasClass("resrch")) { // 상세 검색바에서만...
              $(".trip-sel-area.resrch .trip-sel-wrap > .scroll-area").css("overflow", "");
            }
          });
          $(".choice-box select").val($(".stay-wrap .form-select select").val()).prop("selected", true);
          $(".calendar .week-div .in span").not(".date").remove();
          $(".calendar .week-div .out span").not(".date").remove();
          $(".calendar .week-div a").removeClass("ing")
          $(".calendar .week-div a").removeClass("check in")
          $(".calendar .week-div a").removeClass("check out");
          
          $(".trip-sel-area .trip-sel-wrap .trip-date .checkin-wrap .chk-in-out .date-txt").remove();
          $(".trip-sel-area .trip-sel-wrap .trip-date .checkin-wrap .chk-in-out").eq(0).append(_chkInDate)
          $(".trip-sel-area .trip-sel-wrap .trip-date .checkin-wrap .chk-in-out").eq(1).append(_chkOutDate)

          _chkInDate = $(".trip-sel-area .trip-sel-wrap .trip-date .checkin-wrap .chk-in-out").eq(0).find(".date-txt").clone();
          _chkOutDate = $(".trip-sel-area .trip-sel-wrap .trip-date .checkin-wrap .chk-in-out").eq(1).find(".date-txt").clone();

          $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-wrap .top-area .choice-box .date-txt").remove();
          $(".choice-box .checkin-txt .chk-in-out").eq(0).append(_chkInDate)
          $(".choice-box .checkin-txt .chk-in-out").eq(1).append(_chkOutDate)
          
          // 메인 화면에 보이는 체크인, 체크아웃 텍스트를 다시 팝업 내의 값에 입력
          $(".year-month-div").each(function(){
            if(parseInt($(".checkin-wrap .chk-in-out").eq(0).find(".month").text()) == parseInt($(this).find(".month").text()) && parseInt($(".checkin-wrap .chk-in-out").eq(0).find(".year").text()) == parseInt($(this).find(".year").text().slice(2,4))){
              $(this).closest(".calendar").find(".week-div a").each(function(q){
                if(parseInt($(".checkin-wrap .chk-in-out").eq(0).find(".date").text()) == parseInt($(this).find("span").text())){
                  $(this).addClass("check in");
                  if($(".today").hasClass("check")){
                    $(".today span").not(".date").remove();
                  }
                  $(this).append("<span>체크인</span>");
                }
              });
            }
            if(parseInt($(".checkin-wrap .chk-in-out").eq(1).find(".month").text()) == parseInt($(this).find(".month").text()) && parseInt($(".checkin-wrap .chk-in-out").eq(1).find(".year").text()) == parseInt($(this).find(".year").text().slice(2,4))){
              $(this).closest(".calendar").find(".week-div a").each(function(q){
                if(parseInt($(".checkin-wrap .chk-in-out").eq(1).find(".date").text()) == parseInt($(this).find("span").text())){
                  $(this).addClass("check out");
                  $(this).append("<span>체크아웃</span>");
                }
              });
            }
          });

          checkOutYear = parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".year").text());
          checkInYear = parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".year").text());

          if(checkOutYear <= checkInYear){ // 체크아웃 년도와 체크인 년도 비교
            $(".calendar .week-div .check.out").addClass("in");
            $(".calendar .week-div .check.in").addClass("out");
            $(".calendar .week-div .check").eq(0).removeClass("out");
            $(".calendar .week-div .check").eq(1).removeClass("in");
            if($(".today").hasClass("check")){
              $date.not(".ing").find("span").not(".date").remove();
            }else{
              $date.not(".ing, .today").find("span").not(".date").remove();
            }
            
            $date.removeClass("ing");
            $(".calendar .week-div .check.in").append("<span>체크인</span>");
            $(".calendar .week-div .check.out").append("<span>체크아웃</span>");

            // 체크인, 체크아웃 월 및 년도 다시 받아오기
            checkInMonth = parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".month").text());
            checkInYear = parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".year").text());
            checkOutMonth = parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".month").text());
            checkOutYear = parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".year").text());
            
            if(checkOutMonth > checkInMonth){ // 체크아웃 월과 체크인 월 비교
              $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
              $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing");
              $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing"); // ex) 9-11월인 경우 10월 전체 다 체크
            }else if(checkOutMonth < checkInMonth){
              $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
              $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing"); // ex) 9-11월인 경우 10월 전체 다 체크
            }

            $(".calendar .week-div .disabled").removeClass("ing");
          }else{
            $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing");
            $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
          }

          $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing"); // 체크인과 체크아웃 사이 ing class 추가
          $(".calendar .week-div .check.out").prevUntil($(".calendar .week-div .check.in")).addClass("ing"); // 체크인과 체크아웃 사이 ing class 추가
          $(".calendar .week-div .disabled").removeClass("ing"); // disabled 칸에는 ing 삭제
          $(".calendar .week-div .in").prevAll().removeClass("ing"); // 체크인 전에 ing class 있는거 모두 삭제
          $(".calendar .week-div .out").nextAll().removeClass("ing"); // 체크아웃 이후에 ing class 있는거 모두 삭제

          $(".trip-room .room-info-sel .child-chk-div").each(function(){
            if($(this).hasClass("on")){
              $(this).find(".child-chk").each(function(){
                if($(this).find(".form-input:not(.birth) input").val() != "" && $(this).closest(".child-chk-div").find('.child-chk[data-yn="Y"]')){
                  var birthdate = $(this).find(".birth").find("input").val();

                  if (!/^\d*$/.test(birthdate)) {
                    birthdate = birthdate.replace(/\D/g, ""); // 숫자만 남김
                  }

                  // 만 나이 계산
                  let age = 0;

                  age = calcFullAgeFn(birthdate);

                  if(age > 17){
                    alert("만 17세까지만 아동에 해당합니다.");
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
        }
        
        // ## 객실/인원 선택 ##
        // 메인에서 prev 버튼, 서브에서 검색조건변경 x 버튼
        if($(this).parents().hasClass("trip-room") || $(this).hasClass("close-btn")){
          if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
            $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel").fadeOut();
          }
          
          $(".room-con-box").each(function(q){
            if($(this).attr("data-yn") == "N"){
              $(this).not(":first-child").remove();
              $(this).show();
              $(this).data("del", "N");
              $(this).attr("data-del", "N");
              $(this).find(".adult input").val($(this).find(".adult input").data("val"))
              $(this).find(".adult input").attr("value", $(this).find(".adult input").data("val"))
              $(this).find(".child input").val($(this).find(".child input").data("val"))
              $(this).find(".child input").attr("value", $(this).find(".child input").data("val"))

              if($(this).find(".child input").data("val") == 0){
                $(this).find(".child").siblings(".minus").addClass("disabled");
                $(this).find(".child").siblings(".plus").removeClass("disabled");
              }
              if($(this).find(".adult input").data("val") == 1){
                $(this).find(".adult").siblings(".minus").addClass("disabled");
              }
              if($(this).find(".adult input").data("val") < 9 - Number($(this).find(".child input").data("val"))){
                $(this).find(".adult").siblings(".plus").removeClass("disabled");
              }

              if(Number($(this).find(".child input").data("prev")) + Number($(this).find(".adult input").data("prev")) == 9){
                $(this).find(".adult").siblings(".plus").addClass("disabled");
                $(this).find(".child").siblings(".plus").addClass("disabled");
              }
              if(Number($(this).find(".child input").data("prev")) + Number($(this).find(".adult input").data("prev")) < 9){
                $(this).find(".adult").siblings(".plus").removeClass("disabled");
                $(this).find(".child").siblings(".plus").removeClass("disabled");
                $(this).find(".adult").siblings(".minus").removeClass("disabled");
                $(this).find(".child").siblings(".minus").removeClass("disabled");
              }

              $(".room-num input").val($(".trip-sel-area .room-con-box[data-del='N']").length)
              $(".room-num input").attr("value", $(".trip-sel-area .room-con-box[data-del='N']").length)
            }

            if($(this).attr("data-yn") == "Y"){
              $(".room-num").find("input").val($(".room-num").find("input").data("val"))
              $(".room-num").find("input").attr("value", $(".room-num").find("input").data("val"));
              $(this).find(".title .num").text(q+1);
              $(this).find(".adult input").val($(this).find(".adult input").data("prev"))
              $(this).find(".adult input").attr("value", $(this).find(".adult input").data("prev"));
              $(this).find(".child input").val($(this).find(".child input").data("prev"))
              $(this).find(".child input").attr("value", $(this).find(".child input").data("prev"));

              if(Number($(this).find(".child input").data("prev")) + Number($(this).find(".adult input").data("prev")) < 10){
                $(this).find(".adult").siblings(".plus").removeClass("disabled");
                $(this).find(".child").siblings(".plus").removeClass("disabled");
                $(this).find(".adult").siblings(".minus").removeClass("disabled");
                $(this).find(".child").siblings(".minus").removeClass("disabled");

                if(Number($(this).find(".child input").data("prev")) + Number($(this).find(".adult input").data("prev")) == 9){
                  $(this).find(".child").siblings(".plus").addClass("disabled");
                  $(this).find(".adult").siblings(".plus").addClass("disabled");
                }
              }

              if($(this).find(".adult input").data("prev") > 1){
                $(this).find(".adult").siblings(".minus").removeClass("disabled");
              }
              if($(this).find(".adult input").data("prev") == 8){
                $(this).find(".adult").siblings(".plus").addClass("disabled");
              }
              if($(this).find(".adult input").data("prev") == 1){
                $(this).find(".adult").siblings(".minus").addClass("disabled");
              }


              if($(this).find(".child input").data("prev") == 0){
                $(this).find(".child").siblings(".minus").addClass("disabled");
                $(this).find(".child-chk-div").removeClass("on");
                $(this).find(".child-chk-div .child-chk input").val("");
                $(this).find(".child-chk-div .child-chk").data("yn", "N");
                $(this).find(".child-chk-div .child-chk").attr("data-yn", "N");
              }

              if($(".room-num").find("input").data("val") > 1){
                $(".room-num").find(".minus").removeClass("disabled");
                $(".room-num").find(".plus").removeClass("disabled");
                $(".room-con-box").find(".delete-btn").show()
              }
              if($(".room-num").find("input").data("val") == 8){
                $(".room-num").find(".plus").addClass("disabled");
              }
              if($(".room-num").find("input").data("val") == 1){
                $(".room-num").find(".minus").addClass("disabled");
              }

              if($(this).attr("data-del") == "Y"){
                $(this).attr("data-del", "N")
                $(this).data("del", "N");
                $(this).show();
              }
            }

            $(this).find(".child-chk").each(function(q){
              if($(this).data("yn") == "Y"){
                $(this).parents(".child-chk-div").addClass("on");
                $(this).find(".btn-square-l").prev().find("input").val($(this).find(".btn-square-l").prev().find("input").data("val")); // 입력한 아동 생년월일
                $(this).find(".btn-square-l").prev().find("input").attr("value", $(this).find(".btn-square-l").prev().find("input").data("val"))
                $(this).find(".btn-square-l").next().find("input").val($(this).find(".btn-square-l").next().find("input").data("val")); // 만 나이 계산된 텍스트
                $(this).find(".btn-square-l").next().find("input").attr("value", $(this).find(".btn-square-l").next().find("input").data("val"));
              }

              if($(this).data("yn") == "N"){
                if(q == 0){
                  $(this).parents(".child-chk-div").removeClass("on");
                  $(this).find("input").val("")
                  $(this).find("input").attr("value", "")
                  $(this).parents(".room-con-box").find(".child input").val($(this).parents(".room-con-box").find(".child input").data("prev"))
                  $(this).parents(".room-con-box").find(".child input").attr("value", $(this).parents(".room-con-box").find(".child input").data("prev"))
                }else{
                  $(this).remove();
                }
              }
            });
          });

          if($(".room-con-box[data-del='N']").length == 1 && $(".room-con-box[data-yn='N']").length == 1){
            _totalAdultNum = $(".room-con-box[data-del='N']").find(".adult input").data("val");
            _totalChildNum = $(".room-con-box[data-del='N']").find(".child input").data("val");

            $(".room-con-box[data-del='N']").find(".adult input").val(_totalAdultNum)
            $(".room-con-box[data-del='N']").find(".adult input").attr("value", _totalAdultNum)

            $(".room-con-box[data-del='N']").find(".child input").val(_totalChildNum)
            $(".room-con-box[data-del='N']").find(".child input").attr("value", _totalChildNum)
          }else{
            _totalAdultNum = 0;
            _totalChildNum = 0;
  
            $(".room-con-box[data-yn='Y']").each(function(){
              $(this).find(".adult").each(function(){
                _totalAdultNum += Number($(this).find("input").data("prev"))
              });
              $(this).find(".child").each(function(){
                _totalChildNum += Number($(this).find("input").data("prev"))
              });
            });
          }

          _roomNum = $(".room-con-box[data-del='N']").length;

          $(".room-info").eq(0).find(".num").text(_roomNum) // 객실 수
          $(".room-info").eq(1).find(".num").text(_totalAdultNum) // 성인 총 합
          $(".room-info").eq(2).find(".num").text(_totalChildNum) // 아동 총 합
        }
      })

      // 검색바 최근검색어, 주요 도시 클릭 - 주요 도시의 텍스트가 메인 검색바 안에 입력됨
      $(document).on("click", ".trip-recent-srch button", function(){
        if(!$(this).hasClass("delete-btn")){
          $(".trip-recent-srch").removeClass("on");
          $(".trip-sel-area .trip-sel-wrap .trip-input").removeClass("on");
          $(".trip-input-div .srch-input input").val($(this).find(".txt").text());
          $(".trip-input-div .srch-input input").attr("value", $(this).find(".txt").text());
          $(".trip-input-div .srch-input input").attr("data-place", $(this).find(".txt").text());
          $(".trip-input-div .srch-input input").data("place", $(this).find(".txt").text());
          $(".trip-sel-area .trip-sel-wrap .trip-recent-srch").fadeOut(() => {
            // safari 이슈로, fixed사용을 위해 부모 scroll-area overflow 복구 (상세 검색바에서만...)
            if($(".trip-sel-area").hasClass("resrch")) { // 상세 검색바에서만...
              $(".trip-sel-area.resrch .trip-sel-wrap > .scroll-area").css("overflow", "");
            }
          });
          $(".trip-sel-area .trip-sel-wrap .trip-input .trip-input-val .val").addClass("on");
          $(".trip-sel-area .trip-sel-wrap .trip-input .trip-input-val .val").text($(this).find(".txt").text())

          if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
            $("body").removeClass("stop-scroll");
          }
        }
      });

      // 객실 팝업 열기
      $(".trip-sel-area .room-info-wrap").off().on("click", function(){
        $("body").addClass("stop-scroll");
        $(".trip-sel-area .trip-sel-wrap .trip-room").addClass("on");
        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel").fadeIn();

        $(".child-chk-div").each(function(){
          if($(this).hasClass("on")){
            $(this).find(".child-chk").each(function(){
              if($(this).attr("data-del") == "Y"){
                $(this).show()
                $(this).data("del", "N")
                $(this).attr("data-del", "N")
              }
            });
          }
        });
      });

      // 받아온 날짜에 맞춰 체크인, 체크아웃 class 추가
      chkInOutFn();
      

      // 체크인, 체크아웃 팝업 열기
      $(".date-info-wrap .checkin-wrap").on("click", function(e){
        $("body").addClass("stop-scroll");

        // safari 이슈로, fixed사용을 위해 부모 scroll-area overflow 잠시 auto -> hidden (상세 검색바에서만...)
        if($(".trip-sel-area").hasClass("resrch")) { // 상세 검색바에서만...
          $(".trip-sel-area.resrch .trip-sel-wrap > .scroll-area").css("overflow", "hidden");
        }
        
        $(".trip-sel-area").find(".calendar-wrap").css("display", "flex").hide(0).fadeIn(300);
        if($(".today").children("span").not(".date").size() <= 0 && !$(".today").hasClass("check")){ // today에 체크인이나 체크아웃이 없을 경우
          $(".today").append("<span>오늘</span>") // 오늘 텍스트 추가
        }
        $(this).parents(".trip-date").addClass("on");
        if(!$(".trip-sel-area").hasClass("resrch")) {
          $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-div").css("margin-top", $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-wrap .top-area").outerHeight(true)) // 달력 내 상단 고정 부분만큼 달력에 margin-top 주기
        }
          
        _chkInDate = $(".checkin-wrap .chk-in-out").eq(0).find(".date-txt").clone();
        _chkOutDate = $(".checkin-wrap .chk-in-out").eq(1).find(".date-txt").clone();

        if($(".calendar .check.in").size() <= 0){
          chkInOutFn();
        }

        setTimeout(() => {
          $(".calendar.on").removeClass("on");
          $(".calendar .week-div .check.in").parents(".calendar").addClass("on");
          $(".calendar-wrap .scroll-area").scrollTop($(".calendar.on").position().top);
        }, 0);
      });

      dateClickFn();

      // 달력 적용하기
      $(".calendar-wrap .apply-btn").on("click", function(){
        _isCheck = false;
        $(".choice-box .chk-in-out").each(function(q){
          // $(".date-info-wrap .date-txt").remove();
          $(".date-info-wrap .chk-in-out").eq(q).append($(this).find(".date-txt").clone());
          $(".date-info-wrap .chk-in-out").eq(q).find(".date-txt:even").remove();
        });

        $(".stay-wrap .form-select select").val($(".choice-box select").val()).prop("selected", true);
        $(".trip-sel-area .trip-sel-wrap .trip-date").removeClass("on")
        $(".calendar-wrap").fadeOut(() =>{
          // safari 이슈로, fixed사용을 위해 부모 scroll-area overflow 복구 (상세 검색바에서만...)
          if($(".trip-sel-area").hasClass("resrch")) { // 상세 검색바에서만...
            $(".trip-sel-area.resrch .trip-sel-wrap > .scroll-area").css("overflow", "");
          }
        });

        if(!$(".trip-sel-area").hasClass("resrch")) {
          $("body").removeClass("stop-scroll");
        }

        

        $(".trip-room .room-info-sel .child-chk-div").each(function(){
          if($(this).hasClass("on")){
            $(this).find(".child-chk").each(function(){
              if($(this).find(".form-input:not(.birth) input").val() != "" && $(this).closest(".child-chk-div").find('.room-con-box[data-yn="Y"]')){
                var birthdate = $(this).find(".birth").find("input").val();

                if (!/^\d*$/.test(birthdate)) {
                  birthdate = birthdate.replace(/\D/g, ""); // 숫자만 남김
                }

                // 만 나이 계산
                let age = 0;

                age = calcFullAgeFn(birthdate);

                if(age > 17){
                  alert("만 17세까지만 아동에 해당합니다.");
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
      });
      
      var newRoom = $(".trip-sel-area .room-con-box:first-child").clone(true); // 객실
      // var newRoom = $(".trip-sel-area .room-con-box").clone(true); // 객실 clone

      // 객실 추가, 삭제 버튼
      $(document).on("click", ".trip-sel-area .trip-room .room-tit-wrap button", function(){
        if($(this).hasClass("plus") && !$(this).hasClass("disabled")){ // 객실 추가 버튼일 경우
          $(this).parents(".room-tit-wrap").find(".minus").removeClass("disabled");

          if($('.room-con-box[data-del="N"]').length < 8){ // 삭제 된 적 없는 객실 리스트의 갯수가 8개 미만일 경우
            _roomNum++;
            newRoom = $(".trip-sel-area .room-con-box:last-child").clone(true);
            $(".room-con-wrap").append(newRoom);

            // ❗❗
            // $(".room-con-wrap").append(newRoom);
            $(".trip-sel-area .room-con-box:last-child").show();
            $(".trip-sel-area .room-con-box:last-child").find(".adult input").val(2);
            $(".trip-sel-area .room-con-box:last-child").find(".adult input").attr("value", 2);
            $(".trip-sel-area .room-con-box:last-child").find(".adult input").data("val", 2);
            $(".trip-sel-area .room-con-box:last-child").find(".child input").val(0);
            $(".trip-sel-area .room-con-box:last-child").find(".child input").attr("value", 0);
            $(".trip-sel-area .room-con-box:last-child").find(".child input").data("val", 0);
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div").removeClass("on");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk").not(":first-child").remove();
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk .form-input input").val("");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk .form-input input").attr("value", "");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk .form-input input").attr("data-val", "");
            $(".trip-sel-area .room-con-box:last-child").find(".child-chk-div .child-chk .form-input input").data("val", "");
            $(".trip-sel-area .room-con-box:last-child").find(".person-div:nth-child(2) .plus-minus-input button").removeClass("disabled"); // 성인
            $(".trip-sel-area .room-con-box:last-child").find(".person-div:nth-child(3) .plus-minus-input .minus").addClass("disabled"); // 아동
            // ❗❗

            $(".trip-sel-area .room-con-box:last-child .title .num").text(_roomNum)
            // ❗❗
            $(".trip-sel-area .room-con-box:last-child").attr("data-yn", "N");
            // ❗❗
            $(".trip-sel-area .room-con-box:last-child").attr("data-del", "N");

            if($('.room-con-box[data-del="N"]').length == 8){ // 8개 될 경우
              $(this).addClass("disabled"); // 객실 수 추가 버튼에 disabled class 추가
            }

            if($('.room-con-box[data-del="N"]').eq(0).find(".delete-btn").css("display") == "none"){
              $('.room-con-box[data-del="N"]').eq(0).find(".delete-btn").show() // 객실이 2개 이상 될 경우 맨 처음 객실 리스트에도 delete 버튼 보이도록 함
            }
          }
        }else if($(this).hasClass("minus") && !$(this).hasClass("disabled")){ // 객실 삭제 버튼일 경우
          $(this).parents(".room-tit-wrap").find(".plus").removeClass("disabled");
          $(".trip-sel-area .room-con-box:last-child").hide();

          if (_roomNum > 0) {  // 더 이상 숨길 항목이 없을 때까지
            _roomNum--;  // 인덱스를 하나씩 줄임
            $(".trip-sel-area .room-con-box[data-del='N']").eq(_roomNum).hide();  // 해당 인덱스 항목 숨기기
            $(".trip-sel-area .room-con-box[data-del='N']").eq(_roomNum).data("del", "Y");
            $(".trip-sel-area .room-con-box[data-del='N']").eq(_roomNum).attr("data-del", "Y");
          }

          if(_roomNum == 1){
            $(this).addClass("disabled");
          }
        
          if ($(".trip-sel-area .room-con-box[data-del='N']").length == 1) {
            $(".trip-sel-area .room-con-box[data-del='N']").find(".delete-btn").hide(); // 객실이 1개일 경우 객실 리스트의 delete 버튼 안보이게 함
          }
        }

        $(this).closest(".room-num").find(".form-input input").val(_roomNum)
        $(this).closest(".room-num").find(".form-input input").attr("value", _roomNum)

        $(".room-info").eq(0).find(".num").text($(".room-con-box:last-child .title .num").text()) // 검색 바 객실 수에 마지막 객실 리스트 숫자 삽입

        formReCheck();
      });

      // 객실 인원 추가 및 삭제
      var childInfoClone = $(".trip-sel-area .trip-room .child-chk:last-child").clone(true);

      $(document).on("click", ".trip-sel-area .trip-room .person button", function(){
        var personNum = parseInt($(this).closest(".person-div").find(".form-input input").val());
        var minPersonNum; // 최소 인원
        var maxPersonNum; // 최대 인원

        if($(this).hasClass("minus") && !$(this).hasClass("disabled")){ // minus
          $(this).closest(".person").find(".plus").removeClass("disabled");

          if($(this).closest(".person-div").index() % 2 == 1){ // 성인
            minPersonNum = 1; // 성인의 최소 default값 1
          }else{ // 아동
            minPersonNum = 0; // 아동의 최소 default값 0

            $(this).closest(".room-con-box").find(".child-chk:last .form-input input").val("")
            $(this).closest(".room-con-box").find(".child-chk:last .form-input input").attr("value", "");

            if(personNum == 1){ // 아동의 수가 1일 경우 -> 아동 수를 아래에서 감소 시키기 때문에 0으로 생각하면 됨
              $(this).closest(".room-con-box").find(".child-chk-div").removeClass("on"); // 아동 내용 리스트 안보이게 on class 삭제
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk[data-del='N'] input").val("")
            }else{
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").eq(personNum-1).hide(); // 맨 마지막 리스트부터 삭제
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").eq(personNum-1).data("del", "Y");
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").eq(personNum-1).attr("data-del", "Y");
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").eq(personNum-1).find(".tit .num").text($(this).closest(".room-con-box").find(".child-chk").length) // 삭제 함으로써 리스트의 갯수 텍스트도 계속 수정
            }

            formReCheck()
          }
          
          if(personNum > minPersonNum){ // 최소 인원 되면 minus button disabled
            personNum = personNum - 1; // 성인 or 아동 인원 하나씩 감소
            $(this).closest(".person").find(".form-input input").val(personNum); // 성인 or 아동 input에 value값 입력
            $(this).closest(".person").find(".form-input input").attr("value", personNum);
            // $(this).closest(".person").find(".form-input input").attr("data-val", personNum);

            if(personNum == minPersonNum){
              $(this).addClass("disabled"); // 아동 최소 인원과 같아질 경우 disabled 처리
            }
          }

          if(parseInt($(this).parents(".room-con-div").find(".form-input").eq(0).find("input").val()) + parseInt($(this).parents(".room-con-div").find(".form-input").eq(1).find("input").val()) <= 8){ // 객실 리스트의 성인, 아동의 수가 8보다 작거나 같을 경우
            $(this).parents(".room-con-div").find(".plus").removeClass("disabled") // 객실 추가 버튼에 disabled class 삭제
          }
        }else if($(this).hasClass("plus") && !$(this).hasClass("disabled")){ // plus
          $(this).closest(".person").find(".minus").removeClass("disabled");

          if($(this).closest(".person-div").index() % 2 == 1){ // 성인
            maxPersonNum = 9; // 최대 인원 9
          }else{ // 아동
            maxPersonNum = 8; // 최대 인원 8 (성인은 필수로 1이 있어야함)

            $(this).closest(".room-con-box").find(".child-chk-div").addClass("on"); // 아동 내용 리스트 보이도록 on class 추가

            if(personNum > 0){ // 아동의 수가 0보다 클 경우 clone
              childInfoClone = $(this).closest(".room-con-box").find(".child-chk:last").clone(true);
              $(this).closest(".room-con-box").find(".child-chk-div").append(childInfoClone);
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child").show();
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child").attr("data-del", "N");
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child").attr("data-yn", "N");
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child").data("del", "N");
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child").data("yn", "N");
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child .form-input input").val("");
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child .form-input input").attr("data-val", "");
              $(this).closest(".room-con-box").find(".child-chk-div .child-chk:last-child .form-input input").data("val", "");
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").eq(personNum).find(".tit .num").text($(this).closest(".room-con-box").find(".child-chk[data-del='N']").length)
            }

            formReCheck()
          }

          if(personNum < maxPersonNum){ // 최대 인원 되면 plus button disabled
            personNum = personNum + 1; // 성인 or 아동 인원 하나씩 증가
            $(this).closest(".person").find(".form-input input").val(personNum); // 성인 or 아동 input에 value값 입력
            $(this).closest(".person").find(".form-input input").attr("value", personNum);
            // $(this).closest(".person").find(".form-input input").attr("data-val", personNum);

            if(personNum == maxPersonNum){ // 성인 or 아동의 인원 수가 max값과 동일해질 경우
              $(this).addClass("disabled") // 추가 버튼 disabled 처리
            }
          }

          if(parseInt($(this).parents(".room-con-div").find(".form-input").eq(0).find("input").val()) + parseInt($(this).parents(".room-con-div").find(".form-input").eq(1).find("input").val()) > 8){
            $(this).parents(".room-con-div").find(".plus").addClass("disabled")
          }
        }
      });

      // 객실 각각 삭제
      $(document).on("click", ".trip-room .room-con-box > .delete-btn", function(){
        $(this).parents(".room-tit-wrap").find(".plus").removeClass("disabled");

        _roomNum--;
        $(".room-num .plus").removeClass("disabled");
        // 삭제 시키는 객실 리스트 data-del Y 값으로 변경
        $(this).parents(".room-con-box[data-del='N']").hide();
        $(this).parents(".room-con-box[data-del='N']").data("del", "Y");
        $(this).parents(".room-con-box[data-del='N']").attr("data-del", "Y");
        
        // 삭제 된 적 없는 리스트의 갯수 each q값의 +1 (q값은 0부터 시작하기 때문에 +1 시킴)
        $('.room-con-box[data-del="N"]').each(function(q){
          $(this).find(".title .num").text(q+1);
        })

        if ($('.room-con-box[data-del="N"]').length == 1) {
          $('.room-con-box[data-del="N"]').find(".delete-btn").hide();
          $(".room-num .minus").addClass("disabled");
        }

        $(".room-num input").val($('.room-con-box[data-del="N"]').length)
        $(".room-num input").attr("value", $('.room-con-box[data-del="N"]').length)
      });

      
      // 아동 생년월일 확인 버튼 클릭
      $(document).on("click", ".child-chk .btn-square-l", function(){
        // ios safari 키패드 이슈로 settimeout설정
        setTimeout(() => {
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
              $(this).prev(".form-input").find("input").val("")
              return;
            }
    
            // 만 나이 계산
            let age = 0;
  
            age = calcFullAgeFn(birthdate, confirmBtn);
  
            if(age > 17){
              alert("만 17세까지만 아동에 해당합니다.");
              $(this).prev(".form-input").find("input").val("");
              $(this).prev(".form-input").find("input").focus();
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
        }, 0);
      })
      
      // 객실 적용하기 버튼 클릭
      function tripRoomApply() {
        let isSuccessful = true;  // 성공 여부 반환 (상세 검색바에서만 필요!)

        const hasChild = $(".child-chk-div").filter(function(){
          return $(this).hasClass("on");
        }).length;
        if(hasChild == 0){
          if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
            $("body").removeClass("stop-scroll");
            $(".trip-sel-area .trip-sel-wrap .trip-room").removeClass("on");
            $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel").fadeOut();
          }
        }

        let isAlertShown = false;
        $(".child-chk-div").each(function(){
          if($(this).hasClass("on")){
            $(this).find(".child-chk[data-del='N']").each(function(){
              if(!isAlertShown && $(this).find(".form-input input:read-only").val() == ""){
                alert(`${$(this).find(".tit").text()}의 만 나이를 입력해 주세요.`);
                $(this).find(".form-input:nth-of-type(1) input").focus();
                isAlertShown = true;
                isSuccessful = false; // 실패로 설정 (상세 검색바에서만 필요!)
                return;
              }

              $(this).attr('data-yn', "Y");
              $(this).data('yn', "Y");
              
              const emptyInputs = $(this).parents(".room-con-wrap").find(".child-chk-div.on .child-chk[data-del='N'] .form-input:nth-of-type(1) input").filter(function(){
                return $(this).val().trim() === '';
              }).length; // 만 나이를 계산하지 않은 input

              if(emptyInputs == 0){ // 만 나이를 모두 계산 했을 경우
                if(!$(".trip-sel-area").hasClass("resrch")) { // 메인 검색바에서만...
                  $("body").removeClass("stop-scroll");
                  $(".trip-sel-area .trip-sel-wrap .trip-room").removeClass("on");
                  $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel").fadeOut();
                }
              }
            });
          }

          $(this).find(".child-chk").each(function(q){
            if($(this).data("del") == "Y"){
              $(this).remove();
            }

            if(q == 0 && $(this).data("yn") == "Y" && !$(this).parents(".child-chk-div").hasClass("on")){
              $(this).data("yn") == "N";
              $(this).find("input").val("")
            }
          })
        });

        $(".trip-sel-area .trip-sel-wrap .trip-room .room-info-sel .room-con-box").attr('data-yn', "Y");
        $(".room-num").find(".form-input input").attr("data-val", _roomNum)
        $(".room-num").find(".form-input input").data("val", _roomNum)
        _totalAdultNum = 0;
        _totalChildNum = 0;
        $(".room-con-box").each(function(){
          if($(this).data("del") == "Y"){
            $(this).remove(); // 삭제 시켰던 객실 리스트는 아예 지우기
          }

          // 삭제 된 적 없는 리스트의 성인 총 합, 아동 총 합 구하기
          if($(this).data("del") == "N"){
            $(this).find(".adult").each(function(){
              _totalAdultNum += Number($(this).find("input").val())
              $(this).find("input").data('prev', $(this).find("input").val())
              $(this).find("input").attr('data-prev', $(this).find("input").val())
            })
            $(this).find(".child").each(function(){
              _totalChildNum += Number($(this).find("input").val())
              $(this).find("input").data('prev', $(this).find("input").val())
              $(this).find("input").attr('data-prev', $(this).find("input").val())
            })
          }
          
        })

        $(".room-info").eq(0).find(".num").text(_roomNum) // 객실 수 총 합
        $(".room-info").eq(1).find(".num").text(_totalAdultNum) // 성인 수 총 합
        $(".room-info").eq(2).find(".num").text(_totalChildNum) // 아동 수 총 합

        return isSuccessful; // 성공 여부 반환 (상세 검색바에서만 필요!)
      }

      $(".trip-sel-area .room-info-sel .btn-wrap .apply-btn").on("click", function(){
        // ios safari 키패드 이슈로 settimeout설정
        setTimeout(() => {
          tripRoomApply();
        }, 0);
      })
      

      // ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
      // 상세 검색바 2024-12-31 추가 스크립트
      // ~ [상세 검색바] 상단 검색바 클릭 ~
      $(".resrch-bar").off().on("click", function() {
        $(".trip-sel-area.resrch").fadeIn(200).addClass("on");
        $("body").addClass("stop-scroll");
      });

      // ~ [상세 검색바] 전체 뒤로가기 ~
      $(".trip-sel-area.resrch .close-btn").off().on("click", function() {
        $(".trip-sel-area.resrch").fadeOut(200).removeClass("on");
        $("body").removeClass("stop-scroll");
      });
      // ❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗❗
    },
    scrollFn: function () {
      // 고정 검색 바
      if($(".resrch-bar").size() > 0 && 52 <= $(window).scrollTop()) {
        $(".resrch-bar").addClass("fix");
      }
      // 탭 메뉴
      if($(".tab-menu").size() > 0 && $(".tab-menu").offset().top <= $(window).scrollTop() + 81) {
        $(".tab-menu .tab-wrap").addClass("fix");
      }

      $(window).on("scroll", function(){
        _isScrollTop = $(window).scrollTop();

        //////// down ////////
        if (_isScrollTop > _thisScroll) {
          // 고정 검색 바
          if($(".resrch-bar").size() > 0 && 52 <= _isScrollTop) {
            $(".resrch-bar").addClass("fix");
          }
          // 탭 메뉴
          if($(".tab-menu").size() > 0 && $(".tab-menu").offset().top <= _isScrollTop + 81) {
            $(".tab-menu .tab-wrap").addClass("fix");
          }
        }
        
        //////// up ////////
        if (_isScrollTop < _thisScroll) {
          // 고정 검색 바
          if($(".resrch-bar").size() > 0 && 52 > _isScrollTop) {
            $(".resrch-bar").removeClass("fix");
          }
          // 탭 메뉴
          if($(".tab-menu").size() > 0 && $(".tab-menu").offset().top > _isScrollTop + 81) {
            $(".tab-menu .tab-wrap").removeClass("fix");
          }
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
    },
    resizeFn: function () {
      $(window).resize(function () {
        })
        .resize();
    },
    swiperFn: function () {
      // 예약 내역
      bookingHistorySwiperFn();

      // 주요 추천 도시
      if($(".like-list-swiper .swiper-slide").length > 1 && $(".like-list-swiper").size() > 0){
        likeListSwiperFn();
      }

      // 최근 검색어
      // var recentWordSwiper = new Swiper(".recent-word", {
      //   slidesPerView: "auto",
      //   observer:true,
      //   observeParents:true,
      // });

      // green, gray border swiper - 전체 이미지
      if($(".gray-border-swiper").size() > 0){
        grayBtnSwiperFn();

        if($(".hotel-img-pop").size() > 0){

          $(document).on("click", ".gray-border-swiper .tab-btn", function() {
            var thisIndex = $(this).index();
            if(!$(this).hasClass("on")){
              // 팝업 내 스크롤 이동 후, 닫고 다시 열었을때 팝업 스크롤 맨 위로 원복
              $(this).parents(".layer-popup").find(".scroll-area").scrollTop(0);

              $(".gray-border-swiper .tab-btn").removeClass("on");
              $(".hotel-img-div .hotel-img").removeClass("on");
              $(this).addClass("on");
              $(".hotel-img-div .hotel-img").eq(thisIndex).addClass("on");
            }
          });
        }
      }

      // 필터 그룹
      if($(".filter-group").size() > 0){
        var filterGroupSwiper = new Swiper(".filter-group", {
          slidesPerView: "auto",
          spaceBetween: 8,
          observer: true,
          observeParents: true,
        });
      }

      // 필터 그룹 (isBeginning, isEnd)
      // if($(".filter-group-wrap").size() > 0){
      //   var isOnce = false;
      //   var filterGroupWrapSwiper = new Swiper(".filter-group-wrap", {
      //     slidesPerView: "auto",
      //     observer: true,
      //     observeParents: true,
      //     on: {
      //       setTransition:function(){
      //         if(filterGroupWrapSwiper.isBeginning){
      //           $(".filter-group-wrap").addClass("left")
      //           $(".filter-group-wrap").removeClass("right")
      //         }else{
      //           $(".filter-group-wrap").addClass("right")
      //           $(".filter-group-wrap").removeClass("left")
      //         }


      //         if($(".filter-group-wrap .form-select").hasClass("active")){
      //           $(".filter-group-wrap .form-select").removeClass("active")
      //         }
              
      //       },
      //       reachBeginning:function(){
      //         $(".filter-group-wrap").addClass("left")
      //         $(".filter-group-wrap").removeClass("right")
      //       },
      //     }, 
      //   });

      //   $(".filter-group-wrap .swiper-slide").each(function(){
      //     $(this).on("click", function(){
      //       if($(this).children().hasClass("btn-checkbox")){
      //         if(!$(this).hasClass("on")){
      //           $(".filter-group-wrap .swiper-slide").not($(this)).find("input").prop("checked", false)
      //           $(".filter-group-wrap .swiper-slide").not($(this)).find("input").removeAttr("checked")
      //           $(".filter-group-wrap .swiper-slide").removeClass("on");
      //           $(".filter-group-wrap .swiper-slide").find("select").prop('selectedIndex', 0)
      //           $(this).addClass("on");
      //           $(this).find("input").attr("checked", true);
      //           $(this).find("input").prop("checked", true);
      //         }else{
      //           $(this).find("input").attr("checked", true);
      //           $(this).find("input").prop("checked", true);
      //         }
      //       }
      //     });
      //   });
      // }

      // 비교하기
      if($(".chk-pop").size() > 0){
        _compareList = new Swiper(".chk-list .swiper-container", {
          slidesPerView: "auto",
          observer: true,
          observeParents: true,
        });
      }
    },
    formChkFn:function(){
      selectMotionFunc();

      // input에 값 입력 시 내용 지우기 버튼 생성
      formReCheck();

      // form date 클릭
      // if($(".form-date").size() > 0){
      //   $(".form-date input").datepicker({
      //     dateFormat:"yy-mm-dd",
      //     showOn: "none",
      //     beforeShow: function() {
      //       $(this).prop("readonly", true); // Datepicker가 열리기 전에 readonly 설정
      //     },
      //     onClose: function(d) {
      //       $(this).prop("readonly", false); // Datepicker가 닫힐 때 readonly 해제
      //     }
      //   });

      //   $(".form-date .icon").on("click", function(e){
      //     // e.stopPropagation()
      //     $(this).parents(".form-date").find("input").datepicker("show");
      //   });

      //   $(".form-date input").on("focus", function(e){
      //     e.preventDefault();
      //   });
      // }
      

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
      // 필터 인풋, 팝업 필터 인풋
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



        // 필터 팝업 검색 버튼 click
        $(".filter-pop .srch-btn").on("click", function() {
          let findFilterId = $(`#${$(this).parents(".filter-pop").find(".opt-group input").eq(0).attr("id").replace("pop-", "")}`);
          let targetId;
          
          $(this).parents(".filter-pop").find(".opt-group input[data-apply='N']").each((idx, item) => {
            targetId = $(`#${$(item).attr("id").replace("pop-", "")}`);
            targetId.prop("checked", $(item).prop("checked"));
            targetId.attr("data-apply", "N");
            
            if ($(item).prop("checked")) {
              $(item).attr("data-checked", "Y");
            } else {
              $(item).removeAttr("data-checked");
            }
          });

          $(".filter-pop [data-apply='N']").removeAttr("data-apply");

          if(findFilterId.parents(".opt-group").find("input:checked").length > 0) {
            findFilterId.parents(".filter").addClass("chk");
          } else {
            findFilterId.parents(".filter").removeClass("chk");
          }

          // ( 팝업 닫기 )
          $(this).parents(".filter-pop").fadeOut(200).removeClass("on");
        });

        // 필터 팝업 닫기 버튼 click
        $(".filter-pop .popclose-btn").on("click", function() {
          setTimeout(() => {
            $('.filter-pop [data-apply="N"]').prop("checked", false);
            $('.filter-pop [data-checked="Y"]').prop("checked", true);
            $('.filter-pop [data-apply="N"]').removeAttr("data-apply");
            
            if($(this).parents(".filter-pop").find(".tab-btn").length > 0) {
              $(this).parents(".filter-pop").find(".tab-con").each((idx, item) => {
                if($(item).find(".opt-group input:checked").length > 0) {
                  $(item).parents(".filter-pop").find(".tab-btn").eq($(item).index()).addClass("chk");
                } else {
                  $(item).parents(".filter-pop").find(".tab-btn").eq($(item).index()).removeClass("chk");
                }
              })
            }
          }, 200)
        });

        // 필터 팝업 리셋 버튼 click
        $(".filter-pop .reset-btn").on("click", function() {
          $(this).parents(".filter-pop").find(".tab-btn").removeClass("chk");
          $(this).parents(".filter-pop").find(".opt-group input").prop("checked", false).attr("data-apply", "N");
        });

        // 팝업 체크박스 & 라디오 change
        $(document).on("click", ".filter-pop .opt-group input", function() {
        // $(".filter-pop .opt-group input").on("change", function() {
          $(this).attr("data-apply", "N");
          filterMark(false, $(this));
        });

        // 체크박스 & 라디오 change
        $(document).on("click", ".filter .opt-group input", function() {
        // $(".filter .opt-group input").on("change", function() {
          $(this).attr("data-apply", "N");

          let targetId = $(`#pop-${$(this).attr("id")}`);

          if($(this).is(":radio")) {  // 라디오인 경우
            let name =  targetId.attr("name");
            $(`input[name="${name}"]`).prop("checked", false);
            $(`input[name="${name}"]`).removeAttr("data-checked");

            targetId.prop("checked", true);
            targetId.attr("data-checked", "Y");
          } else {
            targetId.prop("checked", $(this).prop("checked"));
            if ($(this).prop('checked')) {
              targetId.attr("data-checked", "Y");
            } else {
              targetId.removeAttr("data-checked");
            }
          }

          if($(this).parents(".filter").find(".icon-txt-btn").length > 0) {
            filterMark($(this), targetId);
          }
        });

        // 필터 체크박스 & 라디오 init
        // $(".filter .opt-group input:checked").each((idx, item) => {
        //   let targetId = $(`#pop-${$(item).attr("id")}`);

        //   $(item).attr("data-checked", "Y");
        //   targetId.prop("checked", $(item).prop("checked")).attr("data-checked", "Y");
          
        //   if($(item).parents(".filter").find(".icon-txt-btn").length > 0) {
        //     $(item).parents(".filter").addClass("chk");
        //     targetId.parents(".filter-pop").find(".tab-btn").eq(targetId.parents(".tab-con").index()).addClass("chk");
        //   }
        // });

        // 필터 각 초기화
        $(".filter .reset-btn:not(.all)").on("click", function() {
          if($(this).parents(".filter").find(".opt-group").length > 0) {
            $(this).parents(".filter").find("input").attr("data-apply", "N");
            $(this).parents(".filter").removeClass("chk");
            
            let targetId = $(this).parents(".filter").find(".opt-group input").eq(0).attr("id");
            if($(this).parents(".filter").find(".icon-txt-btn.open").length > 0) {
              $(`#pop-${targetId}`).parents(".filter-pop").find("input").prop("checked", false).removeAttr("data-checked");
              $(`#pop-${targetId}`).parents(".filter-pop").find(".tab-btn").removeClass("chk");
            }
          }
          $(this).parents(".filter").find("input").each(function(idx, item) {
            inputReset($(item));
          });
        });

        // 필터 전체 초기화
        $(".filters-pop .reset-btn.all").on("click", function() {
          $(".filter").removeClass("chk");
          $(".filter-pop .tab-btn").removeClass("chk");

          $(this).parents(".filters-pop").find("input").each(function(idx, item) {
            inputReset($(item))
            if($(item).parents(".opt-group").length > 0) {
              $(item).attr("data-apply", "N");
            }
          });
          $(".filter-pop .opt-group input").prop("checked", false).removeAttr("data-checked");
        });

        // 필터 적용
        let filterHotelNameValue = "";  // 호텔명 저장
        let rangeData = JSON.parse($(".slider-range").attr("data-range"));
        let fiilterRangeValue = {minSave: rangeData.min, maxSave: rangeData.max};  // 총 요금 저장

        $(".filters-pop .srch-btn").on("click", function() {
          $(this).parents(".filters-pop").fadeOut(200).removeClass("on");
          $("body").removeClass("stop-scroll");
          
          // 호텔명 저장
          filterHotelNameValue = $(".filter .srch-input input").val();

          // 총 요금 저장
          fiilterRangeValue.minSave = Number(inputNumChangeRest($(".filter .form-range .more input").val()));
          fiilterRangeValue.maxSave = Number(inputNumChangeRest($(".filter .form-range .less input").val()));

          // 체크박스 & 라디오 저장
          $(".filters-pop .opt-group input[data-apply='N']").each((idx, item) => {
            if ($(item).prop("checked")) {
              $(item).attr("data-checked", "Y");
            } else {
              $(item).removeAttr("data-checked");
            }
          });
          
          $(".filters-pop .opt-group input").removeAttr("data-apply");
        });

        // 필터 닫기
        $(".filters-pop .popclose-btn").on("click", function() {
          setTimeout(() => {
            $('.filters-pop [data-apply="N"]').prop("checked", false);
            $('.filters-pop [data-checked="Y"]').prop("checked", true);
            $(".filters-pop .chk, .filter-pop .chk").removeClass("chk");

            // 호텔명 복원
            $(".filter .srch-input input").val(filterHotelNameValue).attr("value", filterHotelNameValue);

            // 총 요금 복원
            // $(".filter .form-range .more input").val(fiilterRangeValue.minSave);
            // $(".filter .form-range .less input").val(fiilterRangeValue.maxSave);
            // let $rangeSlider = $(item).find(".slider-range");
            // let $rangeAmountMore = $(item).find(".form-input.more input");
            // let $rangeAmountLess = $(item).find(".form-input.less input");
            $rangeSlider.slider("values", [fiilterRangeValue.minSave, fiilterRangeValue.maxSave]);
            $rangeAmountMore.val(fiilterRangeValue.minSave);
            $rangeAmountLess.val(fiilterRangeValue.maxSave);
            inputNumChange($rangeAmountMore);
            inputNumChange($rangeAmountLess);

            // 체크박스 & 라디오 복원
            $(".filters-pop .opt-group input").each((idx, item) => {
              if($(item).attr("data-apply") === "N") {
                $(`#pop-${$(item).attr("id")}`).prop("checked", false);
                $(`#pop-${$(item).attr("id")}`).removeAttr("data-checked");
    
                if ($(item).attr("data-checked") === "Y") {
                  $(`#pop-${$(item).attr("id")}`).prop("checked", true);
                  $(`#pop-${$(item).attr("id")}`).attr("data-checked", "Y");              
                }
              }
              
              // * 체크
              if($('.filters-pop [data-checked="Y"]').parents(".filter").find(".icon-txt-btn").length > 0) {
                let targetId = $(`#pop-${$(item).attr("id")}`);
                filterMark($(item), targetId);
              }
            });

            $(".filters-pop .opt-group input").removeAttr("data-apply");
          }, 200);
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
      $(document).on("change", ".form-checkbox input[type='checkbox']:not(.Chk-All)", function () {
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
        // $rangeSlider = $(".form-range").find(".slider-range");
        // $rangeAmountMore = $(".form-range").find(".form-input.more input");
        // $rangeAmountLess = $(".form-range").find(".form-input.less input");
        // rangeData = JSON.parse($rangeSlider.attr("data-range"));

        // $rangeSlider.slider({
        //     range: true,
        //     min: rangeData.min,
        //     max: rangeData.max,
        //     values: [rangeData.minValue, rangeData.maxValue],
        //     slide: function(event, ui) {
        //         $rangeAmountMore.val(ui.values[0]);
        //         $rangeAmountLess.val(ui.values[1]);

        //         inputNumChange($rangeAmountMore);
        //         inputNumChange($rangeAmountLess);
        //     }
        // });

        // $rangeAmountMore.val($rangeSlider.slider("values", 0));
        // $rangeAmountLess.val($rangeSlider.slider("values", 1));
        // inputNumChange($rangeAmountMore);
        // inputNumChange($rangeAmountLess);

        // $rangeAmountMore.on("change", function() {
        //   let newValue = parseInt(inputNumChangeRest($(this).val()));
        //   $rangeSlider.slider("values", 0, parseInt(inputNumChangeRest($(this).val())));
        //   if (newValue >= $rangeSlider.slider("values", 1) || newValue < rangeData.minValue) {
        //     newValue = rangeData.minValue;
        //     $(this).val(newValue);
        //   }
        //   $rangeSlider.slider("values", 0, newValue);
        //   inputNumChange($rangeAmountMore);
        // });
        // $rangeAmountLess.on("change", function() {
        //   let newValue = parseInt(inputNumChangeRest($(this).val()));
        //   if (newValue <= $rangeSlider.slider("values", 0) || newValue > rangeData.maxValue) {
        //     newValue = rangeData.maxValue;
        //     $(this).val(newValue);
        //   }
        //   $rangeSlider.slider("values", 1, newValue);
        //   inputNumChange($rangeAmountLess);
        // });
      }

      if($(".form-range .form-group input").is(":disabled")){
        $(".form-range").find(".slider-range").slider({
          disabled:true
        })
      }
    },
    skeletonFn: function() {
      // @ 페이지 로딩 완료되면, 하단 스크립트가 실행되어야합니다.
      $(".skeleton-loading").not(".each").fadeOut(400, function() {
        $(".skeleton-loading").remove();
      }).removeClass("on");
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
  var newRoom = $(".trip-sel-area .room-con-box:last").clone(true); // 객실
  var childInfoClone = $(".trip-sel-area .trip-room .room-con-box:last-child .child-chk:last-child").clone(true);

  $(".form-search, .form-input").each(function(q){
    $(this).off().on("focusin", function() {

      if(!$(this).find("input").is('[readonly]')) {
        if($(this).find("input").val() !== ""){
          $(this).find(".delete-btn").show();
        }
      }
    });

    $(this).find("input").off().on("focusout", function(){
      $(this).attr("value", $(this).val())
      setTimeout(function(){
        $(".form-search, .form-input").eq(q).find(".delete-btn").hide();
      }, 150)

      // ios safari 키패드 이슈로 settimeout설정
      setTimeout(() => {
        // 검색바 내의 인풋들
        if($(this).parents().hasClass("room-con-box")){
          if(parseInt($(this).val()) + parseInt($(this).parents(".person-div").siblings().find("input").val()) > 9){
            alert("객실 당 최대인원은 9명입니다.");
            $(this).closest(".person").find(".plus").addClass("disabled");
            $(this).parents(".person-div").siblings().find(".plus").addClass("disabled");
            $(this).val(9 - parseInt($(this).parents(".person-div").siblings().find("input").val()))
            $(this).attr("value", $(this).val())
          }else if(parseInt($(this).val()) + parseInt($(this).parents(".person-div").siblings(".person-div").find(".person").find("input").val()) == 9){
            $(this).parents(".room-con-div").find(".plus").addClass("disabled");
          }else{
            $(this).parents(".room-con-div").find(".plus").removeClass("disabled");
            // $(this).attr("data-val", $(this).val());
          }
  
  
          if($(this).closest(".person-div").index() == 1){ // 성인
            if($(this).val() == "" || $(this).val() < 1 || $(this).val() > 9){
              alert("1~9 사이의 성인 인원 수를 입력해 주세요.")
              $(this).val($(this).data("val"))
              $(this).attr("value", $(this).data("val"))
            }else if($(this).val() == 1){
              $(this).parents(".plus-minus-input").find(".minus").addClass("disabled");
            }else if($(this).val() == 9){
              $(this).parents(".plus-minus-input").find(".minus").removeClass("disabled");
            }
          }else{
            if(!$(this).parents().hasClass("child-chk")){
              if($(this).val() == "" || $(this).val() < 0 || $(this).val() > 8){
                alert("0~8 사이의 아동 인원 수를 입력해 주세요.")
                $(this).val($(this).data("val"))
                $(this).attr("value", $(this).data("val"))
              }
            }
          }
  
          
  
          if($(this).closest(".person-div").index() == 2){ // 아동
            if($(this).parents(".room-con-div").find(".person").eq(1).find("input").val() == 0){
              $(this).parents(".room-con-div").find(".person").eq(1).find(".minus").addClass("disabled");
              $(this).parents(".room-con-box").find(".child-chk-div").removeClass("on");
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").slice($(this).val() + 1).css('display', 'none');
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']").slice($(this).val() + 1).attr("data-del", "Y");
              $(this).closest(".room-con-box").find(".child-chk[data-del='N']:first-child input").val("")
            }else{ // 성인
              $(this).closest(".person").find(".minus").removeClass("disabled");
              
              if(Number($(this).val()) < $(this).closest(".room-con-box").find(".child-chk[data-del='N']").length){
                $(this).closest(".room-con-box").find(".child-chk[data-del='N']").slice($(this).val()).css('display', 'none');
                $(this).closest(".room-con-box").find(".child-chk[data-del='N']").slice($(this).val()).attr("data-del", "Y");
              }else{
                $(this).closest(".room-con-box").find(".child-chk-div").addClass("on");
                for(var i=parseInt($(this).closest(".room-con-box").find(".child-chk[data-del='N']").length); i<parseInt($(this).val()); i++){
                  $(this).closest(".room-con-box").find(".child-chk-div").append(childInfoClone);
                  childInfoClone = $(this).closest(".room-con-box").find(".child-chk:last-child").clone(true);
                  $(this).closest(".room-con-box").find(".child-chk:last-child .tit .num").text($(this).closest(".room-con-box").find(".child-chk[data-del='N']").length)
                }
              }
              
            }
          }
        }
        
        // 객실 수
        if($(this).parents().hasClass("room-tit-wrap")){
          if($(this).val() == "" || $(this).val() > 8 || $(this).val() < 1){
            alert("1~8 사이의 객실 수를 입력해 주세요.")
            $(this).val(1);
            $(".trip-room .form-input input").attr("value", 1);
            _roomNum = $(this).val();
            // $(".room-con-box").not(":first-child").remove();
            $(".room-con-box").not(":first-child").hide();
            $(".room-con-box").not(":first-child").attr("data-del", "Y");
            $(".room-con-box").not(":first-child").data("del", "Y");


            $(this).parents(".room-num").find(".minus").addClass("disabled");
            $(this).parents(".room-num").find(".plus").removeClass("disabled");
          }else{
            $(this).closest(".room-num").find(".minus").removeClass("disabled");
  
            if(parseInt($(this).val()) < $(".trip-sel-area .room-con-box[data-del='N']").length){
              $(this).closest(".room-num").find(".plus").removeClass("disabled");
              _roomNum = $(this).val();
  
              $(".trip-sel-area .room-con-box[data-del='N']").slice(_roomNum).css('display', 'none');
              $(".trip-sel-area .room-con-box[data-del='N']").slice(_roomNum).attr("data-del", "Y");
              
              if(_roomNum == 1){
                $(this).parents(".room-num").find(".minus").addClass("disabled");
                setTimeout(function(){
                  $('.room-con-box[data-del="N"] .delete-btn').hide();
                },0.01)
              }
            }else{
              for(var i=parseInt($('.room-con-box[data-del="N"]').length); i<$(this).closest(".room-num").find("input").val(); i++){
                $(".room-con-wrap").append(newRoom);
                newRoom = $(".trip-sel-area .room-con-box:last").clone(true);
                $(".trip-sel-area .room-con-box:last .title .num").text($(".trip-sel-area .room-con-box").length)
                $(".trip-sel-area .room-con-box:last").attr("data-del", "N");
      
                if($(".trip-sel-area .room-con-box[data-del='N']").length == 8){
                  $(this).closest(".room-num").find(".plus").addClass("disabled");
                }
              }
  
              _roomNum = $(this).val();
            }
  
            $('.room-con-box[data-del="N"]').each(function(q){
              $(this).find(".title .num").text(q+1);
            })
  
            
            if ($('.room-con-box[data-del="N"]').length == 1) {
              $(".trip-sel-area .room-con-box").find(".delete-btn").hide()
            }
          }
  
          $(".room-info").eq(0).find(".num").text($(this).val())
          if($(".trip-sel-area .room-con-box[data-del='N']").length !== 1){
            $(".trip-sel-area .room-con-box[data-del='N']").eq(0).find(".delete-btn").show();
          }
        }
      }, 0);
    })

    $(this).find(".delete-btn").off().on("click", function(){
      $(this).hide();
      $(this).parents(".input-btn-wrap").siblings("input").attr("value", "").val("").focus();
    })

    $(this).find("input").on("keyup", function(e) {
      if(!$(this).is('[readonly]')){
        if($(this).val() !== "") {
          $(this).closest(".form-search, .form-input").find(".delete-btn").show();
        } else {
          $(this).closest(".form-search, .form-input").find(".delete-btn").hide();
        }
      }

      if($(this).parents().hasClass("birth")){
        const input = e.target;
        const cursorPosition = input.selectionStart; // 현재 커서 위치 저장
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
    });

    if($(this).parents().hasClass("room-con-box")){
      $(this).find("input").on("keypress", function(e) {
        if(e.keyCode && e.keyCode == 13){
          $(this).blur();
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
  });
}

// 우측 하단 퀵메뉴 및 탑버튼
const quickRePosition = () => {
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

  // fix-btn 버튼 footer만나면 position 변경
  // (비교하기 팝업 하단에 fix 여부 확인)
  if($(".fix-btn").size() > 0){
    if ($(window).scrollTop() + window.innerHeight >= $("footer").offset().top + (!$(".chk-pop").hasClass("fix") || !$(".toggle-btn.compare").hasClass("on") ? 0 : fixBottomoGap - bottomGap)) {
      $(".fix-btn").css({
        "position": "absolute",
        "bottom": $("footer").innerHeight() + bottomGap
      });
    } else {
      $(".fix-btn").css({
        "position": "fixed",
        "bottom": `${bottomGap + (!$(".chk-pop").hasClass("fix") || !$(".toggle-btn.compare").hasClass("on") ? 0 : fixBottomoGap - bottomGap)}px`
      });
    }
  }
}

const checkInTxtFn = () => { // 체크인 텍스트 날짜 입력하는 공통 함수
  $(".chk-in-out:even").find(".year").empty();
  $(".chk-in-out:even").find(".month").empty();
  $(".chk-in-out:even").find(".date").empty();

  $(".chk-in-out:even").find(".year").text($(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div .year").text().slice(2,4))// 년
  $(".chk-in-out:even").find(".month").text($(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div .month").text())// 월

  // 일
  $(".chk-in-out:even").find(".date").empty();
  if(parseInt($(".calendar .week-div .check.in").text()) < 10){
    $(".chk-in-out:even").find(".date").text('0'+$(".calendar .week-div .check.in .date").text())
  }else{
    $(".chk-in-out:even").find(".date").text($(".calendar .week-div .check.in .date").text())
  }
  $(".chk-in-out:even").find(".day").text(inputGetDay(`'${$(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div .year").text()}-${$(".calendar .week-div .check.in").closest(".calendar").find(".year-month-div .month").text()}-${$(".calendar .week-div .check.in .date").text()}'`))
}
const checkOutTxtFn = () => { // 체크아웃 텍스트 날짜 입력하는 공통 함수
  // $(".chk-in-out:odd").find(".year").empty();
  // $(".chk-in-out:odd").find(".month").empty();
  // $(".chk-in-out:odd").find(".date").empty();

  $(".chk-in-out:odd").find(".year").empty().text($(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div .year").text().slice(2,4))// 년
  $(".chk-in-out:odd").find(".month").empty().text($(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div .month").text())// 월
  
  // 일
  if(parseInt($(".calendar .week-div .check.out").text()) < 10){
    $(".chk-in-out:odd").find(".date").empty().text('0'+$(".calendar .week-div .check.out .date").text())
  }else{
    $(".chk-in-out:odd").find(".date").empty().text($(".calendar .week-div .check.out .date").text())
  }
  $(".chk-in-out:odd").find(".day").text(inputGetDay(`'${$(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div .year").text()}-${$(".calendar .week-div .check.out").closest(".calendar").find(".year-month-div .month").text()}-${$(".calendar .week-div .check.out .date").text()}'`));
  
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

  // 체크아웃 날짜 세팅 - 체크인에 +1일
  let tomorrow = today.setDate(today.getDate() + 1);
  let tomorrowYear = today.getFullYear();
  let tomorrowMonth = today.getMonth() + 1;
  let tomorrowDay = today.getDate();
  tomorrowMonth = tomorrowMonth >= 10 ? tomorrowMonth : "0" + tomorrowMonth; //month 두자리로 출력
  tomorrowDay = tomorrowDay >= 10 ? tomorrowDay : "0" + tomorrowDay; //day 두자리로 출력

  $(".chk-in-out").each(function(q){
    if(q%2 == 0){
      $(this).find(".year").text(year);
      $(this).find(".year").text($(this).find(".year").text().slice(2,4));
      $(this).find(".month").text(month);
      $(this).find(".date").text(day);
    }else{
      $(this).find(".year").text(tomorrowYear);
      $(this).find(".year").text($(this).find(".year").text().slice(2,4));
      $(this).find(".month").text(tomorrowMonth);
      $(this).find(".date").text(tomorrowDay);
    }
  })
}

// 요일 세팅
const getDayOfWeek = () => {
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  // 오늘
  let today = new Date();
  var day = today.getDay();
  var dayLabel = week[day];

  // 내일
  let tomorrow = new Date().setDate(new Date().getDate() + 1);
  today.setDate(today.getDate() + 1);
  let dayOfWeek = today.getDay();
  let dayName = week[dayOfWeek];

  $(".chk-in-out").each(function(q){
    if(q%2 == 0){
      $(this).find(".day").text(dayLabel)
    }else{
      $(this).find(".day").text(dayName)
    }
  })
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

// 메인 팝업 swiper
let mainPopupSwiper = undefined;
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

// 공통 팝업 (메인, 공통 분기 처리)
function openPopup(popName) {
  let POPUP = $(popName);

  $("body").addClass("stop-scroll");

  if(POPUP.parents(".main-pop").length) {  // ## 메인 팝업일 경우...
    POPUP.parents(".main-pop").css("display", "block").addClass("on");

    // 메인 스와이퍼
    popMainSwiper();

    // 팝업 외부 클릭
    $(document).off("mouseup.popupClose").on("mouseup.popupClose", function(e) {
      if (POPUP.has(e.target).length === 0) {
        POPUP.parents(".main-pop").fadeOut(200).removeClass("on");
        $("body").removeClass("stop-scroll");
        $(document).off("mouseup.popupClose");
      }
    });

    // 팝업 닫기 버튼 클릭
    POPUP.parents(".main-pop").find(".popclose-btn").on("click", function() {
      POPUP.parents(".main-pop").fadeOut(200).removeClass("on");
      $("body").removeClass("stop-scroll");
    });


  } else {  // ## 공통 팝업일 경우...
    if(!POPUP.hasClass("on")) {
      POPUP.fadeIn(200).addClass("on");
    } else {
      POPUP.css("display", "block");
    }

    // 팝업 내 스크롤 이동 후, 닫고 다시 열었을때 팝업 스크롤 맨 위로 원복
    POPUP.find(".scroll-area").scrollTop(0);

    // 팝업 닫기 버튼 클릭
    POPUP.find(".popclose-btn").on("click", function() {
      closePopup(POPUP);
    });
  }
}

// 팝업 닫기 함수
function closePopup(POPUP) {
  POPUP.fadeOut(200, function() {
  }).removeClass("on");

  if(!POPUP.hasClass("filter-pop")) {
    if(POPUP.hasClass("filters-pop")) {
      if(!$(".map-pop").hasClass("on")) {
        $("body").removeClass("stop-scroll");
      }
    } else {
      $("body").removeClass("stop-scroll");
    }
  }
}

// [Select] 화살표 모션
const selectMotionFunc = () => {
  $(".form-select select").off().focus(function(){
    $(this).parents(".form-select").addClass("active");
  });

  $(document).on('click', function(e) {
    if(!$(e.target).parents().hasClass('form-select')) {
      $(".form-select.active select").data("isopen", false);
      $(".form-select").removeClass("active");
    }
  });

  $(".form-select select").on("blur", function(){
    $(this).data('isopen', false);
    $(this).parents(".form-select").removeClass("active");
  });

  $(".form-select select").on("focusout", function(){
    $(this).data('isopen', false);
    $(this).parents(".form-select").removeClass("active");
  });
  
  $(".form-select select").off().on("change", function(){
    $(this).closest(".form-select").removeClass("active");

    // 숙박일수 값 변경 시
    if($(this).parents().hasClass("trip-date")){

      var $date = $(".calendar .week-div > a").not(".disabled"); // disabled를 제외한 달력 날짜
      $(".calendar .week-div .check.out").find("span").not(".date").remove();
      $(".calendar .week-div .check.out").removeClass("check out");
      $date.removeClass("ing");
      $(".calendar .week-div .disabled").removeClass("ing");

      // disabled를 제외한 체크인 날짜 index값
      $date.each(function(q){
        if($(this).hasClass("check in")){
          _dateIndex = q;
        }
      })
      
      $date.eq(_dateIndex + parseInt($(this).val())).addClass("check out");
      $(".calendar .week-div .check.out").append("<span>체크아웃</span>");

      $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing");
      $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-wrap .top-area .choice-box .date-txt").removeClass("on");

      // ex) 9-11월인 경우 10월 전체 다 체크
      if(parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".month").text()) > parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".month").text()) || parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".year").text()) > parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".year").text())){
        $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
        $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing");
        $(".calendar .week-div .disabled").removeClass("ing");
      }

      if($date.length <= _dateIndex + parseInt($(this).val())){
        $date.eq(-1).addClass("check out");
        $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
        $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing");
        $(".calendar .week-div .disabled").removeClass("ing");
        $(".calendar .week-div .check.in").removeClass("ing");
        $(".calendar .week-div .check.in").prevAll("a").removeClass("ing");
        $(".calendar .week-div .check.out").removeClass("ing");
        $(".trip-date select").val($(".calendar .week-div .ing").length + 1).prop("selected", true);
        alert(`현재 체크인 기준 최대 숙박일수는 ${$(".calendar .week-div .ing").length + 1}일입니다.`);
        $(".trip-date .calendar-wrap .top-area .choice-box .date-txt").eq(1).removeClass("on");
        $(".calendar .week-div .check.out").append("<span>체크아웃</span>");
        _isCheck = false;
      }else{
        $date.eq(_dateIndex + parseInt($(".trip-date .checkin-wrap select").val())).addClass("check out"); // 클릭한 index값에 숙박일수를 더한 날짜에 체크아웃 설정
      }

      if(!$(this).parents().hasClass("choice-box")){
        $(".choice-box .form-select select").val($(this).val()).prop("selected", true);
      }

      checkOutTxtFn();
      
      $(".calendar .week-div .ing").removeClass("check out");
    }

    // 호텔 목록 필터 값 변경 시
    // if($(this).parents().hasClass("filter-group-wrap")){
    //   if($(this).prop('selectedIndex') !== 0){
    //     $(".filter-group-wrap").find(".swiper-slide .btn-checkbox input").removeAttr("checked")
    //     $(".filter-group-wrap").find(".swiper-slide .btn-checkbox input").prop("checked", false)
    //     $(".filter-group-wrap .swiper-slide").not($(this).parents(".swiper-slide")).find("select").prop('selectedIndex', 0)
    //     $(".filter-group-wrap").find(".swiper-slide").removeClass("on");
    //     $(this).parents(".swiper-slide").addClass("on");
    //   }else{
    //     $(".filter-group-wrap").find(".swiper-slide").removeClass("on");
    //     $(".filter-group-wrap").find(".swiper-slide").eq(0).addClass("on");
    //     $(".filter-group-wrap").find(".swiper-slide").eq(0).find("input").prop("checked", true)
    //     $(".filter-group-wrap").find(".swiper-slide").eq(0).find("input").attr("checked", "checked")
    //   }
    // }
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
}

// 지도보기 마커
function mapHotelList(){
  $(".pop-map-area .marker-btn").each(function(q){
    $(this).on("click", function(){
      if(!$(this).hasClass("on")){
        $(".pop-map-area .marker-btn").removeClass("on");
        $(".pop-map-area .room-area .half-hotel-item").removeClass("on");
        $(this).addClass("on");
        $(".pop-map-area .room-area .half-hotel-item").eq(q).addClass("on");
      }
    })
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

// 마이페이지 목록
function reserveHotelList(){
  if($(".booking-history-list").size() > 0 || $(".reserve-result-list").size() > 0){
    $(document).on("click", ".detail-btn", function(){
      if(!$(this).parents(".gray-detail-acco").hasClass("on")){
        $(this).parents(".gray-detail-acco").addClass("on");
        $(this).siblings(".detail-con").stop(true, true).slideDown();
      }else{
        $(this).parents(".gray-detail-acco").removeClass("on");
        $(this).siblings(".detail-con").stop(true, true).slideUp();
      }
    });
  }
}

// 상세 더보기 버튼 (3줄 이상 시)
function txtChkFunc(txtItem) {
    txtItem.find(".txt-chk").each((idx, item) => {
    if($(item).find(".txt").innerHeight() > 44) { // 2줄 크기 42px + 여유 2px
      $(item).siblings(".btn-wrap").show();
  
      $(item).siblings(".btn-wrap").find(".icon-txt-btn.close").off().on("click", function() {
        if($(this).hasClass("on")) {
          $(this).removeClass("on").find("span").text("더보기");
          $(item).css("max-height", 42);  // 42px은 2줄 크기로 측정
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
// let isTxtChk = false;
// function txtChkFunc() {
//   $(".txt-chk").each((idx, item) => {
//     if($(item).find(".txt").innerHeight() > 44) { // 2줄 크기 42px + 여유 2px
//       $(item).siblings(".btn-wrap").show();

//       setTimeout(()=> {
//         ScrollTrigger.refresh();
//       }, 500);

//       $(item).siblings(".btn-wrap").find(".icon-txt-btn.close").off().on("click", function() {
//         if($(this).hasClass("on")) {
//           $(this).removeClass("on").find("span").text("더보기");
//           $(item).css("max-height", 42);  // 42px은 2줄 크기로 측정
//         } else {
//           $(item).css("max-height", "unset");
//           $(this).addClass("on").find("span").text("닫기");
//         }

//         setTimeout(()=> {
//           ScrollTrigger.refresh();
//         }, 500);
//       })
//     } else {
//       $(item).siblings(".btn-wrap").hide();
//     }
//   });
//   isTxtChk = true;
// };

// 만 나이 계산
function calcFullAgeFn(birthdate, confirmBtn){
  // 생년, 월, 일 추출
  const year = parseInt(birthdate.slice(0, 4), 10);
  const month = parseInt(birthdate.slice(4, 6), 10);
  const day = parseInt(birthdate.slice(6, 8), 10);

  // 체크인 날짜
  const today = new Date();
  const chkInYear = parseInt($(".calendar.on .year-month-div .year").text());
  const chkInMonth = parseInt($(".calendar.on .year-month-div .month").text());
  const chkInDate = parseInt($(".choice-box .chk-in-out").eq(0).find(".date-txt .date").text());

  const date = new Date(year, month - 1, day); // 월은 0부터 시작하므로 -1
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    alert("잘못된 생년월일입니다. 올바른 날짜를 입력해 주세요.");
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").focus();
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").data("val", "")
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").attr("data-val", "")
    return;
  }

  if (date > today) {
    alert("미래 날짜는 생년월일로 입력할 수 없습니다.");
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(1)").find("input").focus();
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").val("")
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").data("val", "")
    confirmBtn.siblings(".form-input:nth-of-type(2)").find("input").attr("data-val", "")
    return;
  }

  // 만나이 계산
  let chkInAge = chkInYear - year;

  if (chkInMonth < month || (chkInMonth === month && chkInDate < day)) {
    chkInAge--; // 생일이 아직 지나지 않은 경우 만나이에서 1을 뺌
  }
  return chkInAge;
}

function likeListSwiperFn(){
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

function grayBtnSwiperFn(){
  var grayBorderSwiper = new Swiper(".gray-border-swiper", {
    slidesPerView: "auto",
    observer:true,
    observeParents:true,
  });
}

function todayCheckFn(){
  $(".year-month-div .month").each(function(){
    if(new Date().getMonth() + 1 == parseInt($(this).text()) && new Date().getFullYear() == parseInt($(this).parents(".year-month-div").find(".year").text())){
      $(this).closest(".calendar").find(".week-div > a").each(function(){
        if(parseInt($(this).text()) == new Date().getDate()){
          $(this).addClass("today");
          $(this).append("<span>오늘</span>")
        }
      })
    }
  });
  
  $(".calendar .week-div .today").prevAll("a").addClass("disabled"); // 오늘 날짜 기준 전 날짜들은 전부 disabled 처리
}

function chkInOutFn(){
  $(".year-month-div").each(function(){
    if($(".checkin-wrap .chk-in-out").eq(0).find(".month").text() == $(this).find(".month").text() && $(".checkin-wrap .chk-in-out").eq(0).find(".year").text() == $(this).find(".year").text().slice(2,4)){
      $(this).closest(".calendar").find(".week-div a").each(function(q){
        if(parseInt($(".chk-in-out").eq(0).find(".date").text()) == $(this).text()){
          $(this).addClass("check in");
          $(this).append("<span>체크인</span>");
        }
      });
    }
    if($(".checkin-wrap .chk-in-out").eq(1).find(".month").text() == $(this).find(".month").text() && $(".checkin-wrap .chk-in-out").eq(1).find(".year").text() == $(this).find(".year").text().slice(2,4)){
      $(this).closest(".calendar").find(".week-div a").each(function(q){
        if(parseInt($(".chk-in-out").eq(1).find(".date").text()) == $(this).find("span").text()){
          $(this).addClass("check out");
          $(this).append("<span>체크아웃</span>");
        }
      });
    }
  });
}

function dateClickFn(){
  // 달력 내 날짜 클릭 (체크인, 체크아웃)
  var checkInYear; // 체크인 해당 날짜의 년도
  var checkOutYear; // 체크아웃 해당 날짜의 년도
  var checkInMonth; // 체크인 해당 날짜의 월
  var checkOutMonth; // 체크아웃 해당 날짜의 월
  // var stayNum; // 숙박일수
  var $date = $(".calendar .week-div > a").not(".disabled"); // disabled를 제외한 달력 날짜
  
  // 오늘 날짜에 today class 추가
  // todayCheckFn()

  // $(".today").prevAll("a").addClass("disabled");

  $date.each(function(q){
    $(this).off().on("click", function(){
      if(!$(this).hasClass("disabled")){
        if(!_isCheck){ // 체크인 클릭
          _isCheck = true;
          $date.removeClass("check in"); // 체크인 class 지우기
          $date.removeClass("check out"); // 체크아웃 class 지우기
          $date.removeClass("ing"); // 체크인과 체크아웃 사이 ing class 지우기

          $(".trip-sel-area .trip-sel-wrap .trip-date .calendar-wrap .calendar .week-div > a").not(".in, .ing").find("span").not(".date").remove(); // 체크인과 ing를 제외하고 전체 a 태그에서 날짜 span빼고 다 삭제
          if(!$(this).hasClass("today")){ // 체크인이 오늘이 아닐 경우
            $(".today").append("<span>오늘</span>"); // 오늘 텍스트 추가
          }

          $(".trip-date .checkin-txt .date-txt").eq(1).addClass("on"); // 체크아웃 날짜 잠시 안보이게 함
          $(".trip-date .calendar-wrap .choice-box .form-select select").val(0).prop("selected", true); // 숙박일수 0박으로 설정
          $(this).addClass("check in"); // 체크인 class 추가
          $(this).append("<span>체크인</span>"); // 체크인 텍스트 추가

          checkInTxtFn();// 클릭한 날짜 검색바 영역에 텍스트로 넣기

          if($(this).parents(".calendar").index() + 1 == $(".calendar-div .calendar").length && parseInt($(this).find(".date").text()) == $(this).parents(".calendar").find("a").not(".disabled").length){
            $(".calendar-wrap .top-area .choice-box .form-select select").attr("disabled", true);
          }
        }else{ // 체크아웃 클릭
          if(!$(this).hasClass("in")){
            _isCheck = false;

          $(".trip-date .checkin-txt .date-txt").eq(1).removeClass("on"); // 체크아웃 날짜 보이게 함
          $(this).addClass("check out"); // 체크아웃 class 추가
          $(this).append("<span>체크아웃</span>"); // 체크아웃 텍스트 추가
          $(".calendar-wrap .top-area .choice-box .form-select select").attr("disabled", false);

          checkOutYear = parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".year").text());
          checkInYear = parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".year").text());

          if(checkOutYear <= checkInYear){ // 체크아웃 년도와 체크인 년도 비교
            $(".calendar .week-div .check.out").addClass("in");
            $(".calendar .week-div .check.in").addClass("out");
            $(".calendar .week-div .check").eq(0).removeClass("out");
            $(".calendar .week-div .check").eq(1).removeClass("in");
            if($(".today").hasClass("check")){
              $date.not(".ing").find("span").not(".date").remove();
            }else{
              $date.not(".ing, .today").find("span").not(".date").remove();
            }
            
            $date.removeClass("ing");
            $(".calendar .week-div .check.in").append("<span>체크인</span>");
            $(".calendar .week-div .check.out").append("<span>체크아웃</span>");

            // 체크인, 체크아웃 월 및 년도 다시 받아오기
            checkInMonth = parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".month").text());
            checkInYear = parseInt($(".calendar .week-div .check.in").closest(".calendar").find(".year").text());
            checkOutMonth = parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".month").text());
            checkOutYear = parseInt($(".calendar .week-div .check.out").closest(".calendar").find(".year").text());
            
            if(checkOutMonth > checkInMonth){ // 체크아웃 월과 체크인 월 비교
              $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
              $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing");
              $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing"); // ex) 9-11월인 경우 10월 전체 다 체크
            }else if(checkOutMonth < checkInMonth){
              $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
              $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing"); // ex) 9-11월인 경우 10월 전체 다 체크
            }

            $(".calendar .week-div .disabled").removeClass("ing");
          }else{
            $(".calendar .week-div .check.in").closest(".calendar").nextUntil($(".calendar .week-div .check.out").closest(".calendar")).find(".week-div > a").addClass("ing");
            $(".calendar .week-div .check.out").prevAll("a").addClass("ing");
          }

          if($date.length <= q + parseInt($(".calendar-wrap .choice-box select").val())){
            $date.eq(-1).addClass("check out");
            setTimeout(function(){
              $(".calendar-wrap .choice-box select").val($(".calendar .week-div .ing").length + 1).prop("selected", true);
              alert(`현재 체크인 기준 최대 숙박일수는 ${$(".calendar .week-div .ing").length + 1}일입니다.`);
            }, 0.01)
          }else{
            $date.eq(q + parseInt($(".calendar-wrap .choice-box select").val())).addClass("check out"); // 클릭한 index값에 숙박일수를 더한 날짜에 체크아웃 설정
            $date.eq(q + parseInt($(".calendar-wrap .choice-box select").val())).append("<span>체크아웃</span>");
          }

          if($(".calendar .week-div .ing").length > 89){
            var checkInIndex;
            alert("숙박일은 90일을 넘길 수 없습니다.");
            $date.removeClass("ing");
            $(".calendar .week-div a").removeClass("ing");
            $(".calendar .week-div .check.out").find("span").not(".date").remove()
            $(".calendar .week-div .check.out").removeClass("check out");
            $(".calendar-wrap .choice-box select").val($(".calendar .week-div .ing").length + 1).prop("selected", true);
            $date.each(function(q){
              if($(this).hasClass("check in")){
                checkInIndex =  q;
              }
            })
            $date.eq(checkInIndex + parseInt($(".calendar-wrap .choice-box select").val())).addClass("check out"); // 클릭한 index값에 숙박일수를 더한 날짜에 체크아웃 설정
            $(".calendar .week-div .check.out").append("<span>체크아웃</span>");
            checkOutTxtFn();
          }

          $(".calendar .week-div .check.in").nextUntil($(".calendar .week-div .check.out")).addClass("ing");
          $(".calendar .week-div .disabled").removeClass("ing");

          
          $(".calendar-wrap .choice-box select").val($(".calendar .week-div .ing").length + 1).prop("selected", true);

          // 클릭한 날짜 검색바 영역에 텍스트로 넣기
          checkInTxtFn();
          checkOutTxtFn();
          }
        }
      }
    });
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
      // $("input.num").on("keyup", function() {
      //   inputNumChange($(this));
      // });


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
  
  // 스와이퍼 이동
  if(deleteChkItem.next(".item").hasClass("on")) {
    if(delteIdx == 1) {
      _compareList.slideTo(0);
    } else if(delteIdx == 2) {
      _compareList.slideTo(1);
    }
  } else {
    if(delteIdx == 1) {
      _compareList.slideTo(0);
    } else if(delteIdx == 2) {
      _compareList.slideTo(0);
    } else if(delteIdx == 3) {
      _compareList.slideTo(1);
    }
  }
  
  deleteChkItem.remove();
  $Chkpop.find(".chk-list .swiper-wrapper").append(chkItemEl);
  chkItemEl = $Chkpop.find(".chk-list .item:last").clone(true);  // 새로운 복사본 생성
  
  $(`.product-list .item[data-compare="${delteIdx}"]`).find($(".compare-btn input")).prop("checked", false);
  $(`.product-list .item[data-compare="${delteIdx}"]`).removeData("compare");
  $(`.product-list .item[data-compare="${delteIdx}"]`).removeAttr("data-compare");
  
  // data-compare 순서 재할당
  dataCompareVarFunc();
  
  // 목록 아이템 0개면 [비교하기 팝업] 닫기
  if($(".compare-btn input").filter(":checked").length === 0) $Chkpop.stop().fadeOut(400).removeClass("on");
  
  // [비교하기 팝업], 카운트 숫자
  // [비교하기 팝업], 비교하기 버튼 disabled
  chkPopLengthBtnFunc();
}

function hotelDetailTab(){
  let tabMenuSwiper;
  if($(".tab-wrap").size() > 0) {
    tabMenuSwiper = new Swiper(".tab-wrap .swiper-container", {
      slidesPerView: "auto",
      observer: true,
      observeParents: true,
    });
  }
  // 탭 메뉴 (클릭 & 스크롤 시, 앵커 이동)
  if($(".tab-menu").size() > 0){
    let isAnchorScroll = true;
    let $tabMenuItem = $(".tab-menu .tab-wrap .tab");
    let $tabCont = $(".tab-conts .tab-cont");

    const anchorScrollFunc = (idx) => {
      if (isAnchorScroll) {
        $($tabMenuItem).eq(idx).siblings().removeClass("on");
        $($tabMenuItem).eq(idx).addClass("on");
        tabMenuSwiper.slideTo(idx);
      }
    }

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // 스크롤
    $($tabCont).each((idx, item) => {
      ScrollTrigger.create({
        trigger: item,
        start: () => `top 119px`,
        end: () => `bottom 119px`,
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
      let tabContOffset = $(tabContItem).offset().top - 119;
      // tabMenuSwiper.slideTo( $(this).index());

      // $(this).addClass("on");
      // $(this).siblings().removeClass("on");

      $("html, body").animate({
        scrollTop: tabContOffset
      }, 400);

      setTimeout(() => {
        isAnchorScroll = true;
        anchorScrollFunc($(this).index())
      }, 400);
    });
  }
}

function bookingHistorySwiperFn(){
  if($(".booking-history-list .swiper-slide").length > 1 && $(".booking-history-list").size() > 0 && !$(".booking-history-list").hasClass("no-swipe")){
    var flowSwiper = new Swiper(".booking-history-list", {
      pagination: {
        el: ".booking-history-list .swiper-pagination",
      },
      slidesPerView: "auto",
      observer:true,
      observeParents:true,
    });
  }
}