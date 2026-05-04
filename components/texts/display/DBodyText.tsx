import { Colors } from '@/constants/Colors';
import { Text, StyleSheet, TextProps } from 'react-native';

export function DBodyText(props: TextProps) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Fredoka-One',
    fontSize: 16,
    color: Colors.textDefault
  },
});
