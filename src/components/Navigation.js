import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  const location = useLocation();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
      <Link className="navbar-brand" to="/">The Notifier</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>

          <li className={`nav-item ${location.pathname === '/todos' ? 'active' : ''}`}>
            <Link className="nav-link" to="/todos">
              Todo
            </Link>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default Navigation;
