import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { updatePage, destroyPage } from '../store';


class Form extends Component {
  constructor({ page }){
    super();
    this.state = {
      title: page ? page.title : '',
      content: page ? page.content : '',
      parentId: page && page.parentId ? page.parentId: '',
      imageData: '',
      removeImage: false,
      error: ''
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
    const { title, content, imageData, removeImage, parentId } = this.state;

    this.props.updatePage({
      title, content, imageData, removeImage, parentId
    })
    .catch(ex => {
      const error = typeof ex.response.data === 'string' ? ex.response.data : JSON.stringify(ex.response.data);//??
      this.setState({ error });

    });
  }
  onChange(ev){
    this.setState({ [ev.target.name ]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value });
  }
  componentDidMount(){
    this.loadFileReader();
  }
  componentDidUpdate(prevProps){
    this.loadFileReader();
    if(!prevProps.page && this.props.page){
      this.setState({
        title: this.props.page.title,
        content: this.props.page.content,
        parentId: this.props.page.parentId || '',
      });
    }
  }
  render(){
    const { page, pagesLoaded } = this.props;
    const { title, content, imageData, removeImage, parentId, error } = this.state;
    const { onChange, update } = this;
    if(!page){
      return '...loading';
    }
    return (
      <div>
            <form onSubmit={ update } className='card'>
              <h3>Update Page</h3>
              {
                !!error && <div className='alert alert-danger'>{ error }</div>
              }
              <input ref={ el => this.el = el } type='file' />
              {
                page.image && <img style={{ width: '50px'}} src={ page.image.thumbnailURL } />
              }
              {
                page.image && <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFEFEF', padding: '1rem'}}>
                  Remove Image
                  <input name='removeImage' type='checkbox' onChange={onChange}/>
                  </label>
              }
              {
                !page.isHomePage && 
                <select name='parentId' value={ parentId } onChange={ onChange }>
                  <option value=''>-- set the parent page --</option>
                  {
                    this.props.pages.map( page => {
                      return (
                        <option key={ page.id } value={ page.id }>
                          { page.title }
                        </option>
                      );
                    })
                  }
                </select>
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
  const _pages = Object.values(pages);
  return {
    pages: _pages.filter(p => p.id !== match.params.id),
    page: match.params.id ? pages[match.params.id] : _pages.find( page => page.isHomePage),
    id: match.params.id
  };
};

const mapDispatchToProps = (dispatch, { history, match })=> {
  return {
    updatePage: (page)=> {
      return dispatch(updatePage({page : {...page, id: match.params.id}, history}))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

