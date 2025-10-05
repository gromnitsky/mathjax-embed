/* globals MathJax */

// v4.0.0
window.MathJax = {
    output: {
        fontPath: 'node_modules/@mathjax/%%FONT%%-font'
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
    script.src = 'node_modules/mathjax/startup.js'
    document.head.appendChild(script)
}

document.addEventListener('DOMContentLoaded', main)
