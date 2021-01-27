import React, { useRef, useEffect } from 'react';

// Load Vendors
import { addClass } from 'utils/appHelpers';

// Load Defaults
import { dialogDefaultConfigs } from 'configs/consts';

const Modal = ({
  children,
  size = 'md',
  centered,
  preventOutsideClick,
  onClose,
  onSubmit,
  className = '',
  configs = {},
}) => {
  const container = useRef();

  const dialogConfigs = { ...dialogDefaultConfigs, ...configs };

  const handleKeydown = e => e.keyCode === 27 && handleClose();

  const handleClose = () => {
    if (preventOutsideClick) return;
    container.current.classList.remove('show');
    setTimeout(onClose, 300);
  };

  const handleSubmit = () => {
    container.current.classList.remove('show');
    setTimeout(onSubmit, 300);
  };

  useEffect(() => {
    container.current.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    if (preventOutsideClick) return;
    document.addEventListener('keydown', handleKeydown, true);
    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('keydown', handleKeydown, true);
      document.body.style.overflow = 'visible';
      document.body.classList.remove('modal-open');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={container}
      className={`modal ${addClass(className, className)}`}
      onClick={handleClose}
      role='presentation'
    >
      <div
        className={`modal-dialog modal-${size}${addClass(centered, 'modal-dialog-centered')}`}
        onClick={e => e.stopPropagation()}
        role='presentation'
      >
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{dialogConfigs.title}</h5>
            {!dialogConfigs.hideCloseBtn && (
              <button type='button' className='close' onClick={handleClose}>
                <span aria-hidden='true'>&times;</span>
              </button>
            )}
          </div>
          <div className='modal-body'>
            {configs.message && <p>{configs.message}</p>}
            {children}
          </div>
          {!dialogConfigs.hideFooter && (
            <div className='modal-footer'>
              {!dialogConfigs.hideCancelBtn && (
                <button
                  type='button'
                  className={dialogConfigs.cancelBtnClass}
                  onClick={handleClose}
                >
                  {dialogConfigs.cancelBtnIcon} {dialogConfigs.cancelBtnText}
                </button>
              )}
              {!dialogConfigs.hideSubmitBtn && (
                <button
                  type='button'
                  className={dialogConfigs.submitBtnClass}
                  onClick={handleSubmit}
                >
                  {dialogConfigs.submitBtnIcon} {dialogConfigs.submitBtnText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
