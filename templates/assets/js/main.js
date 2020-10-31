/* globals */
'use strict'

// Adds loaded class once everything has loaded
window.addEventListener('load', function (e) {
  document.documentElement.classList.add('loaded')
})
