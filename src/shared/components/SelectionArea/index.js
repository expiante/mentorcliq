import React, { useEffect, useState, useRef } from 'react';

// Load Vendors
import { addClass, mergeAttrs } from 'utils/appHelpers';

// Load Hooks
import { useSelector } from 'react-redux';

// Load Components
import ManageModal from './components/ManageModal';
import SelectionItem from './components/SelectionItem';
import Modal from 'shared/components/Modal';
import Loading from '../Loading';

const SelectionArea = ({
  imageUrl,
  isViewOnly,
  onItemAdded,
  onItemRemoved,
  onAddToCart,
  items = [],
  tooltipConfigs,
}) => {
  const containerRef = useRef();
  const areaRef = useRef();
  const descriptionRef = useRef();
  const imageRef = useRef();

  const { settings, fetching } = useSelector(state => state);

  const [newItem, setNewItem] = useState(null);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isResized, setIsResized] = useState(false);
  const [descriptionModalId, setDescriptionModalId] = useState(false);

  let elem = null;
  let coords = null;

  const handleSubmit = data => {
    const result = { ...newItem, ...data };
    if (result.weight === '') delete result.weight;
    onItemAdded(result);
    setNewItem(null);
  };

  const handleClose = () => {
    setNewItem(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initializeManagementTool = () => {
    const resetStates = () => {
      areaRef.current.removeChild(elem);
      areaRef.current.removeEventListener('mousemove', handleMouseOver);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = ({ pageX, pageY, target }) => {
      if (!target.isSameNode(areaRef.current)) return;

      const y = pageY - containerRef.current.offsetTop;
      const x = pageX - containerRef.current.offsetLeft;

      elem = document.createElement('DIV');
      elem.className = 'selection-item animated';

      // Setting initial styles, these styles maight be changed on mousemove
      elem.style.top = `${y}px`;
      elem.style.left = `${x}px`;

      coords = { y, x, pageX, pageY };

      areaRef.current.appendChild(elem);

      areaRef.current.addEventListener('mousemove', handleMouseOver);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseOver = ({ pageX, pageY }) => {
      if (pageX >= coords.pageX) {
        const width = pageX - containerRef.current.offsetLeft - elem.offsetLeft;
        elem.style.left = `${coords.x}px`;
        elem.style.right = null;
        elem.style.width = `${width}px`;
        delete coords.rtl;
      } else {
        elem.style.right = `${containerRef.current.clientWidth - coords.x}px`;
        elem.style.left = null;
        elem.style.width = `${coords.pageX - pageX}px`;
        coords.rtl = true;
      }

      if (pageY >= coords.pageY) {
        const height = pageY - containerRef.current.offsetTop - elem.offsetTop;
        elem.style.top = `${coords.y}px`;
        elem.style.bottom = null;
        elem.style.height = `${height}px`;
        delete coords.dtu;
      } else {
        elem.style.bottom = `${containerRef.current.clientHeight - coords.y}px`;
        elem.style.top = null;
        elem.style.height = `${coords.pageY - pageY}px`;
        coords.dtu = true;
      }
    };

    const handleMouseUp = () => {
      if (!elem) return;
      const { width, height } = elem.getBoundingClientRect();

      const elemWidth = (width * 100) / containerRef.current.clientWidth;
      const elemHeight = (height * 100) / containerRef.current.clientHeight;
      const elemTop = (elem.offsetTop * 100) / areaRef.current.clientHeight;
      const elemLeft = (elem.offsetLeft * 100) / areaRef.current.clientWidth;

      // eslint-disable-next-line consistent-return
      if (elemWidth === 0 && elemHeight === 0) return resetStates();

      setNewItem({
        coordinates: JSON.stringify({
          width: `${elemWidth}%`,
          height: `${elemHeight}%`,
          top: `${elemTop}%`,
          left: `${elemLeft}%`,
        }),
      });
      resetStates();
    };

    if (containerRef && areaRef) {
      areaRef.current.addEventListener('mousedown', handleMouseDown);
    }
  };

  const modifyNewItem = item => {
    item = mergeAttrs(item);
    return {
      ...item,
      name_en: item.name.en,
      name_hy: item.name.hy,
      name_ru: item.name.ru,
      description_en: item.description.en,
      description_hy: item.description.hy,
      description_ru: item.description.ru,
    };
  };

  const rescaleImage = () => {
    imageRef.current.style.width = `100%`;
    imageRef.current.style.height = `auto`;

    setTimeout(() => {
      if (imageRef.current.clientHeight < window.innerHeight - 44) {
        imageRef.current.style.width = 'auto';
        imageRef.current.style.height = `${window.innerHeight - 44}px`;
        setIsResized(true);
      }
    });
    setTimeout(() => setIsResized(true));
  };

  useEffect(() => {
    if (!isViewOnly) initializeManagementTool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (descriptionModalId) {
      let item = mergeAttrs(items.find(v => v.id === descriptionModalId));
      let content = item.description[settings.selected_language] || item.description.en;
      descriptionRef.current.innerHTML = content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptionModalId]);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete && imageRef.current.naturalHeight > 0) return;
    setImageLoaded(false);
    setIsResized(false);
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl && isImageLoaded && imageRef.current) {
      rescaleImage();
      window.addEventListener('resize', rescaleImage);
    }
  }, [imageUrl, isImageLoaded]);

  return (
    <div>
      {(!isImageLoaded || !isResized) && <Loading forceShow isFixed transparent={false} />}
      <div ref={containerRef} className='selection-container'>
        <img
          ref={imageRef}
          src={imageUrl}
          alt='product'
          className='no-orientation'
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
        <div ref={areaRef} className={`selection-area${addClass(!isViewOnly, 'cursor-crosshair')}`}>
          {items &&
            !!items.length &&
            items.map((item, k) => (
              <SelectionItem
                data={item}
                key={k}
                isViewOnly={isViewOnly}
                onAdd={() => onAddToCart(modifyNewItem(item), k)}
                OnEdit={() => setNewItem(modifyNewItem(item))}
                OnRemove={() => onItemRemoved(item.id)}
                tooltipConfigs={tooltipConfigs}
                onInfoBtnClick={id => setDescriptionModalId(id)}
              />
            ))}
        </div>
        {newItem && <ManageModal onSubmit={handleSubmit} onClose={handleClose} data={newItem} />}
      </div>
      {descriptionModalId && (
        <Modal
          configs={{ title: 'Product Description', hideFooter: true }}
          centered
          onClose={() => setDescriptionModalId(false)}
        >
          <div ref={descriptionRef} className='product-content' />
        </Modal>
      )}
    </div>
  );
};

export default SelectionArea;
