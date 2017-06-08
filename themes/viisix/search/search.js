import React from "react"
import ReactDOM from "react-dom"
import Fuse from "fuse.js"

let search_options = {
    keys: [
        {
            name: 'title',
            weight: "0.5"
        },
        {
            name: 'summary',
            weight: "0.3"
        },
        {
            name: 'author',
            weight: "0.1"
        },
        {
            name: 'type',
            weight: "0.1"
        }
    ],
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1
};
let fuse = new Fuse(searchIndex, search_options);


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


class SearchResults extends React.Component {
    render () {
        let result_rows = [];
        let results = this.props.results;
        results.sort(function(a, b) {
            return a.objectId - b.objectId
        });
        for (let i in results) {
            result_rows.push(
                <a key={i} className="pl1 pb1 flex text-decoration-none hover-underline black"
                   href={results[i].uri}
                >
                    <span className="bold italic inline-block col col-2">{capitalize(results[i].type)}</span>
                    <span className="bold inline-block">{results[i].title}</span>
                </a>
            )
        }
        return (
            <div className="overflow-scroll searchResult">
                {result_rows}
            </div>
        )
    }
}


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
