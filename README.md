# SF Planning Impact Fee Calculator (Under Development)

See the calculator in action [here](https://sfcpc.github.io/ifc/).

## Running Locally

To facilitate asynchronous loading of local json and html template files, the application must be run via an HTTP server. For a simple way to do this in development, run the following from the project root directory (requires Python):

```sh
python -m SimpleHTTPServer 8000
```
or
```sh
python3 -m http.server 8000
```

The impact fee calculator will then be running at <http://localhost:8000/>

[Atom](https://atom.io/) is recommended for editing, as the code is built to work with [the Atom livereload package](https://atom.io/packages/livereload).

## Adding Fee Types

To register new fee types with the system:

1.  create a folder for your fee type under `fees/` and add a module that defines the fee type's viewmodel as `viewmodel.js`
2.  add a reference to your folder name in the `feeTypes` property of `settings.json`

The fee type's viewmodel module should also register a component that has the same name as the folder for use in the fee type's form & report.

Fee type viewmodels should extend the interface defined in `fees/abstract-fee.js`, and the fee type component's viewmodel should use or extend `fees/abstract-component.js`.

You can see [`fees/balboa-park-infrastructure/`](https://github.com/sfcpc/ifc/tree/master/fees/balboa-park-infrastructure) for an example fee type.
