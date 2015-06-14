# quicktech-ui

## Quick start

1) install node (with npm)
2) install bower
3) install grunt
4) move into project folder
5) run command `bower install`
6) run command `npm install`
7) start server using `grunt serve` command

## Build & development

Run `grunt serve` for preview.
If you have started quicktech server on your local environment then run  `grunt serveLocal` for preview.

To apply changes on beta3 server run `grunt build` before commit 

NOTE: Do not commit node_modules and bower_components folders and app/index.html file!

## Testing

Running `grunt test` will run the unit tests with karma.
