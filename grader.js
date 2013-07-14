#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT = "www.google.com";
var rest = require('restler');
var url_temp = "downloaded_url.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {n
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
   // console.log(instr);
    return instr;
};

var downloadHtml = function(externalurl) {

    rest.get(externalurl).on('complete', function(result) {
	if (result instanceof Error) {
	    console.log('Url does not exist. Using default index.html');
	    var instr = HTML_DEFAULT.toString();
	    return instr;
	    }
	else {
	fs.writeFileSync(url_temp,result);
	    var url_return = url_temp.toString();
	    return url_return;
	}
});
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html')
    .option('-u, --url <link>', 'url of html file')
        .parse(process.argv);
    if (program.file) {
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}
    if (program.url){
	rest.get(program.url).on('complete', function(result) {
        if (result instanceof Error) {
            console.log('Url does not exist.');
            //var instr = HTML_DEFAULT.toString();
            process.exit(1);
	    //return instr;
            }
        else {
        fs.writeFileSync(url_temp,result);
            var url_return = url_temp.toString();
            //return url_return;
	 //   console.log("url_return"+url_return);
	   // console.log("url_temp"+url_temp);
	    var checkJson = checkHtmlFile(url_return, program.checks);
	    var outJson = JSON.stringify(checkJson, null, 4);
	    console.log(outJson);
        }
});
}
	//console.log(program.file);
   // var checkJson = checkHtmlFile(program.file, program.checks);
    //var outJson = JSON.stringify(checkJson, null, 4);
    //console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}




