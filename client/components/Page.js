import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPage, createPage, destroyPage } from '../store';

const Hier = ({ hier, pages })=> {
  const children = Object.values(pages).filter( p => p.parentId === hier.id ); 
  console.log(children);
  return (
    <ul>
      <li>
        { hier.title }
        {
          children.map( child => {
            return <Hier key={ child.id } hier={ child } pages={ pages } />
          })
        }
      </li> 
    </ul>
  );
};

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
    const { page, pagesLoaded } = this.props;
    const { title, content } = this.state;
    const { onChange, create, destroy } = this;
    if(!page){
      return '...loading';
    }
    return (
      <div>
        <h1><Link to='/'>Profs CMS</Link></h1>
        <main>
          <section id='left'>
            <ul className='nav nav-tabs'>
              {
                page.parent && <li className='nav-item'><Link className='nav-link' to={`/${page.parent.isHomePage ? '' : page.parent.id}`}>&lt; &lt; {
                  page.parent.title
                }</Link></li>
              }
              <li className='nav-item'>
                <Link to={`/${page.isHomePage ? '' : page.id}`} className='nav-link active'>
                  { page.title }
                </Link>
              </li>
            </ul>
            <h1>
            </h1>
              {
                !page.children.length && !page.isHomePage &&  
                <button onClick={ destroy } className='btn btn-danger btn-sm'>Destroy Page</button>
              }
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
            <form onSubmit={ create } className='card'>
              <h3>Add A Child</h3>
              <input name='title' value={ title } onChange={ onChange } placeholder='...title'/>
              <input name='content' value={ content } onChange={ onChange } placeholder='...content'/>
              <button className='btn btn-primary'>Create Page</button>
            </form>
          </section>
          <section id='right'>
            <div>
              <label className='badge badge-secondary'>{ pagesLoaded } Pages Loaded</label> 
            </div>
            <Hier hier={ this.props.hier } pages={ this.props.pages }/>
          </section>
       </main>
      </div>
    );
  }
}

const mapStateToProps = ({ pages }, { match })=> {
  const _pages = Object.values(pages);
  const topPage = _pages.find( p => !pages[p.parentId]); 
  //TODO - home page might also have loaded
  //see if topPage and homePage are loaded
  //if topPage is not the home page and topPage can not be found from home page hier, then show 2 Hier
  let hier = {};
  if(topPage){
    hier = topPage; 
  }
  return {
    pages,
    hier,
    page: match.params.id ? pages[match.params.id] : Object.values(pages).find( page => page.isHomePage),
    id: match.params.id,
    pagesLoaded: Object.entries(pages).length
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

