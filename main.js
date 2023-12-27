#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');

const argv = yargs
    .option('solution', {
        alias: 's',
        description: 'render the solution instead of a blank grid',
        type: 'boolean',
        default: false,
    })
    .help()
    .alias('help', 'h')
    .argv;


// monkey-patch some things that puz.js and puz_functions.js expect
global.window = global;
global.jspdf = require('jspdf');
global.alert = function(...args) {
  console.error(...args);
  process.exit(1);
};

const puz = require("./js/puz");
const funcs = require("./js/puz_functions");

// requiring these loads them into jspdf
require("./js/NunitoSans-Regular-bold");
require("./js/NunitoSans-Regular-normal");
require("./js/RobotoCondensed-bold");
require("./js/RobotoCondensed-normal");
//require("./js/OpenSansCondensed-bold");
//require("./js/OpenSansCondensed-normal");
// custom fonts:
require("./js/RobotoSerif-bold");
require("./js/RobotoSerif-normal");
require("./js/RobotoMono-bold");
require("./js/RobotoMono-normal");
require("./js/AtkinsonHyperlegible-bold");
require("./js/AtkinsonHyperlegible-normal");

function convert(filename, solution) {
  var contents = fs.readFileSync(filename).toString('binary');
  var puzdata = puz.parsepuz(contents);
  var outname = filename.replace(/[.](puz|ipuz|jpz|rgz)$/, '.pdf');
  if (outname === filename)
    outname += '.pdf';
  if (solution) {
    outname = outname.replace('.pdf', '-solution.pdf');
  }
  var options = {
    outfile: outname,
    output: 'download',
    // customizable:
    my_font: '',
    header_align: 'center',
    header2_align: 'center',
    subheader_align: 'center',
    y_align: 'alphabetic',
    gray: 0,
    // number: 10,
    clue_entry_pt: 10,

    header_pt: 40,
    // header2_pt: document.getElementById('h2FontSize').value*1,
    // subheader_pt: document.getElementById('sFontSize').value*1,

    margin: 160,
    side_margin: 80,
    // bottom_margin: document.getElementById('bottommarginSize').value*72,

    // header_width: document.getElementById('headerWidth').value*.01,
    grid_padding: 40,
    under_title_padding: 40,
    // header_indent: document.getElementById('hlPadding').value*1,
    // subheader_indent: document.getElementById('slPadding').value*1,
    // subheader_mt: document.getElementById('hsPadding').value*1,

    line_width: 0.8,
    border_width: 0.8,
    // column_padding: document.getElementById('columnPadding').value*1,
    
    clue_spacing: 0.5,
    
    heading_style: 'normal',
    number_style: 'bold',

    shade: false,
    solution: solution,

    header_font: 'RobotoSerif',
    grid_font: 'RobotoMono',
    clue_font: 'AtkinsonHyperlegible',

    right_header: true,
    subheader: true,
    copyright: false,
    // copyright_text: 'Play online at csartisan.org/games',

    // columns: document.getElementById('columns').value,
    grid_placement: 'top'
    // logoX: document.getElementById('logoX').value*1,
    // logoY: document.getElementById('logoY').value*1,
    // logoS: document.getElementById('logoS').value/100,
  };

  funcs.puzdata_to_pdf(puzdata, options);
}

if (argv._.length != 1) {
    throw 'Need exactly one positional arg (path to file to convert)';
}
convert(argv._[0], argv.solution);
