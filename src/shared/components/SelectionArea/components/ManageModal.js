import React, { useState } from 'react';

// Load Vendors
import { addClass, duplicate } from 'utils/appHelpers';

// Load Hooks
import { useSelector } from 'react-redux';

// Load Components
import Modal from './../../Modal';
import Editor from 'shared/components/Editor';

const ProductContent = ({
  inputName,
  inputValue,
  inputLabel,
  inputError,
  inputRequired,
  editorValue,
  editorOnChange,
  editorLabel,
  editorError,
  editorRequired,
  onChange,
}) => (
  <div className='form-group'>
    <label htmlFor={inputName}>
      {inputLabel} {inputRequired && <span className='text-danger'>*</span>}
    </label>
    <input
      type='text'
      name={inputName}
      className={`form-control w-100i${addClass(inputError, 'is-invalid')}`}
      value={inputValue}
      onChange={onChange}
    />
    {inputError && <small className='form-text text-danger'>{inputError}</small>}
    <label className='mt-3'>
      {editorLabel} {editorRequired && <span className='text-danger'>*</span>}
    </label>
    <Editor value={editorValue} onBlur={editorOnChange} height={300} />
    {editorError && <small className='form-text text-danger'>{editorError}</small>}
  </div>
);

const defaultForm = {
  name_en: '',
  name_hy: '',
  name_ru: '',
  price: '',
  weight: '',
  description_en: '',
  description_hy: '',
  description_ru: '',
};

const ManageModal = ({ data, onSubmit, onClose }) => {
  const initialData = {
    ...defaultForm,
    price: data.price || '',
    weight: data.weight || '',
    name_en: data.name_en ?? '',
    name_hy: data.name_hy ?? '',
    name_ru: data.name_ru ?? '',
  };

  const settings = useSelector(state => state.settings);

  const [form, setForm] = useState(duplicate(initialData));
  const [descriptionEN, setDescriptionEN] = useState(() => data.description_en ?? '');
  const [descriptionHY, setDescriptionHY] = useState(() => data.description_hy ?? '');
  const [descriptionRU, setDescriptionRU] = useState(() => data.description_ru ?? '');
  const [validationErrors, setVaidationErrors] = useState(() => duplicate(defaultForm));

  const langIndexes = { en: 0, hy: 1, ru: 2 };
  const initialTabIndex = langIndexes[settings.default_language];

  const [activeTab, setActiveTab] = useState(initialTabIndex);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };

  const contentNames = [
    { name: 'ENG', languageKey: 'en' },
    { name: 'ՀԱՅ', languageKey: 'hy' },
    { name: 'РУС', languageKey: 'ru' },
  ];
  const contentValues = [
    {
      inputName: 'name_en',
      inputValue: form.name_en,
      inputLabel: 'Product Name (ENG)',
      inputError: validationErrors.name_en,
      inputRequired: settings.default_language === 'en',
      editorValue: descriptionEN,
      editorOnChange: setDescriptionEN,
      editorLabel: 'Description (ENG)',
      editorError: validationErrors.description_en,
      // editorRequired: settings.default_language === 'en',
      languageKey: 'en',
    },
    {
      inputName: 'name_hy',
      inputValue: form.name_hy,
      inputLabel: 'Product Name (ՀԱՅ)',
      inputError: validationErrors.name_hy,
      inputRequired: settings.default_language === 'hy',
      editorValue: descriptionHY,
      editorOnChange: setDescriptionHY,
      editorLabel: 'Description (ՀԱՅ)',
      editorError: validationErrors.description_hy,
      // editorRequired: settings.default_language === 'hy',
      languageKey: 'hy',
    },
    {
      inputName: 'name_ru',
      inputValue: form.name_ru,
      inputLabel: 'Product Name (РУС)',
      inputError: validationErrors.name_ru,
      inputRequired: settings.default_language === 'ru',
      editorValue: descriptionRU,
      editorOnChange: setDescriptionRU,
      editorLabel: 'Description (РУС)',
      editorError: validationErrors.description_ru,
      // editorRequired: settings.default_language === 'ru',
      languageKey: 'ru',
    },
  ];

  const handleValidation = () => {
    const newErrors = {};
    let formIsValid = true;
    if (!form.price) {
      newErrors.price = 'The price is required.';
      formIsValid = false;
    }
    // if (!form.weight) {
    //   newErrors.weight = 'The weight is required.';
    //   formIsValid = false;
    // }
    if (settings.default_language === 'en' && !form.name_en) {
      newErrors.name_en = 'The name is required.';
      formIsValid = false;
    }
    if (settings.default_language === 'en' && form.name_en && form.name_en.length < 3) {
      newErrors.name_en = 'The name must be at least 3 characters.';
      formIsValid = false;
    }
    if (settings.default_language === 'hy' && !form.name_hy) {
      newErrors.name_hy = 'The name is required.';
      formIsValid = false;
    }
    if (settings.default_language === 'hy' && form.name_hy && form.name_hy.length < 3) {
      newErrors.name_hy = 'The name must be at least 3 characters.';
      formIsValid = false;
    }
    if (settings.default_language === 'ru' && !form.name_ru) {
      newErrors.name_ru = 'The name is required.';
      formIsValid = false;
    }
    if (settings.default_language === 'ru' && form.name_ru && form.name_ru.length < 3) {
      newErrors.name_ru = 'The name must be at least 3 characters.';
      formIsValid = false;
    }
    // if (settings.default_language === 'en' && !descriptionEN) {
    //   newErrors.description_en = 'The description is required.';
    //   formIsValid = false;
    // }
    // if (settings.default_language === 'hy' && !descriptionHY) {
    //   newErrors.description_hy = 'The description is required.';
    //   formIsValid = false;
    // }
    // if (settings.default_language === 'ru' && !descriptionRU) {
    //   newErrors.description_ru = 'The description is required.';
    //   formIsValid = false;
    // }
    setVaidationErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = () => {
    let validationPassed = handleValidation();
    if (!validationPassed) return;
    const newForm = {
      ...form,
      description_en: descriptionEN,
      description_hy: descriptionHY,
      description_ru: descriptionRU,
    };
    onSubmit(newForm);
  };

  return (
    <Modal
      size='lg'
      configs={{
        title: 'Add Product',
        hideFooter: true,
      }}
      onClose={onClose}
    >
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <div className='form-group'>
              <label htmlFor='price'>
                Price <span className='text-danger'>*</span>
              </label>
              <input
                type='number'
                name='price'
                className={`form-control w-100i${addClass(validationErrors.price, 'is-invalid')}`}
                value={form.price}
                onChange={handleChange}
                autoFocus
              />
              {validationErrors.price && (
                <small className='form-text text-danger'>{validationErrors.price}</small>
              )}
            </div>
          </div>
          <div className='col-md-6'>
            <div className='form-group'>
              <label htmlFor='weight'>Weight</label>
              <input
                type='number'
                name='weight'
                className={`form-control w-100i${addClass(validationErrors.price, 'is-invalid')}`}
                value={form.weight}
                onChange={handleChange}
              />
              {validationErrors.weight && (
                <small className='form-text text-danger'>{validationErrors.weight}</small>
              )}
            </div>
          </div>
        </div>
        <ul className='nav nav-tabs mb-3'>
          {contentNames.map((item, i) => {
            if (!settings || !settings.available_languages.includes(item.languageKey)) return null;
            return (
              <li className='nav-item' key={i}>
                <span
                  className={`nav-link cursor-pointer${addClass(activeTab === i, 'active')}`}
                  onClick={() => setActiveTab(i)}
                  role='presentation'
                >
                  {item.name}{' '}
                  {item.languageKey === settings.default_language && (
                    <span className='text-danger'>*</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <ProductContent {...contentValues[activeTab]} onChange={handleChange} />
      </div>
      <div className='modal-footer'>
        <button type='button' className='btn btn-secondary' onClick={onClose}>
          Close
        </button>
        <button type='submit' className='btn btn-primary' onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default ManageModal;
