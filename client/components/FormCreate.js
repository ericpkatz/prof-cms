import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createPage } from '../store';


class Form extends Component {
  constructor({ page }){
    super();
    this.state = {
      title: '',
      content: '',
      imageData: ''
    };
    this.onChange = this.onChange.bind(this);
    this.create = this.create.bind(this);
  }
  create(ev){
    ev.preventDefault();
    const { title, content, imageData } = this.state;

    this.props.createPage({
      title, content, imageData
    });
  }
  onChange(ev){
    this.setState({ [ev.target.name ]: ev.target.value });
  }
  loadFileReader(){
    if(this.el && !this.el.loaded){
      this.el.loaded = true;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', ()=> {
        this.setState({ imageData: fileReader.result });
      });
      this.el.addEventListener('change', ()=> {
        fileReader.readAsDataURL(this.el.files[0]);
      });
    }
  }
  componentDidMount(){
    this.loadFileReader();
  }
  componentDidUpdate(prevProps){
    this.loadFileReader();
  }
  render(){
    const { parentPage, pagesLoaded } = this.props;
    const { title, content, imageData } = this.state;
    const { onChange, create } = this;
    if(!parentPage){
      return '...loading';
    }
    return (
      <div>
            <form onSubmit={ create } className='card'>
              <h3>Create Page Under { parentPage.title }</h3>
              <input ref={ el => this.el = el } type='file' />
              <input name='title' value={ title } onChange={ onChange } placeholder='...title'/>
              <textarea name='content' value={ content } onChange={ onChange } placeholder='...content'/>
              <button className='btn btn-primary'>Create Page</button>
              <Link to={`/${ parentPage.isHomePage ? '' : parentPage.id }`}>Cancel</Link>
            </form>
      </div>
    );
  }
}

const mapStateToProps = ({ pages }, { location, match })=> {
  return {
    parentPage: match.params.id ? pages[match.params.id] : Object.values(pages).find( page => page.isHomePage),
    id: match.params.id
  };
};

const mapDispatchToProps = (dispatch, { history, match })=> {
  return {
    fetchPage: (id)=> dispatch(fetchPage(id, history)),
    createPage: (page)=> {
      return dispatch(createPage({page : {...page, parentId: match.params.id}, history}))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

