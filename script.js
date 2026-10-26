/* ==========================================================
   ひなた食堂 デモサイト
   必要最低限のJavaScriptのみ
   1. ハンバーガーメニューの開閉
   2. スクロール時の軽いフェードイン
   3. お品書きの分類切り替え
   4. トップへ戻るボタンの表示切り替え
   ========================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------
     1. ハンバーガーメニューの開閉
     ------------------------------------------------------ */
  var navToggle = document.getElementById("js-nav-toggle");
  var nav = document.getElementById("js-nav");

  if (navToggle && nav) {

    // メニューを閉じる
    function closeNav() {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }

    // ボタンクリックで開閉
    navToggle.addEventListener("click", function () {
      var willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("is-open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
    });

    // メニュー内のリンクを押したら閉じる
    nav.addEventListener("click", function (event) {
      if (event.target.closest(".nav__link")) {
        closeNav();
      }
    });

    // Escキーで閉じる
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    // タブレット・PC幅に広げたときは開いた状態を解除する
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        closeNav();
      }
    });
  }


  /* ------------------------------------------------------
     2. スクロール時の軽いフェードイン（opacity + translateY）
     ------------------------------------------------------ */
  var fadeItems = document.querySelectorAll(".fade-in");

  if (fadeItems.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // 一度表示したら監視をやめる
        }
      });
    }, {
      rootMargin: "0px 0px -10% 0px"
    });

    fadeItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    // IntersectionObserver非対応の場合はそのまま表示
    fadeItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }


  /* ------------------------------------------------------
     3. お品書きの分類切り替え
     ------------------------------------------------------ */
  var menuTabs = Array.prototype.slice.call(document.querySelectorAll(".menu__tab"));
  var menuPanels = Array.prototype.slice.call(document.querySelectorAll(".menu__panel"));

  if (menuTabs.length && menuPanels.length) {
    function selectMenuTab(selectedTab, moveFocus) {
      menuTabs.forEach(function (tab) {
        var isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
      });

      menuPanels.forEach(function (panel) {
        panel.hidden = panel.id !== selectedTab.getAttribute("aria-controls");
      });

      if (moveFocus) {
        selectedTab.focus();
      }
    }

    menuTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        selectMenuTab(tab, false);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = index;

        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % menuTabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + menuTabs.length) % menuTabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = menuTabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        selectMenuTab(menuTabs[nextIndex], true);
      });
    });

    selectMenuTab(menuTabs[0], false);
  }


  /* ------------------------------------------------------
     4. トップへ戻るボタン
     ------------------------------------------------------ */
  var toTop = document.getElementById("js-to-top");

  if (toTop) {
    // 300pxより下にスクロールしたら表示
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 300);
    }, { passive: true });

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

})();
