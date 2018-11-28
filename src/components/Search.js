import React from 'react';

 
const Search = () => {

    return (
        <div className="search_wrapper">
             <form action="/search" method="GET">
                <input className="searchbox" placeholder="Search the blog" type="text" name="search" id="search"/>
                <input className="btn btn-primary" type="submit" value="Search"/>
            </form>
         </div>
    );
}

export default Search