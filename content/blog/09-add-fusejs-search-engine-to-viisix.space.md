+++
author = "Trong-Nghia Nguyen"
date = "2017-06-08T21:51:05+07:00"
feature_image = "/blog-images/add-fusejs-search-engine-to-viisix.space/01.png"
feature_image_v_adjust = 7.5
keywords = ["viisix", "viisix nghia fusejs", "fuse javascript search engine", "hugo fuse react webpack"]
summary = "We implemented a search box to our static site like every websites in the internet. And the Fuse.js Javascript search engine worked well on our browser with the speed of race cars. How to do it?"
title = "Add Fuse.js search engine to viisix.space"

+++
Before come to [Fuse.js](http://fusejs.io/), I did a search through [Hugo website](https://gohugo.io/tools#search)
and found out there are many options for implementing search with Hugo. Two of three solutions go with 
[Lunr](https://lunrjs.com), and I was wondering if there is any Javascript search engine beside it, 
then Fuse.js come in the game. Actually Lunr has more functions and features than Fuse.js, but Fuse.js [won at speed](http://fiatjaf.alhur.es/js-search-engines-comparison/) 
since it only do fuzzy search. So then, I chose Fuse.js.

## Implement steps

1. Generate the JSON index
    
    The search engine need an index to work on, so I generated ones using Hugo. For later conveniences, I created a
    Javascript object variable storing the whole index. First, create a partial template file in your theme's layout
    folder (for example `search_index.html`), the file's mission is to guide Hugo generating a JSON string.
     
    ```text
    {{- $.Scratch.Add "index" slice -}}
    {{- range $page := where .Data.Pages "Type" "in" (slice "algorijs" "blog" "projects") -}}
        {{- $.Scratch.Add "index" (dict "objectID" $page.Date.Unix "title" (htmlEscape $page.Title) "uri" $page.Permalink "summary" (plainify $page.Params.summary) "author" $page.Params.author "type" $page.Type) -}}
    {{- end -}}
    {{- $.Scratch.Get "index" | jsonify -}}
    ```
    
    In the main template file, declare a new variable and use `JSON.parse` function on the created partial.
    
    ```html
    <script type="text/javascript">
        var searchIndex = JSON.parse('{{ partial "search_index.html" . }}');
    </script>
    ```
    
    Then you can go to your browser's Javascript console to test if there is your search index:
    
    {{< figure src="/blog-images/add-fusejs-search-engine-to-viisix.space/02.png" alt="Test the search index variable" >}}

2. Making the Javascript library

    We will create a new folder call `search` in your template folder. Navigate into that folder and run these command
    
    ```bash
    $ npm init
    $ npm install --save-dev webpack babel-core babel-loader babel-preset-es2015 babel-preset-react
    $ npm install --save fuse.js react react-dom
    ```
    
    After that, the necessary node modules will be installed. I chose React to build my search component because it 
    offer me results immediately following what I typed in the search box. Another option is Vue.js which is 
    a great alternative for those who don't want to use React. Finally, we will package our script and the libraries 
    into a single Javascript file to public it to the browser side.
    
    Create `webpack.config.js` file
    
    ```javascript
    path = require('path');
    
    module.exports = {
        entry: {
            'search': "./search.js"
        },
        output: {
            path: path.resolve(__dirname, '../static/js'),
            filename: '[name].js'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }
            ]
        }
    };
    ```
    
    And `.babelrc`
    
    ```text
    {
      "presets" : ["es2015", "react"]
    }
    ```
    
    In our main script `search.js`, have a new Fuse.js instance created and reading the `searchIndex` variable
    
    ```javascript
    import Fuse from "fuse.js"
    
    let search_options = {
        keys: ["title", "summary"],
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1
    };
    let fuse = new Fuse(searchIndex, search_options);
    ```
    
    Add React import lines at the begin of the file and create your search components
    
    ```javascript
    import React from "react"
    import ReactDOM from "react-dom"
    
    /* ... */
 
    class Search extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                searchContent: ""
            };
    
            this.onChange = this.onChange.bind(this)
        }
    
        onChange (event) {
            this.setState({
                searchContent: event.target.value
            })
        }
    
        render () {
            let searchResults = searchIndex;
            if (this.state.searchContent !== "") {
                searchResults = fuse.search(this.state.searchContent)
            }
            return (
                <div className="searchBox">
                    <input className="input"
                           placeholder="Search..."
                           onChange={this.onChange}
                    />
                    <SearchResults results={searchResults}/>
                </div>
            )
        }
    }
 
    ReactDOM.render(<Search/>, document.getElementById('search-box'));
    ```
    
    You also need to write your own `SearchResults` component to display the results. After finishing, 
    issue the `webpack` command to build the public Javascript file.
    
3. Add search box to your website

    In this final step, you will go to the template which have the search index variable declared in previous steps,
    add the HTML node in the right position and then load the packaged Javascript file.
    
    ```html
    <div id="search-box"></div>
    <script async src="{{ .Site.BaseURL }}js/search.js?v={{ .Site.Params.Version }}"></script>
    ```
    
    That's it, add a few CSS code, or edit some search options, then you can have your own Search 
    box powered by Hugo and Fuse.js.
    
    {{< figure src="/blog-images/add-fusejs-search-engine-to-viisix.space/01.png" alt="Implemented search box" >}}
