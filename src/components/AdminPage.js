
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchEvents,addEvent,updateEvent,deleteEvent,} from '../store/eventsSlice';
import {Container,Row,Col,Card,CardBody,CardHeader,Form,FormGroup,Label,Input,Button,Table,Badge,} from 'reactstrap';
import {FaPlus,FaEdit,FaTrash,FaUserShield,FaCalendarAlt,FaChartBar,} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.jpg';

function AdminPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    capacity: '',
    isOnline: false,
    imageUrl: '',
    status: 'Upcoming',
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      capacity: Number(form.capacity) || 0,
    };

    if (editId) {
      dispatch(updateEvent({ id: editId, data }));
    } else {
      dispatch(addEvent(data));
    }

    setForm({
      title: '',
      description: '',
      location: '',
      eventDate: '',
      capacity: '',
      isOnline: false,
      imageUrl: '',
      status: 'Upcoming',
    });
    setEditId(null);
  };

  const handleEdit = (event) => {
    setEditId(event._id);
    setForm({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      eventDate: event.eventDate ? event.eventDate.slice(0, 16) : '',
      capacity: event.capacity || '',
      isOnline: event.isOnline || false,
      imageUrl: event.imageUrl || event.image || '',
      status: event.status || 'Upcoming',
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
  };

  const statusBadge = (statusText) => {
    if (!statusText) return null;
    const s = statusText.toLowerCase();
    let color = 'secondary';
    if (s === 'active') color = 'success';
    else if (s === 'upcoming') color = 'warning';
    else if (s === 'cancelled') color = 'danger';
    return <Badge color={color}>{statusText}</Badge>;
  };

 
  const totalEvents = list.length;
  const upcomingEvents = list.filter(
    (e) => e.status && e.status.toLowerCase() === 'upcoming'
  ).length;
  const activeEvents = list.filter(
    (e) => e.status && e.status.toLowerCase() === 'active'
  ).length;

  return (
    <Container className="py-4">
      <Row className="gy-4">
       
        {user && (
          <Col md="3">
            <Card
              className="shadow border-0 h-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(242,107,29,0.95), rgba(255,180,120,0.9))',
                color: '#fff',
              }}
            >
              <CardBody>
            
                <div className="d-flex flex-column align-items-center text-center mb-4">
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      border: '3px solid rgba(255,255,255,0.9)',
                      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                    }}
                  >
                    <img
                      src={logo}
                      alt="Admin"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  <h5 className="fw-bold mb-1">
                    Hello, {user.name || 'Admin'}
                  </h5>

                  <span
                    className="badge rounded-pill d-inline-flex align-items-center"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.75rem',
                    }}
                  >
                    <FaUserShield className="me-1" />
                    {user.role || 'admin'}
                  </span>
                </div>

               
                <hr
                  style={{
                    borderColor: 'rgba(255,255,255,0.4)',
                    margin: '0.5rem 0 1rem',
                  }}
                />

              
                <div className="mb-2 text-uppercase fw-semibold small opacity-75">
                  Overview
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2" />
                      <span>Total events</span>
                    </div>
                    <strong>{totalEvents}</strong>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaChartBar className="me-2" />
                      <span>Upcoming</span>
                    </div>
                    <strong>{upcomingEvents}</strong>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaChartBar className="me-2" />
                      <span>Active</span>
                    </div>
                    <strong>{activeEvents}</strong>
                  </div>
                </div>

              
                <div
                  className="mt-3 small"
                  style={{ opacity: 0.8, lineHeight: 1.4 }}
                >
                  Manage your events, update their status, and keep everything
                  organized from this dashboard.
                </div>
              </CardBody>
            </Card>
          </Col>
        )}

        
        <Col md={user ? '9' : '12'}>
          <Row className="gy-4">
          
            <Col md="5">
              <Card
                className="shadow-sm border-0"
                style={{ backgroundColor: 'rgba(244, 234, 233, 1)' }}
              >
                <CardHeader className="bg-transparent border-0">
                  <h4 className="fw-bold mb-0">
                    {editId ? 'Update Event' : 'Add New Event'}
                  </h4>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        type="textarea"
                        value={form.description}
                        onChange={handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Muscat, Oman or Sultan Qaboos University"
                      />
                    </FormGroup>

                    {/* Live Google Map preview */}
                    {form.location && (
                      <div className="mb-3">
                        <iframe
                          title="admin-location-preview"
                          height="200"
                          width="100%"
                          style={{ border: 0, borderRadius: '8px' }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            form.location
                          )}&output=embed`}
                        ></iframe>
                      </div>
                    )}

                    <Row>
                      <Col md="7">
                        <FormGroup>
                          <Label for="eventDate">Event Date &amp; Time</Label>
                          <Input
                            id="eventDate"
                            name="eventDate"
                            type="datetime-local"
                            value={form.eventDate}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="5">
                        <FormGroup>
                          <Label for="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            value={form.capacity}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="status">Status</Label>
                          <Input
                            id="status"
                            name="status"
                            type="select"
                            value={form.status}
                            onChange={handleChange}
                          >
                            <option>Upcoming</option>
                            <option>Active</option>
                            <option>Cancelled</option>
                            <option>Completed</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup check className="mt-4 pt-2">
                          <Input
                            id="isOnline"
                            name="isOnline"
                            type="checkbox"
                            checked={form.isOnline}
                            onChange={handleChange}
                          />
                          <Label for="isOnline" check className="ms-2">
                            Online event
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label for="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                      <small className="text-muted">
                        This image will appear on the event cards.
                      </small>
                    </FormGroup>

                    <div className="d-grid mt-3">
                      <Button
                        type="submit"
                        style={{ backgroundColor: '#F26B1D', border: 'none' }}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <FaPlus className="me-2" />
                        {editId ? 'Update Event' : 'Add Event'}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            {/* Table side */}
            <Col md="7">
              <Card className="shadow-sm border-0">
                <CardHeader
                  className="d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: '#F26B1D', color: '#fff' }}
                >
                  <h5 className="mb-0">All Events</h5>
                  <Badge color="light" pill>
                    {list.length}
                  </Badge>
                </CardHeader>
                <CardBody className="p-0">
                  <Table hover responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Online</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((event) => (
                        <tr key={event._id}>
                          <td>{event.title}</td>
                          <td>
                            {event.eventDate
                              ? new Date(event.eventDate).toLocaleString()
                              : ''}
                          </td>
                          <td>{event.location}</td>
                          <td>{statusBadge(event.status)}</td>
                          <td>{event.isOnline ? 'Yes' : 'No'}</td>
                          <td>
                            <Button
                              size="sm"
                              color="light"
                              className="me-2 border-0"
                              onClick={() => handleEdit(event)}
                            >
                              <FaEdit className="me-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="light"
                              className="text-danger border-0"
                              onClick={() => handleDelete(event._id)}
                            >
                              <FaTrash className="me-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {list.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-4 text-muted"
                          >
                            No events yet. Use the form to add one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
