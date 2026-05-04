import { Colors } from '@/constants/Colors';
import { Text, StyleSheet, TextProps } from 'react-native';

export function BBodyText(props: TextProps) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Fredoka_400Regular',
    fontSize: 16,
    lineHeight: 16 * 1.4,
    color: Colors.textDefault
  },
});
