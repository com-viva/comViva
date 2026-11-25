
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import type { ComponentType } from 'react';
import type { MaskedViewProps } from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

interface InputProps extends Omit<TextInputProps, 'placeholder'> {
  label: string;
  multiline?: boolean;
  onPress?: () => void;
}

export function Input({
  label,
  value,
  onFocus,
  onBlur,
  multiline,
  onPress,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(42);

  const animatedValue = useRef(
    new Animated.Value(value ? 1 : 0)
  ).current;

  const isFloating = isFocused || !!value;

  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const TypedMaskedView = MaskedView as ComponentType<MaskedViewProps>;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFloating ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFloating, animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.labelContainer,
          isFloating && styles.floatingLabelContainer,
          {
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        {isFloating ? (
          <TypedMaskedView
            maskElement={
              <Text style={styles.label}>
                {label}
              </Text>
            }
          >
            <LinearGradient
              colors={[Colors.primary.start, Colors.primary.end]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.label, { opacity: 0 }]}>
                {label}
              </Text>
            </LinearGradient>
          </TypedMaskedView>
        ) : (
          <Text style={[styles.label, styles.inactiveLabel]}>
            {label}
          </Text>
        )}
      </Animated.View>

      <TextInput
        ref={inputRef}
        {...rest}
        value={value}
        onPressIn={onPress ? () => onPress() : undefined}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        onContentSizeChange={(event) => {
          if (multiline) {
            setInputHeight(Math.max(42, event.nativeEvent.contentSize.height));
          }
        }}
        style={[
          styles.input,
          multiline && { height: inputHeight },
        ]}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
      />

      {onPress && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={onPress}
          style={styles.pressOverlay}
        />
      )}

      {isFocused ? (
        <LinearGradient
          colors={[Colors.primary.start, Colors.primary.end]}
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
    minHeight: 60,
    justifyContent: 'flex-end',
  },

  labelContainer: {
    position: 'absolute',
    left: 0,
    marginBottom: 3,
    zIndex: 1,
  },

  floatingLabelContainer: {
    top: 17,
  },

  label: {
    fontSize: 16,
  },

  inactiveLabel: {
    color: Colors.text.secondary,
  },

  input: {
    minHeight: 42,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16,
    color: Colors.text.primary,
  },


  multilineInput: {
    paddingTop: 35,
    paddingBottom: 8,
  },

  inactiveLine: {
    height: 2,
    backgroundColor: Colors.border,
    pointerEvents: 'none',
  },

  activeLine: {
    height: 2,
    borderRadius: 2,
    pointerEvents: 'none',
  },

  pressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 2,
    zIndex: 10,
  },
});
