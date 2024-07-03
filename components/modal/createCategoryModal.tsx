import React, { useState } from 'react';
import { Modal, Portal, Text, Button, Provider as PaperProvider } from 'react-native-paper';

const CreateCategoryModal = () => {
  const [visible, setVisible] = useState(false);
  
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  
  const containerStyle = { backgroundColor: 'white', padding: 20 };
  
  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text style={{color:"#000"}}>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button style={{ marginTop: 30, backgroundColor: "#000" }} onPress={showModal}>
        <Text>
            show
        </Text>
      </Button>
    </PaperProvider>
  );
};

export default CreateCategoryModal;
