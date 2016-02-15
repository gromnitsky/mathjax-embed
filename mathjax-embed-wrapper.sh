#!/bin/sh

# Installation:
#
# ln -s /repo/with/mathjax-embed/mathjax-embed-wrapper.sh ~/bin

__filename=`readlink -f $0`
__dirname=`dirname ${__filename}`

exec ${__dirname}/mathjax-embed "$@"
