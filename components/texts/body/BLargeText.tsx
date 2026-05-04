import { Colors } from '@/constants/Colors';
import { Text, StyleSheet, TextProps } from 'react-native';

export function BLargeText(props: TextProps) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Fredoka_400Regular',
    fontSize: 20,
    lineHeight: 20 * 1.4,
    color: Colors.textDefault
  },
});
