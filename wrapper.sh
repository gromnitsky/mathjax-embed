#!/bin/sh

__filename=`readlink -f "$0"`
__dirname=`dirname "${__filename}"`
exec "${__dirname}"/mathjax-embed.js "$@"
