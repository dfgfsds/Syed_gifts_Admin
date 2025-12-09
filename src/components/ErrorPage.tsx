import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">Sorry, the page you are looking for doesn't exist.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
