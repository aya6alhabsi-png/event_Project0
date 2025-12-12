import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import {Container,Row,Col,Card,CardBody,Form,FormGroup,Input,Button,Spinner,Alert,} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import regFormValidationSchema from '../validation/registerValidation'; 

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({}); 

  const { status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const values = { name, email, password };

    regFormValidationSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        
        setValidationErrors({});
        dispatch(registerUser(values))
          .unwrap()
          .then(() => navigate('/login'))
          .catch(() => {});
      })
      .catch((validationError) => {
     
        const fieldErrors = {};
        validationError.inner.forEach((err) => {
          if (err.path && !fieldErrors[err.path]) {
            fieldErrors[err.path] = err.message;
          }
        });
        setValidationErrors(fieldErrors);
      });
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
                <h3 className="fw-bold mb-0">User Registration</h3>
              </div>

           
              {error && (
                <Alert color="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
              
                <FormGroup className="mb-3">
                  <div className="mb-1 fw-semibold">Name</div>
                  <Input
                    value={name}
                    placeholder="Full name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  {validationErrors.name && (
                    <div className="text-danger small mt-1">
                      {validationErrors.name}
                    </div>
                  )}
                </FormGroup>

             
                <FormGroup className="mb-3">
                  <div className="mb-1 fw-semibold">Email</div>
                  <Input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {validationErrors.email && (
                    <div className="text-danger small mt-1">
                      {validationErrors.email}
                    </div>
                  )}
                </FormGroup>

               
                <FormGroup className="mb-4">
                  <div className="mb-1 fw-semibold">Password</div>
                  <Input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {validationErrors.password && (
                    <div className="text-danger small mt-1">
                      {validationErrors.password}
                    </div>
                  )}
                </FormGroup>

                <div className="d-grid mb-3">
                  <Button
                    type="submit"
                    style={{ backgroundColor: '#F26B1D', border: 'none' }}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? <Spinner size="sm" /> : 'Register'}
                  </Button>
                </div>

                <div className="text-center small">
                  <Link to="/login" className="text-decoration-none">
                    Already have an account? Login
                  </Link>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
