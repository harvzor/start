# Start - my personal start page

![Start page](/project/start-1920x1080.jpg)

*background image from National Geographic - https://www.nationalgeographic.com/photography/photo-of-the-day/2018/12/polar-bear-arctic-sunrise/*

## About

This is my personal start page. Every time I open up a new tab in my browser, it opens up this page.

Hosted at https://start.harveywilliams.net/.

## Features

**The links** are to sites which I use everyday.

**The background image** is loaded from [National Geographic's Photo of the Day](https://www.nationalgeographic.com/photography/photo-of-the-day). Each day, they upload a new photo of the world which is loaded on my start page by consuming the API.

**To ensure that the website always loads fast** I have experimented in using a Service Worker - all resources are cached and retrieved from the Service Worker cache so the page should always load immediately.

## Developing

`npm start` will run Gulp, which willn the website and build JS/SCSS.

### Requirements

Use version `8.15.1` to get `node-sass` to work. `10.15.3` so far has issues.

- `node-sass` needs `python` and `msbuild`
  - install python `choco install python2 -y`
  - install msbuild `choco install microsoft-build-tools -y` (any issues, look at https://github.com/sass/node-sass/issues/2433#issuecomment-419446913)
