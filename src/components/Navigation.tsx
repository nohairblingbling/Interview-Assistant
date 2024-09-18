import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-base-200 p-2 shadow-md">
      <div className="container mx-auto flex justify-center">
        <ul className="flex space-x-2">
          <li><Link to="/main_window" className="btn btn-ghost btn-sm">Interview</Link></li>
          <li><Link to="/knowledge" className="btn btn-ghost btn-sm">Knowledge Base</Link></li>
          <li><Link to="/settings" className="btn btn-ghost btn-sm">Settings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
