"use client"
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';

function SideBar({ isSidebarOpen, toggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div>
      <div id="side-bar" className={`side-bar header-two ${isSidebarOpen ? 'show' : ''}`}>
        <button className="close-icon-menu" aria-label="Close Menu" onClick={toggleSidebar}>
          <i className="far fa-times"></i>
        </button>
        <div className="mobile-menu-main">
          <nav className="nav-main mainmenu-nav mt--30">
            <ul className="mainmenu metismenu" id="mobile-menu-active">
              <li>
                <Link href="/" className="main">Home</Link>
              </li>
              <li>
                <Link href="/about" className="main">About</Link>
              </li>
              <li className="has-droupdown">
                <Link href="/service" className="main" onClick={() => toggleMenu(1)}>
                  Service
                </Link>
                <ul className={`submenu ${openMenu === 1 ? 'mm-collapse mm-show' : 'mm-collapse'}`}>
                  <li>
                    <Link href="/web-development-service">Web Development</Link>
                  </li>
                  <li>
                    <Link href="/mobile-app-development-service">Mobile App Development</Link>
                  </li>
                  <li>
                    <Link href="/ecommerce-development-service">E-Commerce Development</Link>
                  </li>
                  <li>
                    <Link href="/hosting-deployment-service">Hosting & Deployment</Link>
                  </li>
                  <li>
                    <Link href="/bot-development-service">Bot Development</Link>
                  </li>
                  <li>
                    <Link href="/ui-ux-design-service">UI/UX Design</Link>
                  </li>
                  <li>
                    <Link href="/api-development-service">API Development & Integration</Link>
                  </li>
                  <li>
                    <Link href="/tech-support-service">Tech Support & Maintenance</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/career" className="main">Career</Link>
              </li>
              <li>
                <Link href="/contact" className="main">Contact</Link>
              </li>
            </ul>
          </nav>
          <div className="rts-social-border-area right-sidebar mt--80">
            <ul>
              <li>
                <Link href="#" aria-label="social link" data-description="social">
                  <i className="fa-brands fa-facebook-f" />
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="social link" data-description="social">
                  <i className="fa-brands fa-twitter" />
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="social link" data-description="social">
                  <i className="fa-brands fa-linkedin-in" />
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="social link" data-description="social">
                  <i className="fa-brands fa-youtube" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
