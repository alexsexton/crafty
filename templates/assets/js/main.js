/* globals jQuery, Modernizr */
'use strict'

jQuery(function ($) {
  // ## Navigation
  var $navHandler = $('.site-nav--trigger')
  var $subnavHandler = $('.nav-subnav--handler')

  var bodyOpenClasses = [
    'subnav--open',
    'site-nav--open'
  ]

  // ## Mobile nav trigger
  $navHandler.on('click', function (e) {
    e.preventDefault()
    var navBodyOpenClass = 'site-nav--open'
    $('body').toggleClass(navBodyOpenClass)
    $('*').removeClass('is-open')
  })

  // ## Sub Nav
  $subnavHandler.each(function (i) {
    var $this = $(this)
    var $subnav = $this.next()
    var subNavOpenClass = 'c-subnav--open'
    var subNavBodyOpenClass = 'subnav--open'

    $navHandler.on('click', function (e) {
      e.preventDefault()
      var isOpen = $subnav.hasClass(subNavOpenClass)
      if (isOpen) {
        $subnav.removeClass(subNavOpenClass)
      }
      var hasClass = $('body').hasClass(subNavBodyOpenClass)
      if (hasClass) {
        $('body').removeClass(subNavBodyOpenClass)
      }
    })

    $this.on('click', function (e) {
      e.preventDefault()
      $('body').removeClass(bodyOpenClasses)
      var isOpen = $subnav.hasClass(subNavOpenClass)
      // remove all open subnav classes, therefore closing any that are open
      $('.' + subNavOpenClass).removeClass(subNavOpenClass)
      // if the corresponding subnav was closed already, user intends to open it
      if (!isOpen) {
        $subnav.addClass(subNavOpenClass)
        $('body').addClass(subNavBodyOpenClass)
      }
    })
  }).bind()

  // ## Swap image on hover
  var productImageHover = function () {
    if (!Modernizr.touchevents) {
      $(document).on('mouseenter mouseleave', '.c-image-thumbnail--hover img', function () {
        var swapImg = this.getAttribute('data-swap-src')
        var img = this.getAttribute('src')
        $(this).attr('src', swapImg)
        $(this).attr('data-swap-src', img)
      }, function () {
        var swapImg = this.getAttribute('data-swap-src')
        var img = this.getAttribute('src')
        $(this).attr('src', swapImg)
        $(this).attr('data-swap-src', img)
      })
    }
  }

  // Call on resize
  $(window).resize(function () {
    productImageHover()
  })
  // Call functions on ready
  productImageHover()
})

// ## Add loaded class once everything has loaded
jQuery(document).ready(function ($) {
  $('html').addClass('loaded')
})
