import { View, Text, Modal, Pressable, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { availableIcons } from '@/app/constants/Icons';
import { IIconSelectionModalProps } from '@/app/types/types';

export default function IconSelectionModal({
  visible,
  selectedIcon,
  onSelectIcon,
  onClose,
}: IIconSelectionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select an Icon</Text>
            <View style={styles.iconGrid}>
              {availableIcons.map((iconName, index) => (
                <Pressable
                  key={index}
                  onPress={() => onSelectIcon(iconName)}
                  style={styles.iconWrapper}
                >
                  <Ionicons
                    name={iconName}
                    size={40}
                    color={selectedIcon === iconName ? '#8e44ad' : '#444'}
                    style={selectedIcon === iconName && styles.selectedIcon}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 8,
    margin: 6,
  },
  selectedIcon: {
    borderWidth: 2,
    borderColor: '#8e44ad',
    borderRadius: 8,
  },
});
