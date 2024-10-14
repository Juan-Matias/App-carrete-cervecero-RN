import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimeSelector = ({ mode, label, onConfirm }) => {
  const [isPickerVisible, setPickerVisibility] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const showPicker = () => {
    setPickerVisibility(true);
  };

  const hidePicker = () => {
    setPickerVisibility(false);
  };

  const handleConfirm = (value) => {
    const formattedValue =
      mode === 'date'
        ? value.toLocaleDateString('es-ES')
        : value.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    setSelectedValue(formattedValue);
    onConfirm(formattedValue); // Notifica al componente padre
    hidePicker();
  };

  return (
    <>
      <Button mode="outlined" onPress={showPicker}>
        {selectedValue ? selectedValue : label}
      </Button>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </>
  );
};

export default DateTimeSelector;
