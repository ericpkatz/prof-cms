import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { destroyPage } from '../store';


class Page extends Component {
  constructor(){
    super();
    this.destroy = this.destroy.bind(this);
  }
  destroy(){
    this.props.destroy(this.props.page);
  }
  render(){
    const { page, pagesLoaded, auth } = this.props;
    const { destroy } = this;
    if(!page){
      return '...loading';
    }
    return (
      <div>
        <h1><Link to='/'>{ SITE_TITLE }</Link></h1>
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
            {
              auth.id && (
                <div className='btn-group'>
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
            <div className='card'>
              <div className='card-body'>
                { page.content }
                {
                  page.image && <img src={ page.image.url } />
                }
              </div>
            </div>
          </section>
       </main>
      </div>
    );
  }
}

const mapStateToProps = ({ pages, auth }, { match })=> {
  const _pages = Object.values(pages);
  let page = match.params.id ? pages[match.params.id] : _pages.find( page => page.isHomePage);
  if(page){
    page = {...page };
    page.children = _pages.filter( p => p.parentId === page.id );
    page.parent = _pages.find( p => p.id === page.parentId );
  }
  return {
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

