# Esprima-Joern

This script uses Esprima to generate abstract syntax trees (ASTs) for Joern, in either C format or PHP format.

# Usage

First time use:

```
npm install
```

To generate AST for `test.js`:

```
node main.js test.js
```

Note that the script can only write CSV files to the current working directory.

To switch between C format and PHP format, or to choose a delimiter for CSV files, please open `main.js` and modify the first few lines.