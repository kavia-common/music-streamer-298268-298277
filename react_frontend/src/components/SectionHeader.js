import React from 'react';
import './SectionHeader.css';

/**
 * PUBLIC_INTERFACE
 * Section header component for content sections (e.g., "Good afternoon", "Made for you").
 * Provides optional "See all" link for navigation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title text
 * @param {string} props.link - Optional "See all" link URL
 */
function SectionHeader({ title, link }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {link && (
        <a href={link} className="section-link">
          See all
        </a>
      )}
    </div>
  );
}

export default SectionHeader;
