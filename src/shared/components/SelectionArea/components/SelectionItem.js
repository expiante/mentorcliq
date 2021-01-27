import React, { useEffect, useState, useRef } from 'react';

// Load Hooks
import { useSelector } from 'react-redux';
import useOutsideClick from 'shared/hooks/useOutsideClick';

// Load Vendors
import { addClass, bindNum, isMobileDevice, mergeAttrs } from 'utils/appHelpers';

// Load Components
import ReactTooltip from 'react-tooltip';

// Load Consts
import { currencies } from 'configs/consts';

// Load Icons
import { IconInfoFilled } from 'shared/components/Icons';

const SelectionItem = ({
  data,
  isViewOnly,
  onAdd,
  OnEdit,
  OnRemove,
  tooltipConfigs = {},
  onInfoBtnClick,
}) => {
  data = mergeAttrs(data);

  const settings = useSelector(state => state.settings);

  const [isMobileTooltipViewed, setMobileTooltipViewed] = useState(false);

  const isMobile = isMobileDevice();

  let dataTipRef = useRef();
  let selectionItemRef = useRef();

  const handleAdd = () => {
    if (isMobile && !isMobileTooltipViewed) {
      setMobileTooltipViewed(true);
    } else {
      onAdd(data.id);
    }
  };

  useOutsideClick(selectionItemRef, () => {
    if (isMobileTooltipViewed) {
      setMobileTooltipViewed(false);
      // setTimeout(() => ReactTooltip.hide(dataTipRef), 100);
      ReactTooltip.hide(dataTipRef)
    }
  });

  // Manually hide tooltip on scrolling the scroll-container
  useEffect(() => {
    const handleTooltipManualHide = () => {
      ReactTooltip.hide(dataTipRef);
      setMobileTooltipViewed(false);
    };
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.addEventListener('scroll', handleTooltipManualHide);
      return () => container.removeEventListener('scroll', handleTooltipManualHide);
    }
  }, []);

  useEffect(() => {
    isMobileTooltipViewed && ReactTooltip.show(dataTipRef);
  }, [isMobileTooltipViewed]);

  if (!settings) return null;

  const currency = currencies.find(item => item.value === settings.currency);

  const bindPopupInfo = data => {
    const priceIdentifier =
      settings.currency_appearance === 'name' ? currency.name : currency.symbol;
    const productName =
      data.name[settings.selected_language] ||
      data.name[settings.default_language] ||
      data.name.en ||
      'Untitled';
    const identifierFromLeft = `${priceIdentifier} ${bindNum(data.price)}`;
    const identifierFromRight = `${bindNum(data.price)} ${priceIdentifier}`;
    const fullPrice =
      settings.currency_symbol_placement === 'right' ? identifierFromRight : identifierFromLeft;
    const popupInfo = `${productName}${settings.price_in_popup ? ` - ${fullPrice}` : ''} id=${
      data.id
    }`;
    return popupInfo;
  };

  return (
    <div
      id={`item-${data.id}`}
      className={`selection-item${addClass(
        isViewOnly,
        `is-view${settings.shelf_borders ? '__bordered' : ''}`,
      )}`}
      ref={selectionItemRef}
      style={JSON.parse(data.coordinates)}
    >
      <div
        className={`item-content${addClass(isMobileTooltipViewed, 'focus')}`}
        data-tip={bindPopupInfo(data)}
        ref={ref => (dataTipRef = ref)}
        onTouchEnd={() => isViewOnly && handleAdd()} // For Touch Devices
        onClick={() => !isMobile && isViewOnly && handleAdd()} // For Desktop
        role='presentation'
      >
        {!isViewOnly && (
          <>
            <span
              className='fa-stack edit fa-1x'
              onClick={e => {
                e.stopPropagation();
                OnEdit();
              }}
              role='presentation'
            >
              <i className='far fa-circle fa-stack-2x fa-inverse' />
              <i className='fas fa-pen fa-stack-1x fa-inverse' />
            </span>
            <span
              className='fa-stack remove fa-1x'
              onClick={e => {
                e.stopPropagation();

                OnRemove();
              }}
              role='presentation'
            >
              <i className='far fa-circle fa-stack-2x fa-inverse' />
              <i className='fas fa-times fa-stack-1x fa-inverse' />
            </span>
          </>
        )}
      </div>
      {isViewOnly && (
        <span className='plus-btn fa-stack fa-1x'>
          <i className='fas fa-circle fa-stack-2x' />
          <i className='fas fa-plus fa-stack-1x fa-inverse' />
        </span>
      )}
      <ReactTooltip
        effect='solid'
        delayHide={isMobile ? 0 : 400}
        delayUpdate={20}
        {...tooltipConfigs}
        getContent={dataTip => {
          if (!dataTip) return null;
          let text = dataTip.split(' ');
          let id = text[text.length - 1].replace(/\D+/g, '');
          text = text.splice(0, text.length - 1).join(' ');
          return (
            <>
              {text}
              {tooltipConfigs.showInfoBtn && (
                <button onClick={() => onInfoBtnClick(id)} className='btn btn-sm p-0 ml-2'>
                  <IconInfoFilled />
                </button>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default SelectionItem;
