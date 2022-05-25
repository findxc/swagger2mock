swagger2mock is a tool to translate swagger.json to mock files.

Now it only translates GET requests. You can use [@findtools/mock-server](https://github.com/findxc/mock-server) as mock server, it will return 200 to unconfigured mock requests.

## How to use

Use `npx @findtools/swagger2mock -h` to see all options.

Use `npx @findtools/swagger2mock --url https://petstore.swagger.io/v2/swagger.json` to see an example. It will generate mock files. And check https://petstore.swagger.io/ to see the swagger ui.

The generated mock files are formated by prettier. If you want to custom prettier options, add a key `swagger2mock` in your `package.json` , following is an example. Besides, other options can be configured in `package.json` too.

```json
"swagger2mock": {
  "prettier": {
    "parser": "babel",
    "semi": false
  }
}
```
