#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');
const moment = require('moment'); // For Node.js environments

const argv = yargs
  .scriptName("puz-to-pdf-csartisan")
  .usage('$0 <file> [args]')

  // Solution ARG
  .option(
    'solution', {
    alias: 's',
    description: 'render the solution instead of a blank grid',
    type: 'boolean',
    default: false,
  }
  )

  // Date ARG
  .option(
    'date', {
    alias: 'd',
    description: 'specify a date in (MMDDYY) format',
    type: 'string',
  }
  )

  // Date ARG
  .option(
    'title', {
    alias: 't',
    description: 'specify a custom title',
    type: 'string',
  }
  )

  // Date ARG
  .option(
    'defaulttitle', {
    alias: 'g',
    description: "set title to 'Today's Mini Crossword'",
    type: 'boolean',
    default: false,
  }
  )

  .help()
  .alias('help', 'h')
  .argv;

/* Date */
if (argv.date) {
  // console.log("Input date:", argv.date);
  var wordDate = moment(argv.date, "MMDDYY").format('MMMM D, YYYY');
  console.log("Date:", wordDate);
} else {
  console.warn("No date specified, skipping...");
}

// monkey-patch some things that puz.js and puz_functions.js expect
global.window = global;
global.jspdf = require('jspdf');
global.alert = function (...args) {
  console.error(...args);
  process.exit(1);
};

const puz = require("./js/puz");
const funcs = require("./js/puz_functions");

/* Get Fonts */
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
require("./js/AtkinsonHyperlegible-italic");

function convert(filename, solution, wordDate, defaultTitle, customTitle) {
  var contents = fs.readFileSync(filename).toString('binary');
  var puzdata = puz.parsepuz(contents);
  var outname = filename.replace(/[.](puz|ipuz|jpz|rgz)$/, '.pdf');
  if (outname === filename)
    outname += '.pdf';
  if (solution) {
    outname = outname.replace('.pdf', '-solution.pdf');
  }


  /* Title ARG handling */
  //console.log("customTitle:", customTitle)
  //console.log("defaultTitle:", defaultTitle)
  if (defaultTitle) {
    var title = "Today's Mini Crossword";
    console.log("Title: default");
  } else {
    if (customTitle != '') {
      console.log("Title: custom");
      var title = customTitle;
    } else {
      console.log("Title: .puz specified");
    }
  }

  var options = {
    outfile: outname,
    output: 'download',
    // customizable:

    solution: solution,

    /* Puzzle Data */
    title: title,
    date: true,
    date_text: wordDate,

    /* Fonts */
    header_font: 'RobotoSerif',
    author_font: 'RobotoSerif',
    grid_font: 'RobotoMono',
    clue_font: 'AtkinsonHyperlegible',
    footer_font: 'AtkinsonHyperlegible',

    header_pt: 32,
    // clue_pt: 20,
    // subheader_pt: document.getElementById('sFontSize').value*1,

    heading_style: 'normal',
    number_style: 'bold',
    footer_style: 'italic',


    number_pct: 30,

    grid_size: 180,
    cell_size: 36,

    line_width: 0.8,
    border: false,
    // border-width: 0.6,
    // column_padding: document.getElementById('columnPadding').value*1,

    margin: 160,
    side_margin: 80,
    // bottom_margin: document.getElementById('bottommarginSize').value*72,

    header_width: 50,
    grid_padding: 40,
    under_title_padding: 50,
    subheader_mt: 8,
    clue_spacing: 0.7,
    // header_indent: document.getElementById('hlPadding').value*1,
    // subheader_indent: document.getElementById('slPadding').value*1,
    footer_offset: 0,

    shade: false,
    gray: 0, // this breaks the whole grid for some reason


    y_align: 'alphabetic',

    right_header: false,
    subheader: true,
    copyright: false,
    // copyright_text: 'Play online at csartisan.org/games',

    footer: true,
    footer_text: 'Play online at csartisan.org/games',
    footer_align: 'center',

    // columns: 2,
    grid_placement: 'top'

  };

  funcs.puzdata_to_pdf(puzdata, options);
}

if (argv._.length != 1) {
  throw 'Need exactly one positional arg (path to file to convert)';
}
convert(argv._[0], argv.solution, wordDate, argv.defaulttitle, argv.title);
