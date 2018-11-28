import React, { Component } from 'react';

class Card extends Component {
    constructor(props) {
        super(props);
        this.name =  props.name
        this.list =  props.list
       }
    state = {  }
    generateList() {
        return this.list.map(key => {
            return <ul><li key={key} >{key}</li></ul>
        })
    }

    render() { 
        return (   <div className="col-lg-4 mb-4">
        <div className="card h-100">
          <h4 className="card-header">{this.name}</h4>
          <div className="card-body">
          <ul class="list-unstyled">
          <p className="card-text">             
                {this.generateList()}
              </p>
            </ul>
          </div>
          <div className="card-footer">
            <a href="#" className="btn btn-primary">Learn More</a>
          </div>
        </div>
      </div> );
    }
}
 
export default Card;