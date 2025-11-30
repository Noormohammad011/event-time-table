import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, ColorPicker, DatePicker, Form, Input, Modal, Select, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import type { Event, Venue } from '../types/event';
import { addEvent, deleteEvent, updateEvent } from '../utils/event-storage';

interface EventFormProps {
  open: boolean;
  event: Event | null;
  initialDate: Dayjs;
  initialVenueIds?: string[];
  venues: Venue[];
  onClose: () => void;
  onSave: () => void;
}

export function EventForm({
  open,
  event,
  initialDate,
  initialVenueIds,
  venues,
  onClose,
  onSave,
}: EventFormProps) {
  const [form] = Form.useForm();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    if (open) {
      if (event) {
        // Editing existing event
        const startTime = dayjs(event.startTime, 'HH:mm');
        const endTime = dayjs(event.endTime, 'HH:mm');
        const date = dayjs(event.date, 'YYYY-MM-DD');
        
        // Handle migration from venueId to venueIds
        const venueIds = event.venueIds || (event.venueId ? [event.venueId] : []);
        
        form.setFieldsValue({
          title: event.title,
          venueIds: venueIds,
          date: date,
          startTime: startTime,
          endTime: endTime,
          color: event.color || '#2563eb',
        });
      } else {
        // Creating new event
        const defaultStartTime = dayjs().hour(9).minute(0).second(0);
        const defaultEndTime = dayjs().hour(10).minute(30).second(0);
        
        // Use initialVenueIds or default to first venue
        const defaultVenueIds = initialVenueIds || (venues[0]?.id ? [venues[0].id] : []);
        
        form.setFieldsValue({
          title: '',
          venueIds: defaultVenueIds,
          date: initialDate,
          startTime: defaultStartTime,
          endTime: defaultEndTime,
          color: '#2563eb',
        });
      }
    }
  }, [open, event, initialDate, initialVenueIds, venues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const date = values.date.format('YYYY-MM-DD');
      const startTime = values.startTime.format('HH:mm');
      const endTime = values.endTime.format('HH:mm');
      const color = typeof values.color === 'string' ? values.color : values.color?.toHexString() || '#2563eb';

      if (event) {
        // Update existing event
        updateEvent(event.id, {
          title: values.title,
          venueIds: values.venueIds,
          date,
          startTime,
          endTime,
          color,
        });
      } else {
        // Create new event
        const newEvent: Event = {
          id: Date.now().toString(),
          title: values.title,
          venueIds: values.venueIds,
          date,
          startTime,
          endTime,
          color,
        };
        addEvent(newEvent);
      }

      form.resetFields();
      onSave();
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleDelete = () => {
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (event) {
      deleteEvent(event.id);
      form.resetFields();
      setDeleteConfirmVisible(false);
      onSave();
      onClose();
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
  };

  return (
    <>
      <Modal
        title={event ? 'Edit Event' : 'Add New Event'}
        open={open}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={event ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={500}
        destroyOnClose
        footer={[
          event && (
            <Button
              key="delete"
              danger
              onClick={handleDelete}
              style={{ float: 'left' }}
            >
              Delete Event
            </Button>
          ),
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {event ? 'Update' : 'Create'}
          </Button>,
        ].filter(Boolean)}
      >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: 'Please enter event title' }]}
        >
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker
            className="w-full"
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="venueIds"
          label="Venues"
          rules={[
            { required: true, message: 'Please select at least one venue' },
            { type: 'array', min: 1, message: 'Please select at least one venue' }
          ]}
        >
          <Select 
            mode="multiple"
            placeholder="Select venues"
            maxTagCount="responsive"
          >
            {venues.map((venue) => (
              <Select.Option key={venue.id} value={venue.id}>
                {venue.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[
              { required: true, message: 'Please select start time' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const endTime = getFieldValue('endTime');
                  if (!value || !endTime) {
                    return Promise.resolve();
                  }
                  if (value.isAfter(endTime) || value.isSame(endTime)) {
                    return Promise.reject(new Error('Start time must be before end time'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TimePicker
              className="w-full"
              format="HH:mm"
              minuteStep={15}
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time"
            rules={[
              { required: true, message: 'Please select end time' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue('startTime');
                  if (!value || !startTime) {
                    return Promise.resolve();
                  }
                  if (value.isBefore(startTime) || value.isSame(startTime)) {
                    return Promise.reject(new Error('End time must be after start time'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TimePicker
              className="w-full"
              format="HH:mm"
              minuteStep={15}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="color"
          label="Event Color"
        >
          <ColorPicker
            showText
            format="hex"
            presets={[
              {
                label: 'Presets',
                colors: [
                  '#2563eb', // blue
                  '#10b981', // green
                  '#f59e0b', // amber
                  '#ef4444', // red
                  '#8b5cf6', // purple
                  '#ec4899', // pink
                  '#06b6d4', // cyan
                  '#84cc16', // lime
                ],
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>

    {/* Delete Confirmation Modal */}
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          Delete Event
        </span>
      }
      open={deleteConfirmVisible}
      onOk={confirmDelete}
      onCancel={cancelDelete}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete this event? This action cannot be undone.</p>
    </Modal>
    </>
  );
}

