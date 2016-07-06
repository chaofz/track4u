import React from 'react';
import QueryList from './QueryList.jsx';
import SelectBox from './SelectBox.jsx';
import http from '../../controller/appHttp';
import auth from '../../controller/auth';
import catalog from '../../model/catalogStore';

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.onAddQuery = this.onAddQuery.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.onDeleteUpdate = this.onDeleteUpdate.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.state = {
      queries: [],
      dupliQueryId: '',
      subject: '',
      courseNo: '',
      section: '',
      err: ''
    };
  }

  onSelect(purpose, select) {
    switch(purpose) {
      case 'subject':
        this.setState({subject: select, err: ''});
        break;
      case 'courseNo':
        this.setState({courseNo: select, err: ''});
        break;
      case 'section':
        this.setState({section: select, err: ''});
    }
  }

  onAddQuery(e) {
    e.preventDefault();
    var queryToAdd = {
      subject: this.state.subject,
      courseNo: this.state.courseNo,
      section: this.state.section
    };
    if(this.validateInputs(queryToAdd)) {
      http._post('/api/queries', queryToAdd, (err, res) => {
        if(err) {
          this.setState({err : err.message});
        } else {
          var updated = this.state.queries;
          updated.push(res);
          this.setState({queries: updated});
        }
      });
    }
  }

  validateInputs(queryToAdd) {
    if(!queryToAdd.subject || !queryToAdd.courseNo || !queryToAdd.section) {
      this.setState({err : 'Pleasw enter the class.'});
      return false;
    }
    var duplicatedQuery = this.state.queries.filter((query) => 
      query.subject == queryToAdd.subject &&
      query.courseNo === queryToAdd.courseNo &&
      query.section === queryToAdd.section
    );
    if(duplicatedQuery.length > 0) {
      this.setState({err : 'You already submitted this query.', 
        dupliQueryId: duplicatedQuery[0]._id});
      return false;
    }
    if(!catalog.checkClass(queryToAdd)) {
      this.setState({err : 'This class does not exist.'});
      return false;
    }
    return true;
  }

  onDeleteUpdate(queries){
    this.setState({queries: queries, err: ''});
  }

  loadQueries(queries) {
    var updated = this.state.queries;
    queries.forEach(function(query) {
      updated.push(query);
    });
    this.setState({queries: updated});
  }

  componentWillMount(newProps, oldProps) {
    http._get('/api/queries', (err, res) => {
      if(err) { 
        this.setState({err: err.message});
      } else {
        this.loadQueries(res);
      }
    });
    auth.inDashboard(true);
  }

  componentDidMount() {
    catalog.loadCatalog((err, res) => {
      if(err) {
        this.setState({err: err.message});
      } else {
        this.setState({catalog: res});
      }
    });
  }

  render() {
    return (
      <div className="dashboard">
        <p className="title">Classes</p>
        <form id="query-form" onSubmit={this.onAddQuery}>
          <SelectBox purpose="subject" onSelect={this.onSelect}></SelectBox>
          <SelectBox purpose="courseNo" onSelect={this.onSelect} subject={this.state.subject}></SelectBox>
          <SelectBox purpose="section" onSelect={this.onSelect} subject={this.state.subject} courseNo={this.state.courseNo}></SelectBox>
          <button type="submit">Add</button>
        </form>
        {this.state.err && <p className='err'>{this.state.err}</p>}
        <QueryList queries={this.state.queries} dupliQueryId={this.state.dupliQueryId} onDeleteUpdate={this.onDeleteUpdate} />
      </div>
    );
  }
};

function switchPlaceholer(purpose) {
  switch(purpose) {
    case 'subject': return 'MATH';
    case 'courseNo': return '1210';
    case 'section': return '001';
  }
}

          // <span className="input subj">
          //   <input type="text" ref='subject' onChange={this.onSubjChange.bind(this)} value={this.state.subject} placeholder="MATH" />
          //   {this.state.subject && <SelectBox className="subj" onSuggestionSelect={this.onSuggestionSelect} heading={this.state.subject}></SelectBox>}
          // </span>
          // <span className="input cour">
          //   <input type="text" ref='courseNo' onChange={this.onCouChange.bind(this)} placeholder="1210" />
          //   {this.state.courseNo && <SelectBox className="cour" heading={this.state.courseNo}></SelectBox>}
          // </span>
          // <span className="input sect">
          //   <input type="text" ref='section' onChange={this.onSectChange.bind(this)} placeholder="001" />
          //   {this.state.section && <SelectBox className="sect" heading={this.state.section}></SelectBox>}
          // </span>
