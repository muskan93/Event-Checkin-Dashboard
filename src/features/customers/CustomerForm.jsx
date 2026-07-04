import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/Modal';

export default function CustomerForm({ isOpen, onClose, onSubmit, customer, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      projectName: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        customer
          ? {
              name: customer.name,
              mobile: customer.mobile,
              email: customer.email,
              projectName: customer.projectName,
            }
          : { name: '', mobile: '', email: '', projectName: '' }
      );
    }
  }, [isOpen, customer, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = (data) => {
    onSubmit(data, () => reset());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={customer ? 'Edit Customer' : 'Add New Customer'}
      size="md"
    >
      <form onSubmit={handleSubmit(submit)} className="customer-form">
        <div className="form-group">
          <label htmlFor="name">Customer Name *</label>
          <input
            id="name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number *</label>
          <input
            id="mobile"
            {...register('mobile', {
              required: 'Mobile is required',
              pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit mobile number' },
            })}
          />
          {errors.mobile && <span className="field-error">{errors.mobile.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="projectName">Project Name *</label>
          <input
            id="projectName"
            {...register('projectName', { required: 'Project name is required' })}
          />
          {errors.projectName && <span className="field-error">{errors.projectName.message}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : customer ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
