import React from 'react';
import Select from 'react-select';
import { Trans } from '@lingui/macro';

export const ICategorySelect = (props) => {
  const { isMulti } = props;
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgba(255,255,255,0.7)' : 'transparent',
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.3)',
      },
    }),
    multiValue: base => ({
      ...base,
      backgroundColor: 'rgb(115, 158, 226, 0.5)',
      border: 'solid 2px blue',
      borderRadius: '25px',
    }),
    multiValueLabel: base => ({
      ...base,
      color: 'black',
      fontWeight: 'bold',
    }),
    multiValueRemove: base => ({
      ...base,
      borderRadius: '25px',
    }),
  };
  return (
    <Select
      styles={isMulti ? customStyles : {}}
      menuPortalTarget={document.body}
      cacheOptions
      name="category"
      defaultOptions
      getOptionLabel={opt => opt.name}
      getOptionValue={opt => opt.id}
      placeholder={<Trans>Select category...</Trans>}
      noOptionsMessage={() => <Trans>No categories to show</Trans>}
      {...props}
    />
  );
};

const CategorySelect = ICategorySelect;
export default CategorySelect;
