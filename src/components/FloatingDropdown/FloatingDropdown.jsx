import React, { useState, useRef, useEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
} from '@floating-ui/react';
import styles from './FloatingDropdown.module.css';

const FloatingDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex(option => option.value === value)
  );

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(5),
      flip({ fallbackPlacements: ['top-start', 'bottom-start'] }),
      shift({ padding: 5 })
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  // useDismiss'i kaldırıyoruz - modal kapanma sorununa neden oluyor
  const role = useRole(context, { role: 'listbox' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    role,
  ]);

  const headingId = useId();

  useEffect(() => {
    const newIndex = options.findIndex(option => option.value === value);
    setSelectedIndex(newIndex >= 0 ? newIndex : 0);
  }, [value, options]);

  const handleSelect = (index) => {
    const selectedOption = options[index];
    setSelectedIndex(index);
    onChange?.(selectedOption.value);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      const nextIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
      setSelectedIndex(nextIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
      setSelectedIndex(prevIndex);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && refs.reference.current && !refs.reference.current.contains(event.target) && 
          refs.floating.current && !refs.floating.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, refs]);

  const selectedOption = options[selectedIndex];
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <>
      <button
        ref={refs.setReference}
        className={`${styles.trigger} ${className}`}
        aria-expanded={isOpen}
        aria-labelledby={headingId}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        {...getReferenceProps()}
        {...props}
      >
        <span className={styles.value}>
          {displayValue}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={styles.dropdown}
            {...getFloatingProps()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                className={`${styles.option} ${
                  index === selectedIndex ? styles.optionSelected : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(index);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                role="option"
                aria-selected={index === selectedIndex}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
};

export default FloatingDropdown;
