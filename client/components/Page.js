import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPage, createPage, destroyPage } from '../store';

class Page extends Component {
  constructor(){
    super();
    this.state = {
      title: '',
      content: ''
    };
    this.onChange = this.onChange.bind(this);
    this.create = this.create.bind(this);
    this.destroy = this.destroy.bind(this);
  }
  destroy(){
    this.props.destroy(this.props.page);
  }
  create(ev){
    ev.preventDefault();
    const { title, content } = this.state;

    this.props.createPage({
      title, content, parentId: this.props.page.id
    })
    .then(()=> {
      this.setState({
        title: '',
        content: ''
      });
    })
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
  }
  render(){
    const { page } = this.props;
    const { title, content } = this.state;
    const { onChange, create, destroy } = this;
    if(!page){
      return '...loading';
    }
    return (
      <div>
        <Link to='/'>Site</Link>
        {
          page.parent && <Link to={`/${page.parent.isHomePage ? '' : page.parent.id}`}>{
            page.parent.title
          }</Link>
        }
        <h1>
          { page.title }
        </h1>
        <div>
          { page.content }
        </div>
        <ul>
          {
            page.children.map( child => {
              return (
                <li key={ child.id }>
                  <Link to={`/${child.id}`}>{ child.title }</Link>
                </li>
              );
            })
          }
        </ul>
        <button onClick={ destroy }>X</button>
        <form onSubmit={ create }>
          <h2>Add A Child</h2>
          <input name='title' value={ title } onChange={ onChange } />
          <input name='content' value={ content } onChange={ onChange } />
          <button>Save</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ pages }, { match })=> {
  return {
    page: match.params.id ? pages[match.params.id] : Object.values(pages).find( page => page.isHomePage),
    id: match.params.id
  };
};

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    destroy: (page)=> dispatch(destroyPage({ page, history })),
    fetchPage: (id)=> dispatch(fetchPage(id, history)),
    createPage: (page)=> {
      return dispatch(createPage({page, history}))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

