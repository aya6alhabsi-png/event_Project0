import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/eventsSlice';
import {Container,Row,Col,Card,CardBody,CardTitle,CardText,Badge,Spinner,Alert,} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserAlt, FaCalendarAlt, FaWifi } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

function ShowEvents() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const getStatusBadge = (statusText) => {
    if (!statusText) return null;
    const s = statusText.toLowerCase();
    let color = 'secondary';
    if (s === 'active') color = 'success';
    else if (s === 'upcoming') color = 'warning';
    else if (s === 'cancelled') color = 'danger';
    return (
      <Badge color={color} className="ms-2 text-uppercase" pill>
        {statusText}
      </Badge>
    );
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80';


  const totalEvents = list.length;
  const upcomingEvents = list.filter(
    (e) => e.status && e.status.toLowerCase() === 'upcoming'
  ).length;
  const onlineEvents = list.filter((e) => e.isOnline).length;

  return (
    <Container className="py-4">
      <Row className="gy-4">
      
        {user && (
          <Col md="3">
            <Card
              className="shadow border-0 h-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(242,107,29,0.95), rgba(255,200,150,0.9))',
                color: '#fff',
              }}
            >
              <CardBody>
             
                <div className="d-flex flex-column align-items-center text-center mb-4">
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      border: '3px solid rgba(255,255,255,0.9)',
                      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                    }}
                  >
                    <img
                      src={logo}
                      alt="User"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <h5 className="fw-bold mb-1">
                    Hello, {user.name || 'User'}
                  </h5>

                  <span
                    className="badge rounded-pill d-inline-flex align-items-center"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.75rem',
                    }}
                  >
                    <FaUserAlt className="me-1" />
                    {user.role || 'user'}
                  </span>
                </div>

                <hr
                  style={{
                    borderColor: 'rgba(255,255,255,0.4)',
                    margin: '0.5rem 0 1rem',
                  }}
                />

                
                <div className="mb-2 text-uppercase fw-semibold small opacity-75">
                  Your event overview
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2" />
                      <span>All events</span>
                    </div>
                    <strong>{totalEvents}</strong>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2" />
                      <span>Upcoming</span>
                    </div>
                    <strong>{upcomingEvents}</strong>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaWifi className="me-2" />
                      <span>Online events</span>
                    </div>
                    <strong>{onlineEvents}</strong>
                  </div>
                </div>

                <div
                  className="mt-3 small"
                  style={{ opacity: 0.85, lineHeight: 1.4 }}
                >
                  Browse events, check locations on the map, and plan what to
                  join next.
                </div>
              </CardBody>
            </Card>
          </Col>
        )}

  
        <Col md={user ? '9' : '12'}>
          <h2 className="mb-4">Events</h2>

          {status === 'loading' && (
            <div className="text-center my-4">
              <Spinner />
            </div>
          )}
          {error && (
            <Alert color="danger" className="my-3">
              {error}
            </Alert>
          )}

          <Row className="gy-4">
            {list.map((event) => {
              const img = event.imageUrl || event.image || defaultImage;
              const dateText = event.eventDate
                ? new Date(event.eventDate).toLocaleString()
                : 'No date';

              return (
                <Col key={event._id} md="6" lg="4">
                  <Card
                    className="h-100 shadow-sm border-0"
                    style={{ backgroundColor: 'rgba(244, 234, 233, 1)' }}
                  >
                    <img
                      src={img}
                      alt={event.title}
                      className="card-img-top"
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <CardTitle tag="h5" className="mb-0">
                          {event.title}
                          {getStatusBadge(event.status)}
                        </CardTitle>
                      </div>

                  
                      <CardText className="mb-1">
                        <strong>Location:</strong> {event.location || '—'}
                      </CardText>

                    
                      {event.location && (
                        <div className="mt-2">
                          <iframe
                            title={`map-${event._id}`}
                            height="200"
                            width="100%"
                            style={{ border: 0, borderRadius: '8px' }}
                            loading="lazy"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(
                              event.location
                            )}&output=embed`}
                          ></iframe>
                        </div>
                      )}

                      <CardText className="mb-1 mt-2">
                        <strong>Date:</strong> {dateText}
                      </CardText>

                      {event.capacity != null && (
                        <CardText className="mb-1">
                          <strong>Capacity:</strong> {event.capacity}
                        </CardText>
                      )}
                      {event.isOnline && (
                        <CardText className="mb-1">
                          <Badge color="info">Online event</Badge>
                        </CardText>
                      )}
                      {event.description && (
                        <CardText className="mt-2 text-muted small">
                          {event.description}
                        </CardText>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              );
            })}

            {list.length === 0 && status !== 'loading' && !error && (
              <Col>
                <p className="text-muted">No events available.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ShowEvents;
