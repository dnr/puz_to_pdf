`puz-to-pdf-csartisan` is a Node.js script that converts `.puz` files to `.pdf` files in the style of the CSArtisan print design. This is a useful tool for creating game graphics to be featured in the CSArtisan print. Currently, the converter only supports `.puz`, `.ipuz`, `.jpz`, and `.rgz` files.

## Usage
```bash
./main.js my.puz -g -d [MMDDYY]
```
Simply run the `main.js` file with the `.puz` file you wish to format from and the date in MMDDYY format (i.e. `122523` is December 25, 2023).
This script only really works for **Mini Crosswords** (5x5 to 7x7), any larger and the formatting will start to break. I plan to make a fix this in the future. 
### Arguments
`-d [MMDDYY]` or `--date [MMDDYY]` - specify the publish date above the title (required)
`-t [title]`  or `--title [title]` - specify custom title (optional)
`-g` or `--defaulttitle` - sets title to "Today's Mini Crossword" (optional, recommended)

### Variables
This script doesn't have *much flexibility* when it comes to layout shifting and such. At the moment, the only thing that you should have to change on a frequent basis is the `footer-offset` in `main.js`. I plan to either remove the need for this or make it a command arg.

---
## To-do
- [ ] Fix footer layout shift
- [ ] ... or make it a command arg
- [ ] Version for 15x15 (or 21x21)
- [ ] Convert grid drawing to `svg`
- [ ] Fix grid cropping
- [ ] Verbosity pass
- [x] Corner radius on grid
---
This application was made possible by the work of [David Reiss](https://github.com/dnr), [Nam Jin Yoon](https://github.com/njyoon), and [Alex Boisvert](https://github.com/boisvert42).