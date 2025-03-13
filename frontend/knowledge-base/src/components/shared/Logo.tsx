import { NavLink } from 'react-router-dom';

const Logo = ({
  className = 'transition-all duration-300 dark:bg-gray-600 bg-gray-200 rounded-full p-1',
}) => {
  return (
    <NavLink to="/" className={className}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 12H16M8 12V7M8 12V17M16 12V17M16 12V7M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </NavLink>
  );
};

export default Logo;
