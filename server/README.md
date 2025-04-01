

### File structure

bin/: Contains binary executable files or scripts that can be run directly by the system.

data/: Stores data files, like databases, JSON, etc.

lib/: Installed modules.
//Tried to move node.js into this folder but didnt succeed :(

log/: Debug logs.

src/: Source code, i.e. .ts. (Also .js if directly written in it).
tmp/: Temporary files.

dist/: Distribution, i.e. production ready code such as transpiled .ts files




### Compilation
To comp. all tsc files type "tsc" in the terminal when youre located in the "server" folder


### To run
node .\dist\server