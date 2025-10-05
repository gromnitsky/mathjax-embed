/* globals MathJax */

// v4.0.0
window.MathJax = {
    output: {
        fontPath: '@mathjax/%%FONT%%-font'
    },
    startup: {
        ready() {
            MathJax.startup.defaultReady()
            MathJax.startup.promise.then(window.my_exit)
        }
    }
}

Object.assign(window.MathJax, window.my_mathjax_conf)

function main() {
    var script = document.createElement('script')
    script.src = 'mathjax/startup.js'
    document.head.appendChild(script)
}

document.addEventListener('DOMContentLoaded', main)
