import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchPage } from '../store';

class Page extends Component {
  constructor(){
    super();
    this.state = {
      title: '',
      content: ''
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(ev){
    this.setState({ [ev.target.name ]: ev.target.value });

  }
  componentDidMount(){
    if(!this.props.page){
      this.props.fetchPage(this.props.id);
    }
  }
  render(){
    const { page } = this.props;
    const { title, content } = this.state;
    const { onChange } = this;
    if(!page){
      return '...loading';
    }
    return (
      <div>
        <h1>
          { page.title }
        </h1>
        <div>
          { page.content }
        </div>
        <form>
          <h2>Add A Child</h2>
          <input name='title' value={ title } onChange={ onChange } />
          <input name='content' value={ content } onChange={ onChange } />
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ pages }, { match })=> {
  console.log(pages);
  return {
    page: match.params.id ? pages[match.params.id] : Object.values(pages).find( page => page.isHomePage),
    id: match.params.id
  };
};

const mapDispatchToProps = (dispatch)=> {
  return {
    fetchPage: (id)=> dispatch(fetchPage(id)) 
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

