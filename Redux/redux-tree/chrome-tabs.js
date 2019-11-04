(function() {
  var $, animationStyle, chromeTabs, defaultNewTabData, tabTemplate;

  $ = jQuery;

  if (document.body.style['-webkit-mask-repeat'] !== void 0) {
    $('html').addClass('cssmasks');
  } else {
    $('html').addClass('no-cssmasks');
  }

  tabTemplate = '<div class="chrome-tab">\n    <div class="chrome-tab-favicon"></div>\n    <div class="chrome-tab-title"></div>\n    <div class="chrome-tab-close"></div>\n    <div class="chrome-tab-curves">\n        <div class="chrome-tab-curves-left-shadow"></div>\n        <div class="chrome-tab-curves-left-highlight"></div>\n        <div class="chrome-tab-curves-left"></div>\n        <div class="chrome-tab-curves-right-shadow"></div>\n        <div class="chrome-tab-curves-right-highlight"></div>\n        <div class="chrome-tab-curves-right"></div>\n    </div>\n</div>';

  defaultNewTabData = {
    title: 'New Tab',
    favicon: '',
    data: {}
  };

  var ACTION = {
    SWITCH_TAB : 'switchTab',
    CLOSE_CURRENT_TAB : 'close-current',
    DB_CLICK_TABBAR : 'dblclick tabbar',

  }

  animationStyle = document.createElement('style');

  chromeTabs = {
    init: function(options) {
      var render;
      this.options = options;
      $.extend(options.$shell.data(), options);
      options.$shell.prepend(animationStyle);
      options.$shell.find('.chrome-tab').each(function() {
        return $(this).data().tabData = {
          data: {}
        };
      });
      render = function() {
        return chromeTabs.render(options.$shell);
      };
      $(window).resize(render);
      return render();
    },
    render: function($shell) {
      chromeTabs.fixTabSizes($shell);
      chromeTabs.fixZIndexes($shell);
      chromeTabs.setupEvents($shell);
      chromeTabs.setupSortable($shell);
      return $shell.trigger('chromeTabRender');
    },
    setupSortable: function($shell) {
      var $tabs;
      $tabs = $shell.find('.chrome-tabs');
      return $tabs.sortable({
        axis: 'x',
        tolerance: 'pointer',
        cancel: '.chrome-tab-close',
        start: function(e, ui) {
          ui.item.addClass('ui-sortable-draggable-item');
          $shell.addClass('chrome-tabs-sorting');
          chromeTabs.setupTabClones($shell, ui.item);
          chromeTabs.fixZIndexes($shell);
          if (!$(ui.item).hasClass('chrome-tab-current')) {
            return $tabs.sortable('option', 'zIndex', $(ui.item).data().zIndex);
          } else {
            return $tabs.sortable('option', 'zIndex', $tabs.length + 40);
          }
        },
        stop: function(e, ui) {
          $('.ui-sortable-draggable-item').removeClass('ui-sortable-draggable-item');
          $shell.removeClass('chrome-tabs-sorting');
          chromeTabs.cleanUpTabClones($shell);
          return chromeTabs.setCurrentTab($shell, $(ui.item));
        },
        change: function(e, ui) {
          var placeholderIndex;
          placeholderIndex = ui.placeholder.index();
          if (ui.helper.index() <= placeholderIndex) {
            placeholderIndex -= 1;
          }
          return chromeTabs.animateSort($shell, placeholderIndex);
        }
      });
    },
    animateSort: function($shell, newPlaceholderIndex) {
      var $clone, $placeholder, delta, placeholderIndex;
      $clone = $shell.find('.chrome-tabs.chrome-tabs-clone');
      $placeholder = $clone.find('.ui-sortable-placeholder');
      placeholderIndex = $placeholder.index();
      delta = newPlaceholderIndex - placeholderIndex;
      if (delta === -1) {
        if (newPlaceholderIndex - 1 < 0) {
          return $clone.prepend($placeholder);
        } else {
          return $($clone.find('.chrome-tab').get(newPlaceholderIndex - 1)).after($placeholder);
        }
      } else if (delta === 1) {
        return $($clone.find('.chrome-tab').get(newPlaceholderIndex)).after($placeholder);
      }
    },
    setupTabClones: function($shell) {
      var $clone, $lastClone, $tabsContainer;
      $lastClone = $shell.find('.chrome-tabs.chrome-tabs-clone');
      $tabsContainer = $shell.find('.chrome-tabs').first();
      $clone = $tabsContainer.clone().addClass('chrome-tabs-clone');
      $clone.find('.ui-sortable-helper, .ui-sortable-draggable-item').remove();
      $clone.find('.chrome-tab').css('position', '');
      if ($lastClone.length) {
        return $lastClone.replaceWith($clone);
      } else {
        return $tabsContainer.after($clone);
      }
    },
    cleanUpTabClones: function($shell) {
      return $shell.find('.chrome-tabs.chrome-tabs-clone').remove();
    },
    fixTabSizes: function($shell) {
      var $tabs, margin, width;
      $tabs = $shell.find('.chrome-tab');
      margin = (parseInt($tabs.first().css('marginLeft'), 10) + parseInt($tabs.first().css('marginRight'), 10)) || 0;
      width = $shell.width() - 50;
      width = (width / $tabs.length) - margin;
      width = Math.max($shell.data().minWidth, Math.min($shell.data().maxWidth, width));
      $tabs.css({
        width: width
      });
      return setTimeout(function() {
        return chromeTabs.setupAnimationStyles($shell);
      });
    },
    setupAnimationStyles: function($shell) {
      var $tabs, offsetLeft, styleHTML;
      styleHTML = '';
      offsetLeft = $shell.find('.chrome-tabs').offset().left;
      $tabs = $shell.find('.chrome-tabs:not(.chrome-tabs-clone) .chrome-tab');
      $tabs.each(function(i) {
        var $tab, left;
        $tab = $(this);
        left = $tab.offset().left - offsetLeft - parseInt($tabs.first().css('marginLeft'), 10);
        return styleHTML += ".chrome-tabs-clone .chrome-tab:nth-child(" + (i + 1) + ") {\n    left: " + left + "px\n}";
      });
      return animationStyle.innerHTML = styleHTML;
    },
    fixZIndexes: function($shell) {
      var $tabs;
      $tabs = $shell.find('.chrome-tab');
      return $tabs.each(function(i) {
        var $tab, zIndex;
        $tab = $(this);
        zIndex = $tabs.length - i;
        if ($tab.hasClass('chrome-tab-current')) {
          zIndex = $tabs.length + 40;
        }
        $tab.css({
          zIndex: zIndex
        });
        return $tab.data({
          zIndex: zIndex
        });
      });
    },
    setupEvents: function($shell) {
      var self = this;
      $shell.unbind('dblclick').bind('dblclick', function() {
        return chromeTabs.addNewTab($shell,null,ACTION.DB_CLICK_TABBAR);
      });
      return $shell.find('.chrome-tab').each(function() {
        var $tab;
        $tab = $(this);
        $tab.unbind('click').click(function() {
          return chromeTabs.setCurrentTab($shell, $tab,null);
        });
        $tab.unbind('mouseup').mouseup(function(e){
          if(!$tab.hasClass('chrome-tab-current')){
            var target = e.target;
            if(target.className !='chrome-tab-close'){
              if(self.options.onTabActive){
                self.options.onTabActive($tab.data().tabData.data);
              }
            }
            
          }
            
        });
        return $tab.find('.chrome-tab-close').unbind('click').click(function() {
          return chromeTabs.closeTab($shell, $tab);
        });
      });
    },
    addNewTab: function($shell, newTabData, action, callback) {
      var $newTab, tabData;
      $newTab = $(tabTemplate);
      $shell.find('.chrome-tabs').append($newTab);
      var title = newTabData.data.node.path;
      $($newTab).attr('title',title);
      tabData = $.extend(true, {}, defaultNewTabData, newTabData);
      chromeTabs.updateTab($shell, $newTab, tabData);
      if(this.options.onTabActive){
          this.options.onTabActive(tabData.data);
        }
      return chromeTabs.setCurrentTab($shell, $newTab,action,callback);
    },
    setCurrentTab: function($shell, $tab,action,callback) {
      $shell.find('.chrome-tab-current').removeClass('chrome-tab-current');
      $tab.addClass('chrome-tab-current');
      if(action == ACTION.SWITCH_TAB){
        if(this.options.onTabActive){
          this.options.onTabActive($tab.data().tabData.data);
        }
      }else
      if(action == ACTION.DB_CLICK_TABBAR){
        if(this.options.onTabbarDbClick){
          this.options.onTabbarDbClick($tab);
        }
      } else
      if(action == ACTION.CLOSE_CURRENT_TAB){
        if(this.options.onTabActive){
          this.options.onTabActive($tab.data().tabData.data);
        }
      }
      if(callback){
        callback($tab.data().tabData.data);
      }

      return chromeTabs.render($shell);
    },
    closeTab: function($shell, $tab) {
      if ($tab.hasClass('chrome-tab-current')) {
        if ($tab.prev().length) {
          chromeTabs.setCurrentTab($shell, $tab.prev(), ACTION.CLOSE_CURRENT_TAB);
        } else if ($tab.next().length) {
          chromeTabs.setCurrentTab($shell, $tab.next(), ACTION.CLOSE_CURRENT_TAB);
        }

        if(this.options.onCloseCurrentTab){
          this.options.onCloseCurrentTab($tab.data().tabData.data);
        }
      }else{
        if(this.options.onCloseHiddenTab){
          this.options.onCloseHiddenTab($tab.data().tabData.data);
        }
      }
      $tab.remove();
      return chromeTabs.render($shell);
    },
    updateTab: function($shell, $tab, tabData) {
      $tab.find('.chrome-tab-title').html(tabData.title);
      $tab.find('.chrome-tab-favicon').css({
        backgroundImage: "url('" + tabData.favicon + "')"
      });
      return $tab.data().tabData = tabData;
    }
  };

  window.chromeTabs = chromeTabs;

}).call(this);


