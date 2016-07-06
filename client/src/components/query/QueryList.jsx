import React from 'react';
import http from '../../controller/appHttp.js';

export default class QueryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queries: props.queries
    };
  }

  onDelete(_id) {
    var queryToDelete = this.state.queries.filter((query) => query._id === _id)[0];
    
    http._delete('api/queries/' + queryToDelete._id, (err, res) => {
      if(err) {
        console.log(err);
      } else {
        var updated = this.state.queries;
        if(updated) {
          updated = updated.filter((query) => query._id !== queryToDelete._id);
          this.setState({queries: updated});
          this.props.onDeleteUpdate(updated);
        }
      }
    });
  }
  
  render(){
    return (
      <ul className="queries">
        {this.state.queries.map((query) => 
          <Query key={query._id} query={query} onDelete={this.onDelete.bind(this, query._id)} />
        )}
    </ul>);
  }
}

class Query extends React.Component {
  render() {
    var query = this.props.query;
    return (
      <li className="query">
        <div className="course-info"><span>{query.subject}</span><span>{query.courseNo}</span><span>{query.section}</span></div>
        <button className="delete" onClick={this.props.onDelete}>-</button>
      </li>
    );
  }
}
