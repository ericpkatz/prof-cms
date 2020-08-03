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
      imageId: page && page.imageId ? page.imageId: '',
      error: '',
      showChildPreviews: page && page.showChildPreviews ? page.showChildPreviews : false 
    };
    this.onChange = this.onChange.bind(this);
    this.update = this.update.bind(this);
    this.setImage = this.setImage.bind(this);
  }
  setImage(image){
    this.setState({ imageId: this.state.imageId === image.id ? '' : image.id });
  }
  loadFileReader(){
    if(this.el && !this.el.loaded){
      this.editor = CodeMirror.fromTextArea(this.textArea, {});
      this.editor.on('change', (...args)=> {
        this.setState({ content: this.editor.doc.getValue()});
      });
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
    const { title, content, imageData, removeImage, parentId, imageId, showChildPreviews } = this.state;

    this.props.updatePage({
      title, content, imageData, removeImage, parentId, imageId, showChildPreviews
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
        imageId: this.props.page.imageId || '',
        showChildPreview: this.props.showChildPreview || false
      });
      this.editor.doc.setValue(this.props.page.content);
    }
  }
  render(){
    const { images, page, pagesLoaded } = this.props;
    const { imageId, title, content, imageData, removeImage, parentId, error, showChildPreviews } = this.state;
    const { onChange, update, setImage } = this;
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
              <textarea name='content' value={ content } onChange={ onChange } placeholder='...content' ref={ ref => this.textArea = ref}/>
              <input ref={ el => this.el = el } type='file' />
              {
                page.image && (
                  <div>
                    <div>
                      <div>Current Image:</div>
                      <img style={{ width: '50px', margin: '1rem'}} src={ page.image.thumbnailURL } />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFEFEF', padding: '1rem'}}>
                    Remove Image
                    <input name='removeImage' type='checkbox' onChange={onChange}/>
                    </label>
                  </div>

                )
              }
              <div>
                Choose Existing Image:
                <ul>
                  {
                    images.map( image => {
                      return (
                        <li className={ imageId === image.id ? 'selected': ''} key={ image.id } onClick={ ()=> setImage(image)}>
                          <img src={ image.thumbnailURL } />
                        </li>
                      );
                    })

                  }
                </ul>
                
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFEFEF', padding: '1rem'}}>
                  Show Child Previews
                <input checked={showChildPreviews} name='showChildPreviews' type='checkbox' onChange={onChange}/>
                </label>
              </div>
              <button className='btn btn-primary'>Update Page</button>
              <Link to={`/${ page.isHomePage ? '' : page.id }`}>Cancel</Link>
            </form>
      </div>
    );
  }
}

const mapStateToProps = ({ pages, images }, { location, match })=> {
  const _pages = Object.values(pages);
  return {
    pages: _pages.filter(p => p.id !== match.params.id),
    page: match.params.id ? pages[match.params.id] : _pages.find( page => page.isHomePage),
    id: match.params.id,
    images
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

