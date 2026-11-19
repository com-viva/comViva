import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

interface InputProps extends Omit<TextInputProps, 'placeholder'> {
  label: string;
}

export function Input({ label, value, onFocus, onBlur, ...rest }: InputProps) {

  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const isFloating = isFocused || !!value;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFloating ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFloating, animatedValue]);

  const translateY = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });
  const scale = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] });

  return (
    <View style={styles.container}>
      <Animated.Text
        pointerEvents="none"
        style={[
          styles.label,
          {
            transform: [ { translateY }, { scale } ],
            color: isFloating ? Colors.primary.end : Colors.text.secondary,
          },
        ]}
      >
        {label}
      </Animated.Text>

      <TextInput
        {...rest}
        value={value}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={styles.input}
        placeholder=""
      />

      {isFocused ? (
        <LinearGradient
          colors={[
            Colors.primary.start,
            Colors.primary.end,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.activeLine}
        />
      ) : (
        <View style={styles.inactiveLine} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'flex-end',
  },

  label: {
    position: 'absolute',
    left: 0,
    top: 17,
    fontSize: 16,
    zIndex: 1,
  },

  input: {
    height: 42,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16,
    color: Colors.text.primary,
  },

  inactiveLine: {
    height: 1,
    backgroundColor: Colors.border,
  },

  activeLine: {
    height: 2,
    borderRadius: 2,
  },
});
