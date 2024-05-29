import { Link } from 'react-router-dom';

export default function PageHome() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <div>home</div>
      <div>123</div>
      <Link to={'/admin'}>123</Link>
    </div>
  );
}
