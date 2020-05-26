import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPage, updatePage, destroyPage } from '../store';


class Form extends Component {
  constructor({ page }){
    super();
    this.state = {
      title: page ? page.title : '',
      content: page ? page.content : '' 
    };
    this.onChange = this.onChange.bind(this);
    this.update = this.update.bind(this);
  }
  update(ev){
    ev.preventDefault();
    const { title, content } = this.state;

    this.props.updatePage({
      title, content
    });
  }
  onChange(ev){
    this.setState({ [ev.target.name ]: ev.target.value });
  }
  componentDidMount(){
    if(!this.props.page){
      this.props.fetchPage(this.props.id);
    }
  }
  componentDidUpdate(prevProps){
    if(!this.props.page && this.props.id !== prevProps.id){
      this.props.fetchPage(this.props.id);
    }
    if(!prevProps.page && this.props.page){
      this.setState({
        title: this.props.page.title,
        content: this.props.page.content
      });
    }
  }
  render(){
    const { page, pagesLoaded } = this.props;
    const { title, content } = this.state;
    const { onChange, update } = this;
    if(!page){
      return '...loading';
    }
    return (
      <div>
            <form onSubmit={ update } className='card'>
              <h3>Update Page</h3>
              <input name='title' value={ title } onChange={ onChange } placeholder='...title'/>
              <input name='content' value={ content } onChange={ onChange } placeholder='...content'/>
              <button className='btn btn-primary'>Update Page</button>
              <Link to={`/${ page.isHomePage ? '' : page.id }`}>Cancel</Link>
            </form>
      </div>
    );
  }
}

const mapStateToProps = ({ pages }, { match })=> {
  return {
    page: match.params.id ? pages[match.params.id] : Object.values(pages).find( page => page.isHomePage),
    id: match.params.id,
  };
};

const mapDispatchToProps = (dispatch, { history, match })=> {
  return {
    fetchPage: (id)=> dispatch(fetchPage(id, history)),
    updatePage: (page)=> {
      return dispatch(updatePage({page : {...page, id: match.params.id}, history}))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

