Trigger a formatting between the two matching braces whenever user types '}', universally on any languages supporting range formatting.

Sometimes a language has a formatter, which has range formatting functionality (i.e. able to "Format Selection"), but lacks on-type formatting (i.e. able to format when user types certain keys). This extension adds the on-type formatting specifically for '}' key, to format the code block surrounded by the matching braces. It is equivalent to the "Automatically format block when I type a }" feature in Visual Studio 2022.

### Requirement

* The `editor.formatOnType` setting is required to set to `true` to activate the functionality.
* A language formatter capable of range formatting. Note that if the language formatter also comes with the "on-type" formatting feature, VSCode may prioritize the language formatter over this extension.

### Configuration

The extension comes with capability to customize on which languages will the functionality be used. By default all popular languages (such as C/C++, Java, JSON) are included. If this is not desired, tweak the `formatOnBrace.languages` setting.
