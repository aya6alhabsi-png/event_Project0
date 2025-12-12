import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import home from '../assets/home.jpg';

export default function Home() {
  return (
    <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center py-5">
      <div>
        <img  src={home}  style={{ width: '600px',  height: '400px',  objectFit: 'cover', borderRadius: '10px'}} />
      </div>
      
      <div className="mt-4">
        <h2 className="mb-3">Welcome to Event Platform</h2>
        <p className="text-muted">
          Discover amazing events and manage your activities in one place.
        </p>
      </div>
    </Container>
  );
}