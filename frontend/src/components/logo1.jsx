import * as React from 'react';
import logo from '../assets/images/bb.png';
import { Link } from 'react-router-dom';

export default function SitemarkIcon() {

  return (
    <Link  to="/" >
    <img src={logo} alt="Logo" style={{ height: '50px', width: '50px', marginRight: '16px' }} />
    </Link>
  );
}
