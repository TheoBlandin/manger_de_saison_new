import { Colors } from '@/constants/Colors';
import { Text, StyleSheet, TextProps } from 'react-native';

export function BSmallText({ children, ...props }: TextProps) {
  return (
    <Text {...props} style={[styles.text, props.style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Fredoka_400Regular',
    fontSize: 13,
    lineHeight: 13 * 1.4,
    color: Colors.textDefault
  },
});
