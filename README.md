# SF Planning Impact Fee Calculator

## (Under Development)

See the calculator in action [here](https://sfcpc.github.io/ifc/).

To facilitate loading of local json files, the application must be run via an HTTP server.  For a simple way to do this in development, run the following from the project root directory (requires Python):

```sh
python -m SimpleHTTPServer 8000
```

The impact fee calculator will then be running at http://localhost:8000/

[Atom](https://atom.io/) is recommended for editing, as the code is built to work with [the Atom livereload package](https://atom.io/packages/livereload).