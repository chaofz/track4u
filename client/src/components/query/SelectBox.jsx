import React from 'react';
import http from '../../controller/appHttp.js';
import catalog from '../../model/catalogStore';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      purpose: props.purpose,
      input: '',
      matches: null
    };
  }

  onChange(e) {
    match(this, e.target.value);
  }

  onSelect(select) {
    this.setState({ input: select, matches: null });
    this.props.onSelect(this.state.purpose, select);
  }

  onBlur(e) {
    var matches = this.state.matches;
    var input = this.state.input.toUpperCase();
    if(matches === 'no matches' || !matches) {
      this.onSelect('');
    } else if (matches && matches.includes(input)) {
      this.onSelect(input);
    } 
  }
  
  render(){
    var input = this.state.input.toUpperCase();
    var dropdown;
    if(this.state.matches) {
      dropdown = this.state.matches !== 'no matches' ? (
        <ul className="sugg">
          {this.state.matches.map((match) => 
            <li onClick={this.onSelect.bind(this, match)}><b>{input}</b>{match.substring(input.length)}</li>
          )}
        </ul>
        ) : (
        <ul className="sugg">
          <span>No matches</span>
        </ul>
        );
    } else {
      dropdown = null;
    }

    var type = switchType(this.state.purpose);
    var placeholder = switchPlaceholer(this.state.purpose);
    return (
      <span className="input">
        <input type={type} onChange={this.onChange.bind(this)} onBlur={this.onBlur.bind(this)} value={this.state.input} placeholder={placeholder} />
        {dropdown}
      </span>
    );
  }
};

var currSubject ='';

function match(self, input) {
  var matches;
  switch(self.state.purpose) {
    case 'subject': 
      matches = catalog.getMatchedSubjects(input);
      break;
    case 'courseNo': 
      matches = catalog.getMatchedCourseNo(self.props.subject, input);
      break;
    case 'section': 
      matches = catalog.getMatchedSections(self.props.subject, self.props.courseNo, input);
      break;
  }
  self.setState({ input: input, matches: matches });
}

function switchPlaceholer(purpose, type, placeholder) {
  switch(purpose) {
    case 'subject': return 'Subject';
    case 'courseNo': return 'Number';
    case 'section': return 'Section';
  }
}

function switchType(purpose, type, placeholder) {
  switch(purpose) {
    case 'subject': return 'text';
    case 'courseNo': return 'number';
    case 'section': return 'number';
  }
}
