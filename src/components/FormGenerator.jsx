import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';

const FormGenerator = memo(({ fields = [], onSubmit, submitButtonText = 'Submit', className = '' }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (!field || !field.name || !field.label || !field.type) return;
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await onSubmit(formData);
      setFormData({});
      setErrors({});
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return <p className="text-red-400">No form fields provided.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field, index) => {
        if (!field || !field.name || !field.label || !field.type) return null;
        const isInvalid = !!errors[field.name];
        return (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col"
          >
            <label htmlFor={field.name} className="text-neutral-100 mb-1 font-sans">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className={`p-2 bg-neutral-800 text-neutral-100 border ${
                  isInvalid ? 'border-red-400' : 'border-neutral-700'
                } rounded focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 outline-none resize-y min-h-[100px]`}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? `${field.name}-error` : undefined}
              />
            ) : field.type === 'file' ? (
              <input
                id={field.name}
                name={field.name}
                type="file"
                accept={field.accept}
                onChange={handleChange}
                className={`p-2 bg-neutral-800 text-neutral-100 border ${
                  isInvalid ? 'border-red-400' : 'border-neutral-700'
                } rounded focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#FF5722] file:text-white file:cursor-pointer`}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? `${field.name}-error` : undefined}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className={`p-2 bg-neutral-800 text-neutral-100 border ${
                  isInvalid ? 'border-red-400' : 'border-neutral-700'
                } rounded focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/50 outline-none`}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? `${field.name}-error` : undefined}
              />
            )}
            {isInvalid && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                id={`${field.name}-error`}
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors[field.name]}
              </motion.p>
            )}
          </motion.div>
        );
      })}
      {errors.general && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm"
          role="alert"
        >
          {errors.general}
        </motion.p>
      )}
      <motion.button
        type="submit"
        className="w-full p-2 text-white bg-gradient-to-r from-[#FF5722] to-[#FFC107] rounded font-sans hover:bg-[#FF5722]/80"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {submitButtonText}
      </motion.button>
    </form>
  );
});

export default FormGenerator;