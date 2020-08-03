import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { destroyPage } from '../store';
import { markdown } from 'markdown';


class Page extends Component {
  constructor(){
    super();
    this.destroy = this.destroy.bind(this);
  }
  componentDidMount(){
    if(this.props.location.pathname === '/login'){
      return this.props.history.push('/');
    }
  }
  destroy(){
    this.props.destroy(this.props.page);
  }
  render(){
    const { page, pagesLoaded, auth } = this.props;
    const { destroy } = this;
    if(!page){
      return '...loading App';
    }
    document.querySelector('title').innerText = `${SITE_TITLE} - ${ page.title }`;
    return (
      <div>
        <main>
          <section id='left'>
            <ul className='nav nav-tabs'>
              {
                page.parent && <li className='nav-item'><Link className='nav-link' to={`/${page.parent.isHomePage ? '' : page.parent.id}`}>
                <i style={{ paddingRight: '1rem'}} className="fas fa-chevron-left"></i>
                {page.parent.title
                }
                </Link></li>
              }
              <li className='nav-item'>
                <Link to={`/${page.isHomePage ? '' : page.id}`} className='nav-link active'>
                  { page.title }
                </Link>
              </li>
            </ul>
            <ul className='nav'>
              {
                page.children.map( child => {
                  return (
                    <li key={ child.id } className='nav-item'>
                      <Link className='nav-link' to={`/${child.id}`}>{ child.title }</Link>
                    </li>
                  );
                })
              }
            </ul>
            {
              auth.id && (
                <div className='btn-group' style={{ marginBottom: '1rem'}}>
                  <Link to={`/edit/${page.id}`} className='btn btn-primary'>
                    Update
                  </Link>
                  <Link to={`/add/${page.id}`} className='btn btn-secondary'>
                    Create
                  </Link>
                    {
                      !page.children.length && !page.isHomePage &&  
                      <button onClick={ destroy } className='btn btn-danger'>Destroy</button>
                    }
                </div>

              )
            }
            <div className='card'>
              <div className='card-body'>
              <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(page.content) }} />
                {
                  page.image && <img src={ page.image.url } style={{ width: '100%'}}/>
                }
              </div>
            </div>
            {
              page.showChildPreviews && (
                page.children.map( page => {
                  return (
                    <div className='card'>
                      <div className='card-body'>
                      <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(page.content) }} />
                        {
                          page.image && <img src={ page.image.url } style={{ width: '100%'}}/>
                        }
                      </div>
                    </div>
                  );

                })
              )
            }
          </section>
       </main>
      </div>
    );
  }
}

const mapStateToProps = ({ pages, auth }, { location, match, history })=> {
  const _pages = Object.values(pages);
  let page = match.params.id ? pages[match.params.id] : _pages.find( page => page.isHomePage);
  if(_pages.length && !page){
    //return history.push('/');
  }
  if(page){
    page = {...page };
    page.children = _pages.filter( p => p.parentId === page.id );
    page.parent = _pages.find( p => p.id === page.parentId );
  }
  return {
    history,
    location,
    auth,
    pages,
    page,
    id: match.params.id,
    pagesLoaded: Object.entries(pages).length
  };
};

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    destroy: (page)=> dispatch(destroyPage({ page, history }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);

