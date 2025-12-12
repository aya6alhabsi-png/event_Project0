import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import {Container,Row,Col,Card,CardBody,Form,FormGroup,Input,Button,Spinner,Alert,} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Adminlogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, role: 'admin' }))
      .unwrap()
      .then(() => navigate('/admin'))
      .catch(() => {});
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5">
      <Row className="w-100 justify-content-center">
        <Col md="6" lg="4">
          <Card
            className="shadow-sm border-0"
            style={{ backgroundColor: 'rgba(244, 234, 233, 1)' }}
          >
            <CardBody className="p-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold mb-0">Admin LogIn</h3>
              </div>

              {error && (
                <Alert color="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <div className="mb-1 fw-semibold">Email</div>
                  <Input
                    type="email"
                    value={email}
                    placeholder="Admin email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <div className="mb-1 fw-semibold">Password</div>
                  <Input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#F26B1D', border: 'none' }}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? <Spinner size="sm" /> : 'Login'}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Adminlogin;
