import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPage, updatePage, destroyPage } from '../store';


class Form extends Component {
  constructor({ page }){
    super();
    this.state = {
      title: page ? page.title : '',
      content: page ? page.content : '',
      imageData: '',
      removeImage: false
    };
    this.onChange = this.onChange.bind(this);
    this.update = this.update.bind(this);
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
  update(ev){
    ev.preventDefault();
    const { title, content, imageData, removeImage } = this.state;

    this.props.updatePage({
      title, content, imageData, removeImage
    });
  }
  onChange(ev){
    this.setState({ [ev.target.name ]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value });
  }
  componentDidMount(){
    if(!this.props.page){
      this.props.fetchPage(this.props.id);
    }
    this.loadFileReader();
  }
  componentDidUpdate(prevProps){
    this.loadFileReader();
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
    const { title, content, imageData, removeImage } = this.state;
    const { onChange, update } = this;
    if(!page){
      return '...loading';
    }
    console.log(removeImage);
    return (
      <div>
            <form onSubmit={ update } className='card'>
              <h3>Update Page</h3>
              <input ref={ el => this.el = el } type='file' />
              {
                page.image && <img src={ page.image.url } />
              }
              {
                page.image && <label>
                  Remove Image
                  <input name='removeImage' type='checkbox' onChange={onChange}/>
                  </label>
              }
              <input name='title' value={ title } onChange={ onChange } placeholder='...title'/>
              <textarea name='content' value={ content } onChange={ onChange } placeholder='...content'/>
              <button className='btn btn-primary'>Update Page</button>
              <Link to={`/${ page.isHomePage ? '' : page.id }`}>Cancel</Link>
            </form>
      </div>
    );
  }
}

const mapStateToProps = ({ pages }, { location, match })=> {
  return {
    page: match.params.id ? pages[match.params.id] : Object.values(pages).find( page => page.isHomePage),
    id: match.params.id
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

