'use client';

import { useState, useRef, useEffect } from 'react';
import React from 'react';

const MinimalSelect = ({ value, onChange, children, className = '', wrapperClassName = '', name, id, required, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const flattenOptions = (nodes) =>
    React.Children.toArray(nodes).flatMap(child => {
      if (!React.isValidElement(child)) return [];
      if (child.type === 'option') return [{ value: child.props.value ?? '', label: child.props.children }];
      if (child.type === React.Fragment || child.props?.children) return flattenOptions(child.props.children);
      return [];
    });

  const options = flattenOptions(children);

  const selectedLabel = options.find(o => String(o.value) === String(value))?.label || options[0]?.label || 'Select...';

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (optVal) => {
    onChange({ target: { value: optVal, name: name || '' } });
    setIsOpen(false);
  };

  const scrollBy = (delta) => listRef.current?.scrollBy({ top: delta, behavior: 'smooth' });

  return (
    <div ref={wrapperRef} className={`relative ${wrapperClassName}`}>
      {/* Hidden native select for form validation/submission */}
      <select
        name={name}
        id={id}
        value={value}
        required={required}
        disabled={disabled}
        onChange={() => {}}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {children}
      </select>

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Scroll up */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => scrollBy(-80)}
            className="w-full flex justify-center py-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          {/* Options */}
          <ul ref={listRef} className="max-h-52 overflow-y-auto">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${String(opt.value) === String(value) ? 'text-primary font-medium' : 'text-gray-700'}`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Scroll down */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => scrollBy(80)}
            className="w-full flex justify-center py-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default MinimalSelect;
